import "dotenv/config";
import { Request, Response } from "express";
import { getAllClientsFromDB } from "../dataBase/db.js";

export const getAllClients = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            const clientList = await getAllClientsFromDB();
            res.status(200).json({
                success: true,
                message: "successful request",
                result: clientList,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "failed authentication",
                result: [],
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: "failed to get clients",
                result: [],
            });
        }
    }
};
