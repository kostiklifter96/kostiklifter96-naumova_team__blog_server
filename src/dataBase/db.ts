import { Client } from "../models/Client.js";
import { sendLinkPrivateGroup } from "../nodemailer/nodemailer.js";
import { INaumovaTeamClient } from "./../types/types";

// const sqlt3 = sqlite3.verbose();
// const dbName = "naumova_team.sqlite";

// export const db = new sqlt3.Database(dbName);

// db.serialize(() => {
//     const sql = `
//     CREATE TABLE IF NOT EXISTS clients
//     (id INTEGER PRIMARY KEY,name TEXT ,email TEXT ,textarea TEXT ,uid TEXT ,amount INTEGER, stream INTEGER,paymentStatus INTEGER NOT NULL CHECK (paymentStatus IN (0, 1)))
//     `;

//     db.run(sql);
// });

export const getAllClientsFromDB = async () => {
    const result = await Client.findAll();
    return result;
};
// getAllClientsFromDB()

export const getClientFromDB = async (email: string) => {
    const result = await Client.findOne({
        where: { email: email },
    });

    return result;
};
// getClientFromDB();

export const createClientFromDB = async (newClient: INaumovaTeamClient) => {
    const result = await Client.create({
        name: newClient.name.trim(),
        email: newClient.email.toLowerCase().trim(),
        textarea: newClient.textarea,
        uid: newClient.uid,
        amount: newClient.amount,
        stream: newClient.stream,
        paymentStatus: newClient.paymentStatus,
        paymentToken: newClient.paymentToken,
        telNumber: newClient.telNumber,
        telegram: newClient.telegram,
    });

    return result;
};
// createClientFromDB();

export const updateClientFromDB = async (updateInfo: INaumovaTeamClient) => {
    const result = await Client.update(
        {
            ...updateInfo,
        },
        { where: { id: updateInfo.id } },
    );

    return result;
};
// updateClientFromDB();

export const changeClientFromDB = async (
    token: string,
    paymentStatus: number,
) => {
    try {
        // Находим запись по значению в столбце paymentToken
        const record: any = await Client.findOne({
            where: {
                paymentToken: token,
            },
        });

        if (record) {
            // Обновляем значение в столбце columnName
            record.paymentStatus = paymentStatus;

            // Сохраняем изменения
            await record.save();

            console.log("Значение столбца успешно изменено.");
            await sendLinkPrivateGroup({
                email: record.email,
                name: record.name,
            });
        } else {
            console.error("Запись не найдена.");
        }
    } catch (error) {
        console.error("Ошибка при изменении значения столбца:", error);
    }
};

export const deleteClientFromDB = async (id: number) => {
    const result = await Client.destroy({ where: { id: id } });
    return result;
};
// deleteClientFromDB();
