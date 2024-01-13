const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const port = process.env.PORT;
const app = express();

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
