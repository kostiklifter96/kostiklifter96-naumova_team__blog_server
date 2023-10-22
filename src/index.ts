import cors from "cors";
import "dotenv/config";
import express from "express";
import { login } from "./controllers/login.js";
import { payment } from "./controllers/payment.js";
import { register } from "./controllers/register.js";
import { isAutf } from "./middleware/isAuth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 4999;

app.post("/register", register);
app.post("/login", login);
app.post("/payment", isAutf, payment);

app.listen(PORT, () => {
    console.log("server start");
});
