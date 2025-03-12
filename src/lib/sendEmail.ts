import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, message: string) {
  try {
    const response = await resend.emails.send({
      from: "Your Job Application <noreply@eujobs.co>", // ✅ Use a verified domain from Resend
      to: [to],
      subject,
      html: `<p>${message}</p>`, // ✅ Supports HTML formatting
    });

    console.log("✅ Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email.");
  }
}
