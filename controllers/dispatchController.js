// outline tasks here
// register drone POST Drone

// add item, POST Medication into Drone
// validate weight

// check available drones, GET Drones
// disallow drones lower than 25 to carry stuff

// check drone battery level, GET Drone/id

// periodically check drone battery levels and create history/audit events
const { Drone, Medication, } = require("../models");

module.exports = {
    createDrone: async (req, res) => {
        const { body, } = req;
        try {
            const newDrone = await Drone.create(body);
            return res.status(200).json({
                error: false,
                data: newDrone.get(),
            });
        } catch (err) {
            console.error("error creating drone, %o", err);
            return res.status(400).json({
                error: true,
                message: err.message,
            });
        }
    },

    addMedication: async (req, res) => {
        const { body, } = req;
        try {
            const drone = await Drone.getBySerialNumber(body.droneSN);
            if (drone == null) {
                return res.status(400).json({
                    error: true,
                    message: 'drone not found',
                });
            }

            if (drone.getBatteryLevel() < 25) {
                return res.status(400).json({
                    error: true,
                    message: 'drone battery is too low to take medications',
                });
            }

            const medication = await Medication.findByPk(body.medicationId);
            if (medication == null) {
                return res.status(400).json({
                    error: true,
                    message: 'medication not found',
                });
            }

            if (!await drone.canTakeMedication(medication.weight)) {
                return res.status(400).json({
                    error: true,
                    message: 'medication is too heavy for this drone',
                });
            }

            await drone.addMedication(medication);

            return res.status(200).json({
                error: false,
                data: body,
            });
        } catch (err) {
            return res.status(400).json({
                error: true,
                data: err.message,
            });
        }
    },

    getAvailableDrones: async (req, res) => {
        const drones = await Drone.getAvailableDrones();

        return res.status(200).json({
            error: false,
            data: drones,
        });
    },

    getDroneBatteryLevel: async (req, res) => {
        try {
            const drone = await Drone.getBySerialNumber(req.params.sn);
            if (drone == null) {
                return res.status(400).json({
                    error: true,
                    message: 'drone not found',
                });
            }
            return res.status(200).json({
                error: false,
                data: drone.getBatteryLevel(),
            });
        } catch (err) {
            return res.status(400).json({
                error: true,
                message: err.message,
            });
        }
    },

    getDroneItems: async (req, res) => {
        try {
            const drone = await Drone.getBySerialNumber(req.params.sn);
            if (drone == null) {
                return res.status(400).json({
                    error: true,
                    message: 'drone not found',
                });
            }

            let droneItems = drone.getMedications();
            return res.status(200).json({
                error: false,
                data: droneItems,
            });
        } catch (err) {
            return res.status(400).json({
                error: true,
                message: err.message,
            });
        }
    },
}