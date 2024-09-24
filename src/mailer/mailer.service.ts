import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'hbs';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import appEnv from 'src/env';
@Injectable()
export class MailerService {
  private hbs;

  constructor() {
    this.hbs = hbs.handlebars;
    this.hbs.registerHelper

    this.registerPartials();
  }

  private registerPartials() {
    const partialsDir = join(__dirname, '..', '..', 'public', 'templates', 'partials');
    const filenames = readdirSync(partialsDir);

    filenames.forEach((filename) => {
      const partialName = filename.split('.')[0];
      const filePath = join(partialsDir, filename);
      const partialTemplate = readFileSync(filePath, 'utf8');
      hbs.registerPartial(partialName, partialTemplate); // Register each partial
    });
  }

  // Load and compile the template using hbs
  private compileTemplate(templateName: string, context: any): string {
    const filePath = join(__dirname, '..', '..', 'public', 'templates', `${templateName}.hbs`);
    const source = readFileSync(filePath, 'utf8');
    const template = this.hbs.compile(source); // Compile the template with Handlebars
    return template(context); // Apply the context
  }

  async sendMail({ to, subject, templateName, context }: { to: string; subject: string; templateName: string; context: any }) {
    console.log({
      // debug: true,
      // logger: true, 
      host: appEnv.SMTP_HOST,
      port: appEnv.SMTP_PORT, 
      auth: {
        user: appEnv.SMTP_USER,
        pass: appEnv.SMTP_PASSWORD
      },
    })
    const transporter = nodemailer.createTransport({
      debug: true,
      logger: true, 
      host: appEnv.SMTP_HOST,
      port: appEnv.SMTP_PORT, 
      auth: {
        user: appEnv.SMTP_USER,
        pass: appEnv.SMTP_PASSWORD
      },
    });

    const html = this.compileTemplate(templateName, context); // Compile the template with data


    const mailOptions = {
      from: `"${appEnv.MAIL_FROM_USER}" ${appEnv.MAIL_FROM_EMAIL}`,
      to,
      subject,
      html, // Use the compiled HTML
    };


    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
