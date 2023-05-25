// routing goes here
const {Router,} = require("express");
const dispatchCtrl = require("../controllers/dispatchController");
const router = Router();

router.post("/drone/register", dispatchCtrl.createDrone);
router.post("/drone/addMedication", dispatchCtrl.addMedication);
router.get("/drones/available", dispatchCtrl.getAvailableDrones);
router.get("/drone/:id/batteryLevel", dispatchCtrl.getDroneBatteryLevel);


module.exports = router;