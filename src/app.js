const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT;

app.use(express.json()); //automatically parse incoming json to an object 
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
