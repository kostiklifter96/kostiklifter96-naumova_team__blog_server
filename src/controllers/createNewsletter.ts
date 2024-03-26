import "dotenv/config";
import { Request, Response } from "express";
import { getAllClientsFromDB } from "../dataBase/db.js";
import { sendNewsLetter } from "../nodemailer/nodemailer.js";
import { INaumovaTeamClient } from "../types/types.js";

const sendAllMessage = async (dataFromFront: {
    title: string;
    text: string;
    threads: number;
    paymentStatus: number;
}) => {
    let clientList: INaumovaTeamClient[] = [];
    await getAllClientsFromDB().then((res) => {
        clientList = [].concat(JSON.parse(JSON.stringify(res)));
    });

    // const testArr = [
    //     {
    //         id: 1,
    //         name: "Pabloerroeer",
    //         email: "kostikmaппудil.96@mail.ru",
    //         stream: 1,
    //         paymentStatus: 0,
    //     },

    //     { id: 5, name: "Pablo", email: "kostikmail.96@mail.ru", stream: 3 },
    //     {
    //         id: 2,
    //         name: "Kostya",
    //         email: "kypreichicsimba@gmail.com",
    //         stream: 2,
    //         paymentStatus: 1,
    //     },
    //     { id: 3, name: "Pleo", email: "kostikmail.96@mail.ru", stream: 1 },
    //     {
    //         id: 4,
    //         name: "Konstantsin",
    //         email: "kypreichicsimba@gmail.com",
    //         stream: 3,
    //         paymentStatus: 0,
    //     },

    //     {
    //         id: 4,
    //         name: "Kirill",
    //         email: "kypreichicsimba@gmail.com",
    //         stream: 3,
    //         paymentStatus: 1,
    //     },
    //     {
    //         id: 6,
    //         name: "Мikola",
    //         email: "kypreichicsimba@gmail.com",
    //         stream: 2,
    //         paymentStatus: 1,
    //     },
    // ];

    if (dataFromFront.threads === -1) {
        //* уникальные пользователи
        const res = clientList
            .filter((el) => {
                if (
                    dataFromFront.paymentStatus !== 0 &&
                    dataFromFront.paymentStatus !== 1
                ) {
                    return el;
                } else {
                    return el.paymentStatus === dataFromFront.paymentStatus;
                }
            })
            .filter((el, i, array) => {
                return (
                    array.findIndex(
                        (o) => o.email.toLowerCase() === el.email.toLowerCase(),
                    ) === i
                );
            });

        console.log("res", res.length);

        for (let i = 0; i < res.length; i++) {
            const user = { ...res[i], ...dataFromFront };
            try {
                await sendNewsLetter(user);
            } catch (error) {
                console.error(`Ошибка отправки ${user.email}:`, error);
            }
        }
    } else {
        const res = clientList
            .filter((el) => {
                if (
                    dataFromFront.paymentStatus !== 0 &&
                    dataFromFront.paymentStatus !== 1
                ) {
                    return el;
                } else {
                    return el.paymentStatus === dataFromFront.paymentStatus;
                }
            })
            .filter((el) => el.stream === dataFromFront.threads);

        for (let i = 0; i < res.length; i++) {
            const user = { ...res[i], ...dataFromFront };

            try {
                await sendNewsLetter(user);
            } catch (error) {
                console.error(`Ошибка отправки ${user.email}:`, error);
                // Можно добавить дополнительную логику обработки ошибок здесь
            }
        }
    }
};

// sendAllMessage({ paymentStatus: 1, text: "rr", threads: 14, title: "hello" });

export const createNewsletter = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            const { title, text, threads, paymentStatus } = req.body;

            if (!text || !title || !threads) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    statusSendEmail: false,
                });
            }

            const dataFromFront = { text, title, threads, paymentStatus };
            await sendAllMessage(dataFromFront);

            res.status(200).json({
                success: true,
                message: "Email send",
                statusSendEmail: true,
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message,
                statusSendEmail: false,
            });
        }
    }
};
