const express = require("express");
const con = require("./db/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const webRouter = require("./routes/webRoute");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", userRouter);
app.use("/", webRouter);

//error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 1700;
  err.message = err.message || "internal server error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SAMPLE API",
      description: "Swagger documentation for the Sample API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:1300/",
        // description: "development server",
      },
    ],
  },
  apis: ["./index.js"],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *  get:
 *    summary: this api is used to check the get method is working
 *    description: this api is used to check the get method is working
 *    responses:
 *        200:
 *            description: working the get api
 *
 *
 *
 *
 */

app.get("/", (req, res) => {
  res.send(" Welcome to mysql  Api");
});

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    description: Returns a list of all users
 *    responses:
 *        200:
 *            description: OK
 *            content:
 *               application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/User'
 *
 *
 *
 *
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *           User:
 *               type: object
 *               properties:
 *                   id:
 *                       type: string
 *                       format: uuid
 *                       example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *                   name:
 *                       type: string
 *                       example: John Doe
 *                   email:
 *                        type: string
 *                        format: email
 *                        example: johndoe@example.com
 *                   password:
 *                        type: string
 *                        example: 14r372898923821868362936928
 */

app.get("/users", (req, res) => {
  con.query("select * from student", (error, result, fields) => {
    if (error) {
      res.send("error");
    } else {
      res.send(result);
    }
  });
});

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Create a new user
 *    description: Create a new user with the provided data
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *    responses:
 *        201:
 *            description: Created
 *            content:
 *               application/json:
 *                  schema:
 *                        $ref: '#/components/schemas/User'
 *
 *
 *
 *
 */

app.post("/users", (req, res) => {
  const data = req.body;
  con.query("INSERT INTO student SET ?", data, (error, result, fields) => {
    if (error) error;
    res.send(data);
  });
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Get all users by ID
 *    description: Returns a  single user based on the provided Id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: id of the user
 *    responses:
 *        200:
 *            description: OK
 *            content:
 *               application/json:
 *                 schema:
 *                        $ref: '#/components/schemas/User'
 *
 *
 *
 *
 */

app.get("/users/:id", (req, res) => {
  const data = req.params.id;
  con.query("select * from student where id = ? ", data, (error, result) => {
    if (error) {
      res.send("error");
    } else {
      res.send(result);
    }
  });
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update a user id
 *    description: Updates an existing user based on the  provided id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: id of the user
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *    responses:
 *        200:
 *            description: OK
 *            content:
 *               application/json:
 *                 schema:
 *                        $ref: '#/components/schemas/User'
 *
 *
 *
 *
 */
app.put("/users/:id", (req, res) => {
  const data = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.params.id,
  ];
  con.query(
    "UPDATE student  SET name=?,email=?, password=? where id=?",
    data,
    (error, result, fields) => {
      if (error) error;
      res.send(result);
    }
  );
  // res.send("update is done");
});

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete a user by id
 *    description:  delete an existing user based on the  provided id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: id of the user
 *    responses:
 *        204:
 *            description: No Content
 *
 *
 *
 *
 *
 */
app.delete("/users/:id", (req, res) => {
  con.query(
    "DELETE FROM student WHERE id=" + req.params.id,
    (error, result, fields) => {
      if (error) error;
      res.send(result);
    }
  );
});

//use  login api

/**
 * @swagger
 * /api/register:
 *  post:
 *    summary: Register a new user
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - name
 *                 - email
 *                 - password
 *    responses:
 *        200:
 *            description: User registeration successful
 *        400:
 *            description: Invalid request body or missing rrequired fields
 *
 *
 *
 *
 */
// app.post("/api/register", (req, res) => {
//   res.send(" register");
// });

/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: User login
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - email
 *                 - password
 *    responses:
 *        200:
 *            description: User registeration successful
 *        401:
 *            description: Invalid credentials
 *        400:
 *            description: Invalid request body or missing rrequired fields
 *
 *
 *
 *
 */
app.post("/api/login", (req, res) => {
  res.send("login");
});

/**
 * @swagger
 * /api/logout:
 *  post:
 *    summary: User logout
 *    responses:
 *        200:
 *            description: User logout successful
 *
 *
 *
 *
 */

app.post("/api/logout", (req, res) => {
  res.send(" logout");
});

/**
 * @swagger
 * /api/password/reset:
 *  post:
 *    summary: Request password reset
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *               required:
 *                 - email

 *    responses:
 *        200:
 *            description: Password reset request successful
 *        404:
 *            description: User not found
 *        400:
 *            description: Invalid request body or missing rrequired fields
 *
 *
 *
 *
 */
app.post("/api/password/reset", (req, res) => {
  res.send("/reset");
});

/**
 * @swagger
 * /api/password/reset/{token}:
 *  put:
 *    summary: Reset user password
 *    parameters:
 *      - name: token
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  newPassword:
 *                    type: string
 *                  required:
 *                    - newPassword
 *    responses:
 *        200:
 *            description: Password reset successful
 *        404:
 *            description: User not found
 *        400:
 *            description: Invalid request body or missing required  fields
 *
 *
 *
 *
 */
app.put("/api/password/reset/{token}", (req, res) => {
  res.send("token verifiaction");
});
app.listen(1300, () => {
  console.log("server is run on 1300");
});
