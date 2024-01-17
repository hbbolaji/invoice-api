const express = require("express");
const dotenv = require("dotenv");
const connection = require("./connection.js");
dotenv.config({ path: ".env" });
const userRouter = require("./routes/userRoutes");
const invoiceRouter = require("./routes/invoiceRoutes");

const port = process.env.PORT;
const db_uri = process.env.DB_URI;
const password = process.env.PASSWORD;
const uri = db_uri.replace("<password>", password);
connection(uri);
const app = express();
app.use(express.json());

// routes
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
