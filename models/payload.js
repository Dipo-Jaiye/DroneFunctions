const {Model, DataTypes,} = require('sequelize');
const { dbInstance } = require('../db');

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
    medicationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Medication'
        },
        allowNull: false,
    },
    medicationWeight: {
        type: DataTypes.INTEGER, 
    }
};

class Payload extends Model {
    static async getDroneWeight(droneId){
        const weight = await Payload.sum('medicationWeight', {
            where: {
                droneId: droneId,
            }
        });
        return weight;
    }

    static async removeMedication(medicationId) {
        try {
            const payload = await Payload.destroy({
                where: {
                    medicationId: medicationId,
                }
            });
    
            return;
        } catch (err) {
            console.error("error deleting payload, %o", err);
            return;
        }
        
    }

    static async getDronePayload(droneId){
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