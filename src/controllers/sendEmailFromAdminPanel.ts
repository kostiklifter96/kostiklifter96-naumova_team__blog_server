import "dotenv/config";
import { Request, Response } from "express";
import { sendEmailFromAdminMailer } from "../nodemailer/nodemailer.js";

export const sendEmailFromAdminPanel = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            const { email, text } = req.body;

            if (!text || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    statusSendEmail: false,
                });
            }

            await sendEmailFromAdminMailer({ email, text });

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
