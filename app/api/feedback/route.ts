import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import nodemailer from 'nodemailer';

export async function GET() {
    try {
        await dbConnect();
        const feedbacks = await Feedback.find({}).sort({ timestamp: -1 });
        return NextResponse.json({ success: true, data: feedbacks });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email, message } = body;
        
        const feedback = await Feedback.create(body);

        // Send Email Notification
        // Note: These credentials should be in .env.local
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'khoakpham83@gmail.com',
            subject: '🔔 Mới! Phản hồi từ người dùng Sonify',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #6366f1;">Sonify Feedback</h2>
                    <p><strong>Người gửi:</strong> ${email}</p>
                    <p><strong>Nội dung:</strong></p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
                        ${message}
                    </div>
                    <hr/>
                    <p style="font-size: 0.8rem; color: #777;">Email này được gửi tự động từ hệ thống Sonify.</p>
                </div>
            `
        };

        // We don't await this to keep the API response fast, or handle errors silently
        transporter.sendMail(mailOptions).catch(err => console.error('Email Error:', err));

        return NextResponse.json({ success: true, data: feedback });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function DELETE() {
    try {
        await dbConnect();
        // Danger: Clears all feedback. In production check admin token first.
        await Feedback.deleteMany({});
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
