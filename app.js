const express = require("express");
const { connect: startDb, } = require("./db");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);

startDb()
    .then(async res => {
        // start the server
        app.listen(3000, () => console.log(`App running on port:${3000}`));
    })
    .catch(err => {
        console.error(err);
        process.exit = 1;
    });

