import nodemailer from 'nodemailer';

export default async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    return await transporter.sendMail({
      from: '"DevCollab"<devcollabapp@gmail.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error(err);
  }
};
