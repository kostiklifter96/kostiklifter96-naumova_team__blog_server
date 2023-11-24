import { Request, Response } from "express";
import { createClientFromDB } from "../dataBase/db.js";
import { sendDB, sendHello } from "../nodemailer/nodemailer.js";

export const register = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            console.log(req.body);
            if (!req.body) {
                return res.status(400).json({ success: false });
            }

            const { name, email, textarea } = req.body;

            if (name || email || textarea) {
                console.log({
                    name: req.body.name.trim(),
                    email: req.body.email.trim(),
                    textarea: req.body.textarea.trim(),
                });

                createClientFromDB({
                    name: req.body.name.trim(),
                    email: req.body.email.trim(),
                    textarea: req.body.textarea.trim(),
                    uid: "",
                    stream: 3,
                    amount: 0,
                    paymentStatus: 0,
                });

                await sendHello(req.body);
                await sendDB();

                res.status(200).json({ success: true });
            } else {
                return res.status(400).json({
                    success: false,
                });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
