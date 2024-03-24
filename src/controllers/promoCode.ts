import "dotenv/config";
import { Request, Response } from "express";
import { Client } from "../models/Client.js";

export const promoCode = async (req: Request, res: Response) => {
    try {
        if (req.query.apikey === process.env.LOGIN_KEY) {
            const { code, email } = req.body;

            if (!code && !email) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            if (code.toUpperCase() === process.env.PROMOCODE_NAME) {
                const client = await Client.findOne({
                    where: {
                        email: email,
                        paymentStatus: 1,
                    },
                });

                if (client) {
                    res.status(200).json({
                        success: true,
                        message: "The client and code exists",
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "The client or code does not exist",
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "The client or code does not exist",
                });
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
};
