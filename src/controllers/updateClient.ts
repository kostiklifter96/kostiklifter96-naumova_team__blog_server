import { Request, Response } from "express";
import { updateClientFromDB } from "../dataBase/db.js";
import { INaumovaTeamClient } from "../types/types.js";

export const updateClients = async (req: Request, res: Response) => {
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
                id,
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
                id ||
                name ||
                email ||
                textarea ||
                uid ||
                amount ||
                stream ||
                paymentStatus ||
                textForMailer
            ) {
                if (typeof id === "number") {
                    await updateClientFromDB({
                        id,
                        name: name.trim(),
                        email: email.toLowerCase().trim(),
                        textarea: textarea.trim(),
                        uid: uid.trim(),
                        amount: amount,
                        stream: stream,
                        paymentStatus: paymentStatus,
                    });

                    res.status(200).json({
                        success: true,
                        message: "Client update",
                        statusSendEmail: true,
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Client update",
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
