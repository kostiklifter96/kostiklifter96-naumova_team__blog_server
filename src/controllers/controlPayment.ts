import { Request, Response } from "express";
import { changeClientFromDB } from "../dataBase/db.js";
import { sendDB } from "../nodemailer/nodemailer.js";

export const controlPayment = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    statusSendEmail: false,
                });
            }

            const { token, status } = req.body;

            if (token || status) {
                let paymentStatus = 0;
                if (status === "successful") {
                    paymentStatus = 1;
                }

                await changeClientFromDB(token, paymentStatus);
                await sendDB();

                res.status(200).json({
                    success: true,
                    message: "update paymentStatus",
                    statusSendEmail: true,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Error",
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
