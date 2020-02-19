const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;
const connectDB = require("./config/database");

//Database Connection

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, () => console.log("Connected to port", PORT));
app.get("/", (req, res) => res.send("API RUNNING"));

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/patients", require("./routes/api/patients"));
app.use("/api/doctors", require("./routes/api/doctors"));
app.use("/api/appointments", require("./routes/api/appointments"));
