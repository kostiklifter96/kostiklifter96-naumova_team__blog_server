import { Request, Response } from "express";
import { Article } from "../dataBase/db.js";
import { INaumovaTeamClient } from "../types/types.js";

const article = Article;

export const getAllClients = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            article.all((err, clients: INaumovaTeamClient[]) => {
                if (err) {
                    console.log("error downloading article");
                }

                res.status(200).json({
                    success: true,
                    message: "successful request",
                    result: clients,
                });
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
