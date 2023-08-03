const express = require("express");

const cors = require("cors");
const morgan = require("morgan");

//require mysql package
const mysql = require("mysql2");
const { userRouter } = require("./users");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/users", userRouter);

var port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
