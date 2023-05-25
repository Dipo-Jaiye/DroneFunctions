const { Model, DataTypes, } = require('sequelize');
const { dbInstance } = require('../db');

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    medicationWeight: {
        type: DataTypes.INTEGER,
    },
    medicationQuantity: {
        type: DataTypes.INTEGER,
    },
};

class Payload extends Model {
    static async getDroneWeight(droneId) {
        const weight = await Payload.sum('medicationWeight', {
            where: {
                droneId: droneId,
            }
        });
        return weight;
    }

    static async addMedication(medicationId, unitWeight, droneId, count = 0) {
        try {
            const payload = await Payload.findOne({
                where: {
                    medicationId: medicationId,
                    droneId: droneId,
                }
            });

            if (payload != null) {
                payload.medicationQuantity += count;
                payload.medicationWeight = payload.medicationQuantity * unitWeight;
                await payload.save();
            } else if (payload == null && count > 0) {
                await Payload.create({
                    droneId: droneId,
                    medicationId: medicationId,
                    medicationQuantity: count,
                    medicationWeight: count * unitWeight,
                });
            }

            return Payload.getDroneWeight(droneId);
        } catch (err) {
            console.error("error deleting payload, %o", err);
            throw err;
        }

    }

    static async removeMedication(medicationId, droneId, count = 0) {
        try {
            const payload = await Payload.findOne({
                where: {
                    medicationId: medicationId,
                    droneId: droneId,
                }
            });

            if (payload != null) {
                if (count != 0) {
                    let unitWeight = payload.medicationWeight / payload.medicationQuantity;
                    payload.medicationQuantity -= count;
                    if (payload.medicationQuantity < 0) {
                        payload.medicationQuantity = 0;
                    }
                    payload.medicationWeight = payload.medicationQuantity * unitWeight;
                }

                if (count == 0 || payload.medicationWeight == 0) {
                    await payload.destroy();
                } else {
                    await payload.save();
                }
            }

            return Payload.getDroneWeight(droneId);
        } catch (err) {
            console.error("error deleting payload, %o", err);
            throw err;
        }

    }

    static async getDronePayload(droneId) {
        try {
            const payload = await Payload.findAll({
                where: {
                    droneId: droneId,
                }
            });
            return payload;

        } catch (err) {
            console.error("error retrieving payload, %o", err);
            return [];
        }
    }
}

const sequelizeOptions = {
    sequelize: dbInstance,
};

Payload.init(attributes, sequelizeOptions);

module.exports = Payload;