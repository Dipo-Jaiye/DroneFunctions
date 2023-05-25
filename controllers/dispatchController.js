// outline tasks here
// register drone POST Drone

// add item, POST Medication into Drone
// validate weight

// check available drones, GET Drones
// disallow drones lower than 25 to carry stuff

// check drone battery level, GET Drone/id

// periodically check drone battery levels and create history/audit events
const { Drone, Medication, Audit, } = require("../models");
const cron = require("node-cron");

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
                message: err?.errors?.reduce((a, x) => { return a += ' ' + x.message; }, '') ?? err.message,
            });
        }
    },

    addMedication: async (req, res) => {
        const { body, params, } = req;
        try {
            const drone = await Drone.getBySerialNumber(params.sn);
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

            if (!['IDLE', 'LOADING'].includes(drone.droneState)) {
                return res.status(400).json({
                    error: true,
                    message: 'drone is not available for receiving medications',
                });
            }

            const medication = await Medication.getMedicationByCode(body.medicationCode);
            if (medication == null) {
                return res.status(400).json({
                    error: true,
                    message: 'medication not found',
                });
            }

            if (!await drone.canTakeMedication(medication.weight * body.medicationQuantity)) {
                return res.status(400).json({
                    error: true,
                    message: 'medication is too heavy for this drone',
                });
            }

            await drone.addMedication(medication.id, medication.weight, body.medicationQuantity);

            let droneItems = await drone.getMedications();

            return res.status(200).json({
                error: false,
                data: droneItems,
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

            let droneItems = await drone.getMedications();
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

    takeAuditOfDrones: async (req, res) => {
        try {
            await Audit.logDroneBatteryLevels();
            return res.status(200).json({
                error: false,
            });
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                error: true,
                message: err.message,
            });
        }
    },

    startScheduledJobs: () => {
        cron.schedule("*/1 * * * *", async () => {
            const drones = await Drone.findAll({
                attributes: [['id', 'droneId'], ['batteryCapacity', 'batteryLevel']],
            });

            await Audit.logDroneBatteryLevels(drones);
        });
    },

    removeMedication: async (req, res) => {
        const { body, params, } = req;
        try {
            const drone = await Drone.getBySerialNumber(params.sn);
            if (drone == null) {
                return res.status(400).json({
                    error: true,
                    message: 'drone not found',
                });
            }

            if (!['IDLE', 'LOADING', 'LOADED'].includes(drone.droneState)) {
                return res.status(400).json({
                    error: true,
                    message: 'drone is not available for removing medications',
                });
            }

            const medication = await Medication.getMedicationByCode(body.medicationCode);
            if (medication == null) {
                return res.status(400).json({
                    error: true,
                    message: 'medication not found',
                });
            }

            await drone.removeMedication(medication.id, body.medicationQuantity);

            return res.status(200).json({
                error: false,
                data: await drone.getMedications(),
            });
        } catch (err) {
            return res.status(400).json({
                error: true,
                data: err.message,
            });
        }
    },

    getAvailableMedications: async (req, res) => {
        const medications = await Medication.findAll();

        return res.status(200).json({
            error: false,
            data: medications,
        });
    }
}