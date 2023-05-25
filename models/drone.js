const { DataTypes, Model, Op, } = require('sequelize');
const { dbInstance, } = require("../db");
const Payload = require("./payload");
const Audit = require("./audit");
const Medication = require("./medication");

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serialNumber: {
        type: DataTypes.STRING(100),
        unique: true,
        validate: {
            max: 100,
        }
    },
    modelType: {
        type: DataTypes.STRING,
        isIn: [['Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight']],
    },
    weightLimit: {
        type: DataTypes.INTEGER,
        validate: {
            max: 500,
        }
    },
    batteryCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        validate: {
            max: 100,
            min: 0,
        }
    },
    droneState: {
        type: DataTypes.STRING,
        defaultValue: 'IDLE',
        isIn: [['IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING']],
    },
};

class Drone extends Model {

    static async getBySerialNumber(serial) {
        return await Drone.findOne({
            where: {
                serialNumber: serial,
            }
        }).then(drone => {
            return drone;
        }).catch(err => {
            console.error("err retrieving drone %o", err);
            return null;
        });
    }

    async addMedication(medicationId, unitWeight, medicationQuantity) {
        try {
            let currentDroneWeight = await Payload.addMedication(medicationId, unitWeight, this.id, medicationQuantity);

            if (currentDroneWeight == this.weightLimit) {
                this.droneState = 'LOADED';
                await this.save();
            } else if (this.droneState == 'IDLE' && currentDroneWeight > 0) {
                this.droneState = 'LOADING';
                await this.save();
            }

            return true;
        } catch (err) {
            console.error("Error occurred adding medication, %o", err);
            throw err;
        }
    }

    async getCurrentWeight() {
        return await Payload.getDroneWeight(this.id);
    }

    async canTakeMedication(weight) {
        let currentDroneWeight = await this.getCurrentWeight();
        return (currentDroneWeight != this.weightLimit) && (currentDroneWeight + weight <= this.weightLimit);
    }

    getBatteryLevel() {
        return this.batteryCapacity;
    }

    static async getAvailableDrones() {
        try {
            const drones = await Drone.findAll({
                where: {
                    [Op.or]: [
                        { droneState: 'IDLE' },
                        { droneState: 'LOADING' }
                    ],
                    batteryCapacity: {
                        [Op.gte]: 25,
                    }
                }
            });

            return drones;
        } catch (err) {
            console.error("error occurred retrieving available drones %o", err);
            return [];
        }
    }

    async removeMedication(medicationId, medicationQuantity) {
        try {
            let currentDroneWeight = await Payload.removeMedication(medicationId, this.id, medicationQuantity);

            if (this.droneState != 'IDLE' && currentDroneWeight == 0) {
                this.droneState = 'IDLE';
                await this.save();
            } else if (this.droneState == 'LOADED' && currentDroneWeight < this.weightLimit) {
                this.droneState = 'LOADING';
                await this.save();
            }

            return true;
        } catch (err) {
            console.error("Error occurred adding medication, %o", err);
            throw err;
        }
    }

    static async getMedicationItems(id) {
        try {
            let droneItems = await Drone.findAll({
                where: {
                    id: id,
                },
                attributes: [],
                include: {
                    model: Medication,
                    attributes: ['name', 'code', 'weight', 'image'],
                    through: {
                        attributes: ['medicationWeight', 'medicationQuantity', 'createdAt', 'updatedAt'],
                    },
                },

            });

            return droneItems;
        } catch (err) {
            console.error("error occurred getting medication items, %o", err);
            return [];
        }

    }
}

const sequelizeOptions = {
    sequelize: dbInstance,
}

Drone.init(attributes, sequelizeOptions);

Drone.hasMany(Audit, {
    foreignKey: 'droneId',
});

Drone.belongsToMany(Medication, { through: Payload, foreignKey: 'droneId', otherKey: 'medicationId', });

module.exports = Drone;