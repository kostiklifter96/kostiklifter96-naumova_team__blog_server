import cors from "cors";
import "dotenv/config";
import express from "express";
import {
    controlPayment,
    createClient,
    createNewsletter,
    deleteClient,
    getAllClients,
    login,
    payment,
    register,
    registrationClientOnStream,
    sendEmailFromAdminPanel,
    updateClients,
} from "./controllers/index.js";
import { isAutf } from "./middleware/isAuth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 4999;

app.get("/getAllClients", getAllClients);
app.post("/register", register);
app.post("/login", login);
app.post("/sendEmail", sendEmailFromAdminPanel);
app.post("/createClient", createClient);
app.post("/sendNewsLetter", createNewsletter);
app.post("/payment", isAutf, payment);
app.post("/registration", registrationClientOnStream);
app.post("/controlPayment", controlPayment);
app.delete("/deleteClient", deleteClient);
app.put("/updateClient", updateClients);

app.listen(PORT, () => {
    console.log("server start");
});
