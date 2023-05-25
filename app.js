const express = require("express");
const { connect: startDb, } = require("./db");
const routes = require("./routes");
const {startScheduledJobs,} = require("./controllers/dispatchController");
const port = 3000;

const app = express();

app.use(express.json());
app.use(routes);

startDb()
    .then(async res => {
        // schedule background jobs
        startScheduledJobs();
        // start the server
        app.listen(port, () => console.log(`App running on port:${port}`));
    })
    .catch(err => {
        console.error(err);
        process.exit = 1;
    });

