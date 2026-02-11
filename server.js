const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const dataservice = require("./data-service.js");

const app = express();
dotenv.config();

// Initialize data service
dataservice.initialize().catch(err => {
  console.log(`Error initializing data: ${err}`);
});

// Render provides the PORT via environment variable
const PORT = process.env.PORT || 8080;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve static files from the "data" folder
app.use("/data", express.static(path.join(__dirname, "data")));

// Serve the HTML file
//app.get("/", (req, res) => {
//  res.sendFile(path.join(__dirname, "public", "index.html"));
//});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});
app.get('/employees', (req, res) => {
  dataservice.getAllEmployees()
  .then((data) => {
    res.json(data);
  })
  .catch((err) => {
    console.log(`Failed to load employees: ${err}`);
  });
});

app.get('/managers', (req, res) => {
  dataservice.getManagers()
  .then((data) => {
    res.json(data);
  })
  .catch((err) => {
    console.log(`Failed to get managers: ${err}`);
  });
});

app.get('/departments', (req, res) => {
  dataservice.getDepartments()
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    console.log(`Failed to get departments: ${err}`);
  });
});
app.get('/{*any}', function(req, res){
  res.status(404).send('Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});