import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
        return NextResponse.json({ error: 'GitHub OAuth chưa được cấu hình' }, { status: 500 });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        scope: 'read:user user:email',
        allow_signup: 'true',
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    return NextResponse.redirect(githubAuthUrl);
}
