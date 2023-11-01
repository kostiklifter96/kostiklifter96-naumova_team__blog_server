import { Request, Response } from "express";
import { Article } from "../dataBase/db.js";
import { sendEmailFromAdminMailer } from "../nodemailer/nodemailer.js";
import { INaumovaTeamClient } from "../types/types.js";

const article = Article;

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
                paymentStatus,
                textForMailer,
            } = req.body as INaumovaTeamClient;

            if (
                name ||
                email ||
                textarea ||
                uid ||
                amount ||
                paymentStatus ||
                textForMailer
            ) {
                await sendEmailFromAdminMailer({
                    email: email,
                    text: textForMailer || "",
                });

                article.create({
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    textarea: textarea.trim(),
                    uid: uid.trim(),
                    amount: amount,
                    paymentStatus: paymentStatus,
                });

                res.status(200).json({
                    success: true,
                    message: "Client created",
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
