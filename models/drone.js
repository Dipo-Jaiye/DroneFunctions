const { DataTypes, Model, Op, } = require('sequelize');
const { dbInstance, } = require("../db");
const Payload = require("./payload");

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

    async getBySerialNumber(serial) {
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
            } else if (this.droneState != 'IDLE') {
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
                    batteryLevel: {
                        gte: 25,
                    }
                }
            });

            return drones;
        } catch (err) {
            console.error("error occurred retrieving available drones %o", err);
            return [];
        }
    }

    async removeMedication(medicationId, unitWeight, medicationQuantity) {
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
}

const sequelizeOptions = {
    sequelize: dbInstance,
}

Drone.init(attributes, sequelizeOptions);

module.exports = Drone;