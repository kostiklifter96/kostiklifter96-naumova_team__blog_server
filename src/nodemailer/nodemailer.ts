import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(
    {
        host: "smtp.mail.ru",
        port: 465,
        secure: true,
        auth: {
            user: "naumova_team@mail.ru",
            pass: process.env.TOKEN_MAILLER,
        },
    },
    {
        from: `<naumova_team@mail.ru>`,
    },
);

export const sendHello = async (message: { name: string; email: string }) => {
    const info = await transporter.sendMail({
        to: message.email,
        subject: `Naumova_team`,
        // text: message.text,
        html: `
        Здравствуйте, ${message.name}!<br><br>
        
        Вы успешно зарегестрированы!<br><br>
        
        В ближайшее время мы с вами свяжемся!<br><br>

        С уважением, служба поддержки Naumova_team!`,
    });

    console.log("Message sent: %s", info.messageId);
};

export const sendEmailFromAdminMailer = async (message: {
    text: string;
    email: string;
}) => {
    const info = await transporter.sendMail({
        to: message.email,
        subject: `Naumova_team`,
        html: `${message.text}`,
    });

    console.log("Message sent: %s", info.messageId);
};

export const sendLinkPrivateGroup = async (message: {
    name: string;
    email: string;
}) => {
    const info = await transporter.sendMail({
        to: message.email,
        subject: `Naumova_team`,
        // text: message.text,
        html: `
        Здравствуйте, ${message.name}!<br><br>
        
        Вы успешно оплатили участие в фитнес-проекте Naumova_team!<br><br>
        
        Пройдите по этой ссылке, чтобы вступить в общий чат:<br><br>

        https://t.me/+KA5EtLi0wh9lMmNi 

        <br><br>
        
        С уважением, служба поддержки Naumova_team!`,
    });

    console.log("Message sent: %s", info.messageId);
};

export const sendDB = async () => {
    const info = await transporter.sendMail({
        to: "naumova_team@mail.ru",
        subject: `Обновленная БД`,
        // text: message.text,
        html: `Добавлен участник!`,
        attachments: [{ path: "./naumova_team.sqlite" }],
    });

    console.log("Message sent: %s", info.messageId);
};

export const sendErrorMessage = async (message: string) => {
    const info = await transporter.sendMail({
        to: "naumova_team@mail.ru",
        subject: `Ошибка`,
        // text: message.text,
        html: `ошибка
            ${message}
        
        `,
    });

    console.log("Message sent: %s", info.messageId);
};
