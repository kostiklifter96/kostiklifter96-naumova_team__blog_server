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
        subject: `Naumova Team`,
        // text: message.text,
        html: `
        Здравствуйте, ${message.name}!<br><br>
        
        Вы успешно зарегестрированы!<br><br>
        
        В ближайшее время мы с вами свяжемся!<br><br>

        С уважением, команда Naumova Team!`,
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
            subject: `Naumova Team`,
            html: `${message.text}<br><br>
        Если вам пришло пустое сообщение, просьба написать про это на naumova_team@mail.ru
        `,
        });
        console.log(
            "Message sent sendEmailFromAdminMailer: %s",
            info.messageId,
        );
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
        subject: `Naumova Team`,
        // text: message.text,
        html: `
        Здравствуйте, ${message.name}!<br><br>
        
        Вы успешно оплатили участие в фитнес-проекте Naumova Team!<br><br>
        
        Пройдите по этой ссылке, чтобы вступить в общий чат:<br><br>

        ${process.env.TG_GROUP_CHAT} 

        <br><br>
        
        С уважением, команда Naumova Team!`,
    });

    console.log("Message sent sendLinkPrivateGroup: %s", info.messageId);
};

export const sendDB = async () => {
    const info = await transporter.sendMail({
        to: "naumova_team@mail.ru",
        subject: `Обновленная БД`,
        // text: message.text,
        html: `Добавлен участник!`,
        attachments: [{ path: "./naumova_team.sqlite" }],
    });

    console.log("Message sent sendDB: %s", info.messageId);
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

    console.log("Message sent sendDB: %s", info.messageId);
};

export const sendNewsLetter = async (message: {
    name: string;
    email: string;
    title: string;
    text: string;
}) => {
    try {
        const newText = message.text.replace(
            /ИМЯ_ПОЛЬЗОВАТЕЛЯ/g,
            ` ${message.name} `,
        );

        const info = await transporter.sendMail({
            to: message.email.toLowerCase(),
            subject: `Naumova Team: ${message.title}!`,
            html: `
                ${newText} <br><br>
                С уважением, команда Naumova Team!`,
        });

        console.log(`Отправленно успешно ${message.email}: %s`, info.messageId);
    } catch (error) {
        console.error(`Не успешно ${message.email}:`, error);
        throw new Error("Failed to send email.");
    }
};
