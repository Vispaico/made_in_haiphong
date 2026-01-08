
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactFormSchema } from '@/lib/validators';
import { serverEnv } from '@/env/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, email, message, fax } = payload;

    // Honeypot check
    if (fax) {
      return NextResponse.json({ message: 'Bot submission detected.' }, { status: 200 });
    }

    const parsed = contactFormSchema.safeParse({ name, email, message });
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid form submission', details: parsed.error.flatten() }, { status: 400 });
    }

    if (!serverEnv.SMTP_HOST || !serverEnv.SMTP_PORT || !serverEnv.SMTP_USER || !serverEnv.SMTP_PASS || !serverEnv.CONTACT_FORM_RECEIVER_EMAIL) {
      return NextResponse.json({ error: 'Contact form email service is not configured.' }, { status: 503 });
    }

    // --- IMPORTANT ---
    // Replace with your actual email service provider's details.
    // For security, use environment variables instead of hardcoding credentials.
    const transporter = nodemailer.createTransport({
      host: serverEnv.SMTP_HOST,
      port: Number(serverEnv.SMTP_PORT),
      secure: Number(serverEnv.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: serverEnv.SMTP_USER,
        pass: serverEnv.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Made in Haiphong Contact Form" <${serverEnv.SMTP_USER}>`,
      replyTo: email,
      to: serverEnv.CONTACT_FORM_RECEIVER_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `<p>You have a new contact form submission:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });

  } catch (error) {
    logger.error({ error }, 'Failed to send email');
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
