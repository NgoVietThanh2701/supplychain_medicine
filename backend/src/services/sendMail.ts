const nodemailer = require('nodemailer');

const sendMail = async (mailOptions: any) => {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      secureConnection: false,
      name: "Agri",
      auth: {
         user: process.env.EMAIL_ADMIN,
         pass: process.env.PASS_MAIL
      },
      tls: {
         rejectUnauthorized: true
      }
   });

   await transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
         return error;
      } else {
         console.log(info)
         return info;
      }
   });
}

export default sendMail;