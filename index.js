const express = require("express"); //to import express

const bodyParser = require("body-parser"); //to import body-parser
const app = express();
const mongoConnection = require("./db");
const port = 4000;
//CartAPI will be the name of our Database

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// apis routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello Amisha");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  mongoConnection();
});
