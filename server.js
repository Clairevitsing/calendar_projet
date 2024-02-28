// Importing required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

// Creating an instance of Express application
const app = express();
const port = 4000;

// Configuration for MySQL database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iot",
});

// Connecting to MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware setup
// Parse JSON bodies
app.use(bodyParser.json());
// Enable CORS
app.use(cors());

// Handling POST requests to insert data into the database
app.post("/api/event", (req, res) => {
  const formData = req.body;

  // Inserting data into the agendaInfo table in the database
  const sql =
    "INSERT INTO agendaInfo (startDate, startTime, endDate, endTime, title, description) VALUES (?, ?, ?, ?, ?, ?)";
  //2 add EndDateAndTime fields
  const values = [
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime,
    formData.title,
    formData.description,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error while inserting data:", err);
      res.status(500).send("Error while inserting data into the database");
      return;
    }
    console.log("Data inserted successfully into the database");
    res.status(200).send("Data inserted successfully into the database");
  });
});

// Handling GET requests to retrieve data from the database
app.get("/api/event", (req, res) => {
  console.log("GET request received on /api/event");
  // Selecting all data from the agendaInfo table
  const sql = "SELECT * FROM agendaInfo";
  console.log("Executing SQL query to retrieve data");

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error while retrieving data:", err);
      res.status(500).send("Error while retrieving data from the database");
      return;
    }
    console.log("Data retrieved successfully from the database");
    res.status(200).json(results);
  });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
