const { DataTypes, Model, } = require('sequelize');
const { dbInstance, } = require("../db");

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            is: ['[A-Za-z0-9_-]', 'i'],
        },
    },
    weight: {
        type: DataTypes.INTEGER,
    },
    code: {
        type: DataTypes.STRING,
        validate: {
            is: ['[A-Z0-9_]', 'i'],
        },
    },
    image: {
        type: DataTypes.STRING,
        isUrl: true,
    },
};

class Medication extends Model {
    static async getMedicationByCode(code) {
        try {
            const medication = await Medication.findOne({
                where: {
                    code: code,
                }
            });

            return medication;
        } catch (err) {
            console.error("Error retrieving medications, %o", err);
            return null;
        }


    }
}

const sequelizeOptions = {
    sequelize: dbInstance,
}

Medication.init(attributes, sequelizeOptions);

module.exports = Medication;