const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const con = require("../db/config");
const randomstring = require("randomstring");
const sendMail = require("../helpers/sendMail");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../env");
const { hash } = require("bcrypt");

const register = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  con.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${con.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).send({
              msg: err,
            });
          } else {
            con.query(
              `INSERT INTO users (name,email,password,image) VALUES ('${
                req.body.name
              }',${con.escape(req.body.email)},${con.escape(hash)},'images/${
                req.file.filename
              }');`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                }
                let mailSubject = "Mail Verification";
                const randomToken = randomstring.generate();
                let content =
                  "<p> Hii" +
                  req.body.name +
                  ',\
                Please <a href="http://localhost:1300/mail-verification?token=' +
                  randomToken +
                  '" > Verify </a> your mail.';
                sendMail(req.body.email, mailSubject, content);
                con.query(
                  "UPDATE users set token=? where email=?",
                  [randomToken, req.body.email],
                  function (error, result, fields) {
                    if (error) {
                      return res.status(400).send({
                        msg: err,
                      });
                    }
                  }
                );
                return res.status(200).send({
                  msg: "The user has been registered with us!",
                });
              }
            );
          }
        });
      }
    }
  );
};

const verifyMail = (req, res) => {
  var token = req.query.token;
  con.query(
    "SELECT * FROM users where token=? limit 1",
    token,
    function (error, result, fields) {
      if (error) {
        console.log(error.message);
      }
      if (result.length > 0) {
        con.query(
          `UPDATE users SET token = null, is_verified = 1 WHERE id='${result[0].id}'`
        );
        return res.render("mail-verification", {
          message: "Mail verified Successfully",
        });
      } else {
        return res.render("404");
      }
    }
  );
};

const login = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  con.query(
    ` SELECT * FROM users WHERE email=${con.escape(req.body.email)};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "Email and password is incorrect!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(400).send({
              msg: bErr,
            });
          }
          if (bResult) {
            // console.log(JWT_SECRET);
            const token = jwt.sign(
              { id: result[0]["id"], is_admin: result[0]["is_admin"] },
              JWT_SECRET,
              { expiresIn: "1h" }
            );
            con.query(
              `UPDATE users SET last_login = now() WHERE id =  '${result[0]["id"]}'`
            );
            return res.status(200).send({
              msg: "logged in",
              token,
              user: result[0],
            });
          }

          return res.status(401).send({
            msg: "Email or password is incorrect!",
          });
        }
      );
    }
  );
};

const getUser = (req, res) => {
  const authToken = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(authToken, JWT_SECRET);

  con.query(
    " SELECT * FROM users where id=? ",
    decode.id,
    function (error, result, fields) {
      if (error) throw error;
      return res.status(200).send({
        success: true,
        data: result[0],
        message: "Fetch Successfully",
      });
    }
  );
};

const forgetPassword = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var email = req.body.email;
  con.query(
    "SELECT * FROM users  where email=? limit 1",
    email,
    function (error, result, fields) {
      if (error) {
        return res.status(400).json({ message: error });
      }
      if (result.length > 0) {
        let mailSubject = "Forget Password";
        const randomString = randomstring.generate();
        let content =
          "<p> Hii, " +
          result[0].name +
          ' \
          Please <a href="http://localhost:1300/reset-password?token=' +
          randomString +
          '"> Click Here</a> to Reset Your Password</p> ';
        sendMail(email, mailSubject, content);

        con.query(
          `DELETE FROM password_resets WHERE email = ${con.escape(
            result[0].email
          )}`
        );
        con.query(
          `INSERT INTO  password_resets (email, token) VALUES(${con.escape(
            result[0].email
          )},'${randomString}')`
        );
        return res.status(200).send({
          message: "Mail  has been Reset sucessfully",
        });
      }
      return res.status(401).send({
        message: "Mail  does not exists!",
      });
    }
  );
};
const resetPasswordLoad = (req, res) => {
  try {
    var token = req.query.token;
    if (token == undefined) {
      res.render("404");
    }
    con.query(
      `SELECT * FROM password_resets  where token=? limit 1 `,
      token,
      function (error, result, fields) {
        if (error) {
          console.log(error);
        }

        if (result !== undefined && result.length > 0) {
          con.query(
            "SELECT * From users where email=? limit 1",
            result[0].email,
            function (error, result, fileds) {
              if (error) {
                console.log(error);
              }
              res.render("reset-password", { user: result[0] });
            }
          );
        } else {
          res.render("404");
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.render("reset-password", {
      error_message: "Password Not Matching!",
      user: { id: req.body.user_id, email: req.body.email },
    });
  }
  bcrypt.hash(req.body.confirm_password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }

    con.query(`DELETE FROM password_resets where email='${req.body.email}'`);
    con.query(
      `UPDATE users SET password='${hash}' where id='${req.body.user_id}'`
    );
    res.render("message", { message: "Password Reset Sucessfully" });
  });
};

const updateProfile = (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, JWT_SECRET);
    var sql = "",
      data;
    if (req.file != undefined) {
      sql = "UPDATE users SET name = ?, email = ?, image = ? where id=? ";
      data = [
        req.body.name,
        req.body.email,
        "images/" + req.file.filename,
        decode.id,
      ];
    } else {
      sql = "UPDATE users SET name = ?, email = ? ,where id=? ";
      data = [req.body.name, req.body.email, decode.id];
    }
    con.query(sql, data, function (error, results, fields) {
      if (error) {
        res.status(400).send({ msg: error });
      }
      res.status(200).send({
        msg: "Profile has been updated",
      });
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};
module.exports = {
  register,
  verifyMail,
  login,
  getUser,
  forgetPassword,
  resetPasswordLoad,
  resetPassword,
  updateProfile,
};
