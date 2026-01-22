import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, pdfBase64, invoiceId } = await request.json();

    if (!to || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return NextResponse.json(
        { error: 'Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `SollAI <${gmailUser}>`,
      to,
      subject,
      text: body,
      attachments: pdfBase64
        ? [
            {
              filename: `${invoiceId || 'invoice'}.pdf`,
              content: pdfBase64,
              encoding: 'base64',
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
