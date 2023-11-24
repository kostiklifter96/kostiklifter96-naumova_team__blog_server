import { Request, Response } from "express";
import { createClientFromDB, getClientFromDB } from "../dataBase/db.js";
import { sendEmailFromAdminMailer } from "../nodemailer/nodemailer.js";
import { INaumovaTeamClient } from "../types/types.js";

export const createClient = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            console.log(req.body);

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
            } = req.body as INaumovaTeamClient;

            if (
                name ||
                email ||
                textarea ||
                uid ||
                amount ||
                stream ||
                paymentStatus ||
                textForMailer
            ) {
                await sendEmailFromAdminMailer({
                    email: email,
                    text: textForMailer || "",
                });

                await createClientFromDB({
                    name,
                    email,
                    textarea,
                    uid,
                    amount,
                    stream,
                    paymentStatus,
                    textForMailer,
                });

                const client = await getClientFromDB(email);

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
