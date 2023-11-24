import { Request, Response } from "express";
import { deleteClientFromDB } from "../dataBase/db.js";

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
                deleteClientFromDB(req.body.id);

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
