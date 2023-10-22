import "dotenv/config";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            console.log(true);

            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill the required fields",
                    logIn: false,
                });
            }

            if (
                login === process.env.ADMIN_NAME &&
                password === process.env.ADMIN_PASSWORD
            ) {
                console.log("admin true");
                res.status(200).json({
                    success: true,
                    message: "Сheck passed",
                    logIn: true,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid login or password",
                    logIn: false,
                });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
        }
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            logIn: false,
        });
    }
};
