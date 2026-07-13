const nodemailer = require("nodemailer");

// .env mein ye already hai:
// EMAIL=youraddress@gmail.com
// APP_PASSWORD=your16digitapppassword

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>Aapne apna password reset karne ki request ki hai. Neeche diya gaya OTP use karein:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; background: #f2f2f2; padding: 12px 20px; text-align: center; border-radius: 6px;">
          ${otp}
        </div>
        <p>Ye OTP 10 minute ke liye valid hai. Agar aapne ye request nahi ki, is email ko ignore karein.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };