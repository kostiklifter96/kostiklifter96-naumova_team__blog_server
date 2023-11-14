import { Request, Response } from "express";
import { Article } from "../dataBase/db.js";
import { sendDB, sendHello } from "../nodemailer/nodemailer.js";

const article = Article;

export const register = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false });
        }

        article.create({
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            textarea: req.body.textarea.trim(),
            uid: "",
            stream: 0,
            amount: 0,
            paymentStatus: 0,
        });

        await sendHello(req.body);
        await sendDB();

        res.status(200).json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
