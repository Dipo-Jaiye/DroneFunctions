const express = require("express");
const { connect: startDb, } = require("./db");
//const Drone = require("./models/drone");
//const Medication = require("./models/medication");

const app = express();

startDb()
    .then(async res => {
        console.log(res);
        // start the server
        app.listen(3000, () => console.log(`App running on port:${3000}`));
        // const jane = await Drone.create({
        //     username: 'janedoe',
        //     birthday: new Date(1980, 6, 20),
        // });

        // console.log(jane);

        // const users = await Medication.findAll();
        // console.log(users);
    })
    .catch(err => {
        console.error(err);
        process.exit = 1;
    });

