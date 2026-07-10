import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const origin = request.nextUrl.origin;

    if (!code) {
        return NextResponse.redirect(`${origin}/?auth_error=no_code`);
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.redirect(`${origin}/?auth_error=not_configured`);
    }

    try {
        // 1. Đổi code lấy access_token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
        });
        const tokenData = await tokenRes.json();

        if (tokenData.error || !tokenData.access_token) {
            return NextResponse.redirect(`${origin}/?auth_error=token_failed`);
        }

        // 2. Lấy thông tin user từ GitHub
        const [userRes, emailRes] = await Promise.all([
            fetch('https://api.github.com/user', {
                headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'Accept': 'application/json' },
            }),
            fetch('https://api.github.com/user/emails', {
                headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'Accept': 'application/json' },
            }),
        ]);

        const githubUser = await userRes.json();
        const emails = await emailRes.json();

        const primaryEmail = Array.isArray(emails)
            ? (emails.find((e: { primary: boolean; email: string }) => e.primary)?.email || emails[0]?.email)
            : null;

        const githubId = String(githubUser.id);
        const displayName = githubUser.name || githubUser.login;
        const avatarUrl = githubUser.avatar_url;

        // 3. Tìm hoặc tạo user trong DB
        await dbConnect();

        let user = await User.findOne({ githubId });

        if (!user) {
            // Thử tìm theo email nếu đã có tài khoản trước đó
            if (primaryEmail) {
                user = await User.findOne({ username: primaryEmail });
            }

            if (!user) {
                // Tạo username độc nhất từ GitHub login
                let baseUsername = githubUser.login.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                let username = baseUsername;
                let counter = 1;
                while (await User.findOne({ username })) {
                    username = `${baseUsername}_${counter++}`;
                }

                user = await User.create({
                    username,
                    name: displayName,
                    role: 'user',
                    githubId,
                    avatarUrl,
                    likedSongs: [],
                    playlists: [],
                    sessions: [],
                });
            } else {
                // Gắn githubId vào tài khoản cũ
                user.githubId = githubId;
                user.avatarUrl = user.avatarUrl || avatarUrl;
                await user.save();
            }
        } else {
            // Cập nhật avatar nếu thay đổi
            if (user.avatarUrl !== avatarUrl) {
                user.avatarUrl = avatarUrl;
                await user.save();
            }
        }

        // 4. Tạo device session
        const deviceId = Math.random().toString(36).substring(2, 15);
        if (!user.sessions) user.sessions = [];
        user.sessions.push({ deviceId, lastActive: new Date(), label: 'GitHub OAuth' });
        await user.save();

        // 5. Encode user data vào URL để client nhận (an toàn vì chỉ dùng redirect nội bộ)
        const userData = encodeURIComponent(JSON.stringify({
            username: user.username,
            name: user.name,
            role: user.role,
            deviceId,
            avatarUrl: user.avatarUrl,
        }));

        return NextResponse.redirect(`${origin}/?github_user=${userData}`);

    } catch (error) {
        console.error('GitHub OAuth error:', error);
        return NextResponse.redirect(`${origin}/?auth_error=server_error`);
    }
}
