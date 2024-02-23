const nodemailer = require("nodemailer");

class Mail {
  constructor() {}

  rappelRendezVous() {
    const email_string = `
    <html>
      <head>
          <style>
          </style>
      </head>
      <body style="font-family: 'Arial', sans-serif; line-height: 1.6;">
          <h3 style="color: #333;">Rappel de votre rendez-vous</h3>
          <p style="color: #555;">Nous sommes ravis de vous informer que votre abonnement est maintenant actif et réussi ! </p>
          Merci d'avoir choisi Translaty. Vous pouvez désormais profiter de tous les avantages et du contenu exclusif inclus dans votre abonnement.
      </body>
    </html>`;
    return email_string;
  }

  async sendEmailRappel(to) {
    await this.sendEmailnodemailer(
      "Rappel rendez-vous, salon de beauté",
      to,
      this.rappelRendezVous()
    );
  }

  async sendEmailnodemailer(subject, to, html) {
    const mymail = "mihajaraman@gmail.com";
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: mymail,
        pass: "yfrexltqylzgqtca",
      },
    });

    const mailOptions = {
      from: "Salon de beauté",
      to: to,
      subject: subject,
      html: html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("E-mail envoyé : " + info.response);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Mail;
