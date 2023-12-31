import { Request, Response } from "express";
import { createClientFromDB } from "../dataBase/db.js";
import { logger } from "../logger.js";
import {
    sendDB,
    sendErrorMessage,
    sendLinkPrivateGroup,
} from "../nodemailer/nodemailer.js";

export const payment = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false });
        }

        logger.log("debug", req);
        logger.error(req);

        switch (req.body.transaction.status) {
            case "successful":
                createClientFromDB({
                    name: req.body.transaction.billing_address.first_name.trim(),
                    email: req.body.transaction.customer.email
                        .toLowerCase()
                        .trim(),
                    textarea: "ОПЛАТА",
                    uid: req.body.transaction.uid,
                    stream: 3,
                    amount: req.body.transaction.amount,
                    paymentStatus: 1,
                });

                const body = {
                    name: req.body.transaction.billing_address.first_name.trim(),
                    email: req.body.transaction.customer.email
                        .toLowerCase()
                        .trim(),
                };

                await sendLinkPrivateGroup(body);
                await sendDB();

                return res.status(200).json({ success: "Оплачено" });
            case "failed":
                createClientFromDB({
                    name: req.body.transaction.billing_address.first_name.trim(),
                    email: req.body.transaction.customer.email
                        .toLowerCase()
                        .trim(),
                    textarea: "НЕ ОПЛАЧЕНО",
                    uid: req.body.transaction.uid,
                    stream: 3,
                    amount: req.body.transaction.amount,
                    paymentStatus: 0,
                });

                await sendDB();

                return res.status(200).json({ success: "Не оплачено" });
            case "pending":
                await sendErrorMessage("pending");
                return res.status(200).json({ success: "В ожидании" });
            case "expired":
                await sendErrorMessage("expired");
                return res
                    .status(200)
                    .json({ success: "Истекло время ожидания" });

            default:
                await sendErrorMessage(JSON.stringify(req.body));
                logger.error(JSON.stringify(req.body));

                return res.status(200).json({ success: false });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
