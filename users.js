const express = require("express");
const userRouter = express.Router();
const { db } = require("./config");

userRouter.get("/", (req, res) => {
  res.json({
    message: "WHY",
  });
});

// feedback api start

userRouter.get("/get-all-feedback", async (req, res) => {
  let sql = `SELECT * FROM feedback`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Feedback list retrieved successfully",
    });
  });
});

userRouter.get("/get-one-feedback", async (req, res) => {
  var id = req.body.id;

  let sql = `SELECT * FROM feedback WHERE ID = ${id}`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Feedback retrieved successfully",
    });
  });
});

userRouter.post("/post-feedback", async (req, res) => {
  var description = req.body.description;

  let sql = `INSERT INTO feedback(Description) VALUES ("${description}")`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 201,
      data,
      message: "Feedback added successfully",
    });
  });
});

userRouter.delete("/delete-feedback", async (req, res) => {
  var id = req.body.id;

  let sql = `DELETE FROM feedback WHERE ID =${id}`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "feedback deleted successfully",
    });
  });
});

userRouter.patch("/update-feedback", async (req, res) => {
  var id = req.body.id;
  var description = req.body.description;

  let sql = `UPDATE feedback SET Description="${description}" WHERE ID= ${id}`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "feedback instance updated successfully",
    });
  });
});

// feedback api end
// sign-in & sign-up api start

userRouter.post("/post-account", async (req, res) => {
  const bcrypt = require("bcrypt");
  // var email = req.body.email;
  // var username = req.body.username;
  // var password = req.body.password;
  // var confirm_password = req.body.confirm_password;

  var { email, username, password, confirm_password } = req.body;

  // check if passwords match
  // check if email already exists in the database
  // if email exist return 409
  // else encrypt password
  // insert into the user table the values

  if (password === confirm_password) {
    let sql = `SELECT * FROM users WHERE email="${email}"`;
    db.query(sql, async function (err, data, fields) {
      if (err) throw err;

      console.log(data);
      if (data.length === 0) {
        console.log(password);
        password = await bcrypt.hash(password, 10);
        console.log(password);
        let sql = `INSERT INTO users(email, username,  password) VALUES ('${email}','${username}','${password}')`;
        db.query(sql, function (err, data, fields) {
          if (err) throw err;
          res.status(201).json({
            data,
            message: "account added successfully",
          });
        });
      } else {
        return res.status(409).json({
          successful: false,
          body: {
            message: `Email is already in use, please use a different one.`,
          },
        });
      }
    });
  } else {
    return res.status(400).json({
      successful: false,
      body: {
        message: `Passwords do not match`,
      },
    });
  }
  // let sql = `INSERT INTO users(email, username,  password) VALUES ('${email}','${username}','${password}')`;
  // db.query(sql, function (err, data, fields) {
  //   if (err) throw err;
  //   res.json({
  //     status: 200,
  //     data,
  //     message: "account added successfully",
  //   });
  // });
});

userRouter.post("/login-account", async (req, res) => {
  const bcrypt = require("bcrypt");

  var { username, password } = req.body;

  let sql = `SELECT * FROM users WHERE username="${username}"`;
  db.query(sql, async function (err, data, fields) {
    if (err) throw err;
    console.log(data);
    if (data[0].username === username) {
      let sql = `SELECT password FROM users WHERE username="${username}"`;
      db.query(sql, async function (err, data, fields) {
        bcrypt.compare(password, data[0].password, (err, result) => {
          if (err) {
            console.error(`Error comparing passwords:`, err);
          } else if (result) {
            console.log("password is correct, User authenticated.");
            return res.status(201).json({
              data,
            });
          } else {
            return res.status(404).json({
              successful: false,
              body: {
                message: "Incorrect password. Authentication failed.",
              },
            });
          }
        });
        console.log(data);
      });
    } else {
      return res.status(404).json({
        successful: false,
        body: {
          message: `Username could not be found. Please try again.`,
        },
      });
    }
  });
});

//Login
//check if email exists in table,
//if it does not exist return 404
//if it exists check if password matches. Use bcrypt.compare()
// if password is valid, return 201 successful login
// else return 404.

module.exports = {
  userRouter,
};
