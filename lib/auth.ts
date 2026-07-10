import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Verifies that the request comes from an authenticated admin user.
 * Reads the `x-username` header and checks the user's role in the database.
 * Returns `true` only when the user exists and has the `admin` role.
 */
export async function verifyAdmin(request: Request): Promise<boolean> {
    try {
        const username = request.headers.get('x-username');
        if (!username) return false;
        await dbConnect();
        const user = await User.findOne({ username });
        return user?.role === 'admin';
    } catch {
        return false;
    }
}
