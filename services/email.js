const Mailgen = require('mailgen');


class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
       case 'production':
        this.link = 'link for production';
        break;
      default:
        this.link = 'http://localhost:3000';
        break
    }
  }
  #createTemplateVerificationEmail(token, name) {
    const mailGenerator = new Mailgen({
      theme: 'cerberus',
      product: {
        name: 'viktoriiaAPI',
        link: this.link,
      },
    })
  
    const email = {
      body: {
        name,
        intro: 'Welcome to ViktoriiaAPI! We are very excited to have you on board.',
        action: {
          instructions: 'To get started, please click here:',
          button: {
            color: '#22BC66', 
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${token}`
          }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
      }
    }
    return mailGenerator.generate(email)
  }
  
  async sendEmail(token, email, name) {
    const emailBody = this.#createTemplateVerificationEmail(token, name);
    const result = await this.sender.send({
      to: email,
      subject: 'Verify your email',
      html: emailBody
    })
    console.log(result)
  }
}

module.exports = EmailService;