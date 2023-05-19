const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose  = require('mongoose');
const cors = require("cors");

const app = express();

// use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// middleware function to log incoming requests to the console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// specify the connection string for your Atlas cluster
const url = "mongodb+srv://admin:Burb3rry!@kodegocluster.uhiiddj.mongodb.net/Portfolio";

console.log("Connecting to database...");
// connect to your Atlas cluster
mongoose.connect( url , { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database..."));

  // define a route to serve your HTML file
  app.get('/send', (req, res) => {
    res.send('Please submit the form');
  });

  // define a route to handle form submissions
  app.post('/send', (req, res) => {
    console.log("Received form submission");

    // handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // handle GET request
        res.send('Please submit the form');
        break;
      case 'POST':
        // handle POST request
        // extract the data submitted through the form
        const data = {
          name: req.body.name,
          email: req.body.email,
          company: req.body.company,
          subject: req.body.subject,
          message: req.body.message
        };

        // insert the data into your MongoDB database
        db.collection("tableMessages").insertOne(data, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error inserting data into database");
          }
          console.log("Data inserted into database");
          res.status(200).send("Data submitted successfully!");
        });
        break;
      default:
        // handle other HTTP methods
        res.status(405).send('Method Not Allowed');
        break;
    }
  });

  // start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

