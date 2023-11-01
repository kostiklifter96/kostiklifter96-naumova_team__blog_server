import { Request, Response } from "express";
import { Article } from "../dataBase/db.js";

const article = Article;

export const deleteClient = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter ID",
                    statusSendEmail: false,
                });
            }

            console.log(req.body);

            if (req.body.id) {
                article.delete(req.body.id, () => {
                    console.log("Client deleted");
                });

                res.status(200).json({
                    success: true,
                    message: "Client deleted",
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
