const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dbURI = require('./config/keys').mongoURI;

const PORT = 4000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully !");
// })

// routes
var UserRouter = require("./routes/users");
var JobsRouter = require("./routes/jobs");
var JobsRouter = require("./routes/jobs");
var JobsRouter = require("./routes/jobs");

// setup API endpoints
app.use("/user", UserRouter);
app.use("/user", UserRouter);
app.use("/user", UserRouter);
app.use("/jobs", JobsRouter);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
