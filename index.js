const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const ErrorHandler = require("./middleware/Error");

// load env files
dotenv.config({ path: "./config/config.env" });

// import DB connection
const connectDB = require("./Config/db");
connectDB();

// routes goes here
const auth = require("./routes/Auth");

const app = express();
app.use(cors());
// body pharser
app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// error handler
app.use(ErrorHandler);

// initialize routes goes here
app.use("/api/auth", auth);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error : ${error.message}`.red.bold);

  // close server and exit process
  server.close(() => process.exit(1));
});
