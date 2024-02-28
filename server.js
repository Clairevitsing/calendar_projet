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

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
// Middleware for enabling CORS
app.use(cors());

//because I can't get the event by Id, because the CSP
// Middleware for setting Content Security Policy (CSP) header
const setCSPHeader = (req, res, next) => {
  // Setting CSP directives
  const cspDirectives = {
    // No default location allowed
    "default-src": ["'none'"],
    // Allow loading fonts from any location
    "font-src": ["*"],
  };

  // Convert CSP directives into formatted string
  const cspHeader = Object.entries(cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");

  // Setting CSP header in HTTP response
  res.setHeader("Content-Security-Policy", cspHeader);

  // Calling the next middleware
  next();
};

// Adding CSP middleware to the application
app.use(setCSPHeader);

// Handling POST requests to insert data into the database
app.post("/api/event", (req, res) => {
  const formData = req.body;

  // Inserting data into the calendar table in the database
  const sql =
    "INSERT INTO calendar (startDate, startTime, endDate, endTime, title, description) VALUES (?, ?, ?, ?, ?, ?)";
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
  // Selecting all data from the calendar table
  const sql = "SELECT * FROM calendar";
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

// Handling GET requests to retrieve a specific event from the database
app.get("/api/event/:id", (req, res) => {
  const eventId = req.params.id;
  console.log(`GET request received on /api/event/${eventId}`);
  console.log("Event ID:", eventId);
  // Selecting the event with the specified ID from the calendar table
  const sql = "SELECT * FROM calendar WHERE id = ?";
  console.log("Executing SQL query to retrieve data");

  connection.query(sql, eventId, (err, results) => {
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
