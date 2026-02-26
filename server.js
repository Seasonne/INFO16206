const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const dataservice = require("./data-service.js");

// HW3 stuff
// For file uploads
const fs = require('fs');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: 'public/images/uploaded',
  filename: (req,file,cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// end file upload stuff
// Add employee stff
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: true });
// end add employee stuff



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


// Assignment 3 stuff
app.get("/employees/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addEmployee.html"));
});
app.get("/images/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addImage.html"));
});
app.post('/images/add',
    upload.single('imageFile'),
    (req, res) => {
        res.redirect('/images');
    }
);

// image get stuff

app.get('/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public', 'images', 'uploaded');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.log(`Failed to read images directory: ${err}`);
      res.status(500).send('Failed to read images directory');
      return;
    }
    res.json(files);
  });
});
//end image get stuff

// add employee post stuff
app.post('/employees/add', urlencodedParser, (req, res) => {
  const newEmployee = req.body;
    dataservice.addEmployee(newEmployee)
    .then(() => {
        res.redirect('/employees');
    })
    .catch((err) => {
        console.log(`Failed to add employee: ${err}`);
        res.status(500).send('Failed to add employee');
    });
});

// end Assignment 3 stuff



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