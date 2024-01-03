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
        to: message.email.toLowerCase(),
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
    try {
        const info = await transporter.sendMail({
            to: message.email.toLowerCase(),
            subject: `Naumova_team`,
            html: `${message.text}<br><br>
        Если вам пришло пустое сообщение, просьба написать про это на naumova_team@mail.ru
        `,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const sendLinkPrivateGroup = async (message: {
    name: string;
    email: string;
}) => {
    const info = await transporter.sendMail({
        to: message.email.toLowerCase(),
        subject: `Naumova_team`,
        // text: message.text,
        html: `
        Здравствуйте, ${message.name}!<br><br>
        
        Вы успешно оплатили участие в фитнес-проекте Naumova_team!<br><br>
        
        Пройдите по этой ссылке, чтобы вступить в общий чат:<br><br>

        ${process.env.TG_GROUP_CHAT} 

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

export const sendNewsLetter = async (message: {
    name: string;
    email: string;
    title: string;
    text: string;
}) => {
    const newText = message.text.replace(
        /ИМЯ_ПОЛЬЗОВАТЕЛЯ/g,
        ` ${message.name} `,
    );
    const info = await transporter.sendMail({
        to: message.email.toLowerCase(),
        subject: `Naumova_team: ${message.title}!`,
        // text: message.text,
        html: ` 
        ${newText} <br><br>
        
        С уважением, команда Naumova_team!`,
    });

    console.log("Message sent: %s", info.messageId);
};
