module.exports = {
    registerDrone: (req, res, next) => {
        const {body,} = req;
        if (body == undefined || body == null){
            return res.status(400).json({
                error: true,
                message: 'empty body added in request',
            });
        }

        let allowedFieldNames = ['serialNumber', 'modelType', 'weightLimit', 'batteryCapacity', 'droneState'];
        for (let fieldName in Object.keys(body)){
            if(!allowedFieldNames.includes(fieldName)){
                delete body[fieldName];
            }
        }

        if (!body.serialNumber || body.serialNumber == ''){
            return res.status(400).json({
                error: true,
                message: 'serial number is required',
            });
        }

        if (!body.modelType || body.modelType == ''){
            return res.status(400).json({
                error: true,
                message: 'model type is required',
            });
        }

        if (!body.weightLimit || isNaN(body.weightLimit || body.weightLimit <= 0)){
            return res.status(400).json({
                error: true,
                message: 'weight limit is required, and should be a positive number',
            });
        }

        if (body.batteryCapacity != undefined && (isNaN(body.batteryCapacity) || body.batteryCapacity < 0 || body.batteryCapacity > 100)){
            return res.status(400).json({
                error: true,
                message: 'battery capacity should be a positive number between 0 and 100',
            });
        }

        if (body.droneState){
            body.droneState = body.droneState.toUpperCase();
        }

        return next();
    },

    addOrRemoveMedication: (req, res, next) => {
        const {body,} = req;
        if (body == undefined || body == null){
            return res.status(400).json({
                error: true,
                message: 'empty body added in request',
            });
        }

        let allowedFieldNames = ['medicationCode', 'medicationQuantity'];
        for (let fieldName in Object.keys(body)){
            if(!allowedFieldNames.includes(fieldName)){
                delete body[fieldName];
            }
        }

        if (!body.medicationCode || body.medicationCode == ''){
            return res.status(400).json({
                error: true,
                message: 'medication code is required',
            });
        }

        body.medicationCode = body.medicationCode.toUpperCase();

        if (!body.medicationQuantity || isNaN(body.medicationQuantity || body.medicationQuantity <= 0)){
            return res.status(400).json({
                error: true,
                message: 'medication quantity is required, and should be a positive number',
            });
        }

        return next();
    },
};