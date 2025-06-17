import nodemailer from "nodemailer";

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,  // Avoid TLS cert errors
        },
    });


    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    };

    // Send Email
    await transporter.sendMail(options);
};

export default sendEmail;
