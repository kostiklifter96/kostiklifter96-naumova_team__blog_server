import { Request, Response } from "express";
import { createClientFromDB } from "../dataBase/db.js";
import { INaumovaTeamClient } from "../types/types";

export const registrationClientOnStream = async (
    req: Request,
    res: Response,
) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    statusSendEmail: false,
                });
            }

            console.log(req.body);

            const { name, email, paymentToken, telNumber, telegram } =
                req.body as INaumovaTeamClient;

            if (name || email || paymentToken || telNumber || telegram) {
                const clientData: INaumovaTeamClient = {
                    name,
                    email: email.toLowerCase().trim(),
                    paymentToken,
                    telNumber,
                    telegram,
                    textarea: "",
                    uid: "",
                    amount: 5900,
                    stream: 4,
                    paymentStatus: 0,
                };

                const client = await createClientFromDB(clientData);

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
