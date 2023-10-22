import sqlite3 from "sqlite3";
import { INaumovaTeamClient } from "../types/types";

const sqlt3 = sqlite3.verbose();

const dbName = "naumova_team.sqlite";
export const db = new sqlt3.Database(dbName);

db.serialize(() => {
    const sql = `
    CREATE TABLE IF NOT EXISTS clients
    (id INTEGER PRIMARY KEY,name TEXT ,email TEXT ,textarea TEXT ,uid TEXT ,amount INTEGER ,paymentStatus INTEGER NOT NULL CHECK (paymentStatus IN (0, 1)))
    `;

    db.run(sql);
});

export class Article {
    static all(cb: (err: Error, clients: INaumovaTeamClient[]) => void) {
        db.all("SELECT * FROM clients", cb);
    }

    static find(id: number, cb: () => void) {
        db.get("SELECT * FROM clients id = ?", id, cb);
    }

    static create(data: INaumovaTeamClient) {
        const sql =
            "INSERT INTO clients(name, email, textarea, uid, amount, paymentStatus) VALUES (?, ?, ?, ?, ?, ?)";

        db.run(
            sql,
            data.name,
            data.email,
            data.textarea,
            data.uid,
            data.amount,
            data.paymentStatus,
            (err: Error) => {
                if (err) return console.log(err);
            },
        );
    }

    static delete(id: number, cb: (err?: Error) => void) {
        if (!id) {
            return cb(new Error("Please provide an id"));
        }
        db.run("DELETE FROM clients WHERE id = ?", id, cb);
    }

    static update(
        id: number,
        data: INaumovaTeamClient,
        cb: (err?: Error) => void,
    ) {
        if (!id) {
            return cb(new Error("Please provide an id"));
        }

        db.run(
            "UPDATE clients SET  amount = ? WHERE id = ?",
            data.amount,
            id,
            (err: Error) => {
                if (err) return console.log(err);
            },
        );
    }
}

//! изменение данных всех клиентов
// Article.all((err, clients) => {
//     clients.map((el: INaumovaTeamClient) => {
//         if (el.id) {
//             Article.update(
//                 el.id,
//                 {
//                     email: el.email,
//                     amount: "6900",
//                     paymentStatus: el.paymentStatus,
//                     name: el.name,
//                     textarea: el.textarea,
//                     uid: el.uid,
//                     id: el.id,
//                 },
//                 (err) => {
//                     if (err) {
//                         return console.log("error downloading article");
//                     }
//                 },
//             );
//         }
//         return;
//     });
// });

// ! изменение статуса оплаты

// ! очистка базы данных
// Article.all((err, clients) => {
//     if (err) {
//         console.log("error downloading article");
//     }
//     console.log(clients);
//     if (clients.length > 0) {
//         clients.map((el: INaumovaTeamClient) => {
//             if (el.id) {
//         Article.delete(el.id, (err) => {
//             if (err) {
//                 return console.log("error downloading article");
//             }
//         });
//     }
//     return;
// });
//     }
// });

// Article.delete(0, (err) => {
//     if (err) {
//         return console.log("error downloading article");
//     }
// });
