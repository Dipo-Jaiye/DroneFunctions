// routing goes here
const { Router, } = require("express");
const dispatchCtrl = require("../controllers/dispatchController");
const validator = require("../validators");
const router = Router();

router.post("/drone/register", validator.registerDrone, dispatchCtrl.createDrone);
router.post("/drone/:sn/medication/add", validator.addOrRemoveMedication, dispatchCtrl.addMedication);
router.post("/drone/:sn/medication/remove", validator.addOrRemoveMedication, dispatchCtrl.removeMedication);
router.get("/drones/available", dispatchCtrl.getAvailableDrones);
router.get("/drone/:sn/batteryLevel", dispatchCtrl.getDroneBatteryLevel);
router.get("/drone/:sn/items", dispatchCtrl.getDroneItems);
router.post("/drones/audit", dispatchCtrl.takeAuditOfDrones);
router.get("/medications/available", dispatchCtrl.getAvailableMedications);
router.use(dispatchCtrl.notFoundError);
router.use(dispatchCtrl.errorHandler);


module.exports = router;