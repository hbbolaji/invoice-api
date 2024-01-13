const express = require("express");
const dotenv = require("dotenv");
const connection = require("./connection.js");
dotenv.config({ path: ".env" });

const port = process.env.PORT;
const db_uri = process.env.DB_URI;
const password = process.env.PASSWORD;
const uri = db_uri.replace("<password>", password);
connection(uri);
const app = express();

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
