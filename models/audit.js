const { DataTypes, Model, } = require("sequelize");
const { dbInstance } = require("../db");
const Drone = require("./drone");

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    droneId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Drone'
        },
        allowNull: false,
    },
    batteryLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

};

class Audit extends Model {
    static async logDroneBatteryLevels() {
        try {
            const drones = await Drone.findAll({
                attributes: [['id', 'droneId'], ['batteryCapacity', 'batteryLevel']],
            });

            const audits = await Audit.bulkCreate(drones);

            return;
        } catch (err) {
            console.error("error auditing drones, %o", err);
            throw err;
        }

    }
}

const sequelizeOptions = {
    sequelize: dbInstance,
};

Audit.init(attributes, sequelizeOptions);

module.exports = Audit;