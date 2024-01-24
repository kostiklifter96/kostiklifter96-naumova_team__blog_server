import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "naumova_team.sqlite",
});

export const Client = sequelize.define(
    "clients",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        textarea: {
            type: DataTypes.STRING,
        },
        uid: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.INTEGER,
        },
        stream: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[0, 1]],
            },
        },
        telegram: {
            type: DataTypes.STRING,
        },
        telNumber: {
            type: DataTypes.STRING,
        },
        paymentToken: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
        tableName: "clients",
    },
);
// (async () => {
//     try {
//         // Синхронизируем модель с базой данных
//         await sequelize.sync();

//         // Переименовываем столбец lastName в новый столбец newLastName
//         await sequelize
//             .getQueryInterface()
//             .renameColumn("clients", "instagram", "telegram");

//         console.log("Столбец успешно переименован.");
//     } catch (error) {
//         console.error("Ошибка при переименовании столбца:", error);
//     }
// })();
