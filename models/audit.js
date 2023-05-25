const { DataTypes, Model, } = require("sequelize");
const { dbInstance, } = require("../db");

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    batteryLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

};

class Audit extends Model {
    static async logDroneBatteryLevels(drones) {
        try {
            const audits = await Audit.bulkCreate(drones.map(x => x.get()));

            console.log("audit log performed, %o", new Date().toISOString());

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