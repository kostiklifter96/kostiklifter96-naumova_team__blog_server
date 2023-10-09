import { NextFunction, Response } from "express";

export const isAutf = (req: any, res: Response, next: NextFunction) => {
    if (!req.get("Authorization")) {
        let err = new Error("Not Authenticated!");
        res.status(401);
        next(err);
    } else {
        let credentials = Buffer.from(
            req.get("Authorization").split(" ")[1],
            "base64",
        )
            // <Buffer 75 73 65 72 6e 61 6d 65 3a 70 61 73 73 77 6f 72 64>
            .toString()
            // username:password
            .split(":");
        // ['username', 'password']

        let username = credentials[0];
        let password = credentials[1];

        // If credentials are not valid
        if (
            !(
                username === process.env.SHOP_ID &&
                password === process.env.SHOP_SECRET_KEY
            )
        ) {
            let err = new Error("Not Authenticated!");

            // Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
            res.status(401).set("WWW-Authenticate", "Basic");
            next(err);
        }
        res.status(200);
        // Continue the execution
        next();
    }
};
