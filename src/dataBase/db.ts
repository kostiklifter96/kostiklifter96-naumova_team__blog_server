import { Client } from "../models/Client.js";
import { sendLinkPrivateGroup } from "../nodemailer/nodemailer.js";
import { INaumovaTeamClient } from "./../types/types";

export const getAllClientsFromDB = async () => {
    const result = await Client.findAll();
    return result;
};
// getAllClientsFromDB()

async function uniqueUser(str: number) {
    let clientList: INaumovaTeamClient[] = [];
    await getAllClientsFromDB().then((res) => {
        clientList = [].concat(JSON.parse(JSON.stringify(res)));
    });

    const uniqueUserList = clientList.filter((el) => {
        // Получаю список всех потоков, в которых участвовал текущий участник
        const participantStreams = clientList
            // создаю массив данных всех потоков,где участвовал текущий участник
            .filter(
                (item) => item.email.toLowerCase() === el.email.toLowerCase(),
            )
            // создаю массив c номерами поток ,где участвовал текущий участник
            .map((item) => item.stream);

        // Проверяем, участвовал ли участник только в одном потоке и этот поток совпадает с целевым
        return participantStreams.length === 1 && participantStreams[0] === str;
    });

    // console.log(uniqueUserList.length);
}

// uniqueUser(5);

export const getFindOneClientFromDB = async (email: string) => {
    try {
        const client = await Client.findOne({
            where: { email: email },
        });

        return client;
    } catch (error) {
        console.error("Ошибка при получении клиента из базы данных:", error);
        throw error;
    }
};
// getClientFromDB();

export const getFindAllClientFromDB = async (email: string) => {
    try {
        const clients = await Client.findAll({
            where: { email: email },
        });

        return clients;
    } catch (error) {
        console.error("Ошибка при получении клиента из базы данных:", error);
        throw error;
    }
};

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
        const record: any = await Client.findOne({
            where: {
                paymentToken: token,
            },
        });

        if (record) {
            record.paymentStatus = paymentStatus;

            await record.save();

            await sendLinkPrivateGroup({
                email: record.email,
                name: record.name,
            });

            console.log("Значение столбца успешно изменено.");
            return true;
        } else {
            console.error("Запись не найдена.");
            return false;
        }
    } catch (error) {
        console.error("Ошибка при изменении значения столбца:", error);
        return false;
    }
};

export const deleteClientFromDB = async (id: number) => {
    const result = await Client.destroy({ where: { id: id } });
    return result;
};
// deleteClientFromDB();
