import nodemailer from "nodemailer";
import { MailOptions } from "@/interface/MailInterfaces";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const sendEmail = async (options: MailOptions): Promise<boolean> => {
  const smtpTransporter: SMTPTransport.Options = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(smtpTransporter);

  const mailOptions = {
    from: `"Quillzo" <${process.env.EMAIL_USER as string}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    // Verify the SMTP connection
    await new Promise<void>((resolve, reject) => {
      transporter.verify((error) => {
        if (error) {
          console.log("Error in SMTP connection: ", error);
          return reject(error);
        }
        console.log("Server is ready to take our messages");
        resolve();
      });
    });

    // Send the email
    const sentMessageInfo = await transporter.sendMail(mailOptions);
    return !!sentMessageInfo.messageId;
  } catch (error) {
    console.error("Failed while sending email: ", error);
    return false;
  }
};

export default sendEmail;
