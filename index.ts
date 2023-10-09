import cors from "cors";
import "dotenv/config";
import express from "express";
import { Article } from "./dataBase/db.js";
import { logger } from "./logger.js";
import { isAutf } from "./middleware/isAuth.js";
import {
    sendDB,
    sendErrorMessage,
    sendHello,
    sendLinkPrivateGroup,
} from "./nodemailer/nodemailer.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("__dirname"));

const PORT = process.env.PORT || 4999;
const article = Article;

app.post("/register", (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false });
        }

        article.create({
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            textarea: req.body.textarea.trim(),
            uid: "",
            amount: "",
            paymentStatus: 0,
        });

        sendHello(req.body);
        sendDB();

        res.status(200).json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
});

app.post("/payment", isAutf, (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ success: false });
        }

        logger.log("debug", req);
        logger.error(req);

        switch (req.body.transaction.status) {
            case "successful":
                article.create({
                    name: req.body.transaction.billing_address.first_name.trim(),
                    email: req.body.transaction.customer.email.trim(),
                    textarea: "ОПЛАТА",
                    uid: req.body.transaction.uid,
                    amount: req.body.transaction.amount,
                    paymentStatus: 1,
                });

                const body = {
                    name: req.body.transaction.billing_address.first_name.trim(),
                    email: req.body.transaction.customer.email.trim(),
                };

                sendLinkPrivateGroup(body);
                sendDB();

                return res.status(200).json({ success: "Оплачено" });
            case "failed":
                article.create({
                    name: req.body.transaction.billing_address.first_name.trim(),
                    email: req.body.transaction.customer.email.trim(),
                    textarea: "E-POS",
                    uid: req.body.transaction.uid,
                    amount: req.body.transaction.amount,
                    paymentStatus: 0,
                });

                sendDB();

                return res.status(200).json({ success: "Не оплачено" });
            case "pending":
                sendErrorMessage("pending");
                return res.status(200).json({ success: "В ожидании" });
            case "expired":
                sendErrorMessage("expired");
                return res
                    .status(200)
                    .json({ success: "Истекло время ожидания" });

            default:
                sendErrorMessage(JSON.stringify(req.body));
                logger.error(JSON.stringify(req.body));

                return res.status(200).json({ success: false });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
});

app.listen(PORT, () => {
    console.log("server start");
});
