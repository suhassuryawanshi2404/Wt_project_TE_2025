import { UserModel } from '@/models/user.model';
import bcrypt from "bcrypt"
import nodemailer from 'nodemailer';

export async function sendMail({ email, emailType, userId }: {
  email: string;
  emailType: string;
  userId: string;
}) {

  try {

    const verifyEmailToken = await bcrypt.hash(userId, 10);

    const verifyEmailHtml = `
    <p>Click <a href="${process.env.DOMAIN}/verify-email?token=${verifyEmailToken}">here</a> to ${emailType === "sign-up" ? "verify your email" : "reset your password"}
    or copy and paste the following link in your browser.
    </p>
    ${process.env.DOMAIN}/verify-email?token=${verifyEmailToken},
    <p>If you didn't request this, please ignore this email.</p>
  `;

    const resetPasswordHtml = `
      <p>Click <a href="${process.env.DOMAIN}/reset-password?token=${verifyEmailToken}">here</a> to ${emailType === "sign-up" ? "verify your email" : "reset your password"}
      or copy and paste the following link in your browser.
      </p>
      ${process.env.DOMAIN}/reset-password?token=${verifyEmailToken},
      <p>If you didn't request this, please ignore this email.</p>
    `;

    const doctorsAppointmentScheduledHtml = `
      <p>Your appointment has been scheduled successfully. 
      If you want to reschedule click here</p>
    `;

    const patientsAppointmentScheduledHtml = `
      <p>Your appointment has been scheduled successfully. 
      If you want to reschedule click here</p>
    `;

    const appointmentCancelledHtml = `
      <p>Your appointment has been cancelled successfully.</p>
    `;

    const doctorsAppointmentRescheduledHtml = `
      <p>Your appointment has been rescheduled successfully. 
      If you want to reschedule click here</p>
    `;

    const patientsAppointmentRescheduledHtml = `
      <p>Your appointment has been rescheduled successfully. 
      If you want to reschedule click here</p>
    `;

    const appointmentNoShowHtml = `
      <p>You can schedule another slot.</p>
    `

    let subjectLine = "";
    let htmlBody = ``;

    switch (emailType) {
      case "sign-up":
        subjectLine = "Verify Your Email";
        htmlBody = verifyEmailHtml;
        await UserModel.findByIdAndUpdate(userId, {
          $set: {
            verifyEmailToken,
            verifyEmailTokenExpires: Date.now() + 3600000
          }
        });
        break;
      case "reset-password":
        subjectLine = "Reset Password Email"
        htmlBody = resetPasswordHtml;
        await UserModel.findByIdAndUpdate(userId, {
          $set: {
            resetPasswordToken: verifyEmailToken,
            resetPasswordTokenExpires: Date.now() + 3600000
          }
        });
        break;
        case "doctors-appointment-scheduled":
          subjectLine = "Your appointment is scheduled"
          htmlBody = doctorsAppointmentScheduledHtml
        break;
        case "patients-appointment-scheduled":
          subjectLine = "Your appointment is scheduled"
          htmlBody = patientsAppointmentScheduledHtml
        break;
        case "doctors-appointment-rescheduled":
          subjectLine = "Your appointment is scheduled"
          htmlBody = doctorsAppointmentRescheduledHtml
        break;
        case "patients-appointment-rescheduled":
          subjectLine = "Your appointment is scheduled"
          htmlBody = patientsAppointmentRescheduledHtml
        break;
        case "appointment-canclled":
          subjectLine = "Your appointment is canclled"
          htmlBody = appointmentCancelledHtml
          break;
        case "appointment-no-show":
            subjectLine = "You failed to show at sheduled time"
            htmlBody = appointmentNoShowHtml
          break;
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f3caee00ef5161",
        pass: "f101d7b6bbda43"
      }
    });

    const options = {
      from: 'tejaskakani@tejas.com',
      to: email,
      subject: subjectLine,
      html: htmlBody
    }

    const mailResponse = await transport.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return mailResponse;

  }
  catch (err: any) {
    throw new Error(err.message);

  }
}