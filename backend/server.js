const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const dbURI = config.get('mongoURI');

const PORT = config.get('backendPort') || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// .then(() => console.log("Successfully connected to MongoDB"))
// .catch(err => console.log(err));
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully !");
})

// routes
// var AuthOldRouter = require("./routes/auth_old");
var JobsRouter = require("./routes/jobs");
var AuthRouter = require("./routes/auth");
var RecruiterRouter = require("./routes/recruiter");
var ApplicantRouter = require("./routes/applicant");

// setup API endpoints
// app.use("/oldauth", AuthOldRouter);
app.use("/jobs", JobsRouter);
app.use("/auth", AuthRouter);
app.use("/recruiter", RecruiterRouter);
app.use("/applicant", ApplicantRouter);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
