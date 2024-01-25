import { Request, Response } from "express";
import { createClientFromDB } from "../dataBase/db.js";
import { sendEmailFromAdminMailer } from "../nodemailer/nodemailer.js";
import { INaumovaTeamClient } from "../types/types.js";

export const createClient = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    statusSendEmail: false,
                });
            }

            const {
                name,
                email,
                textarea,
                uid,
                amount,
                stream,
                paymentStatus,
                textForMailer,
                paymentToken,
                telNumber,
                telegram,
            } = req.body as INaumovaTeamClient;

            if (
                name ||
                email ||
                textarea ||
                uid ||
                amount ||
                stream ||
                paymentStatus ||
                paymentToken ||
                telNumber ||
                telegram ||
                textForMailer
            ) {
                await sendEmailFromAdminMailer({
                    email: email,
                    text: textForMailer || "",
                });

                const client = await createClientFromDB({
                    name,
                    email: email.toLowerCase().trim(),
                    textarea,
                    uid,
                    amount,
                    stream,
                    paymentStatus,
                    paymentToken,
                    telNumber,
                    telegram,
                });

                res.status(200).json({
                    success: true,
                    message: "Client created",
                    result: client,
                    statusSendEmail: true,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    statusSendEmail: false,
                });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
