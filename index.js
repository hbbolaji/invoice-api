const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
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

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, try again in one hour",
});

// Global middleware
// rate-limiting
app.use("/api", limiter);

// http security
app.use(helmet());

// body parser
app.use(express.json({ limit: "50kb" }));

// routes
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on Port ${port}`);
});
