const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //automatically parse incoming json to an object 
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
//     // const task = await Task.findById("61e4fe33ab6762c4b197d7fb");
//     // await task.populate("owner");
//     // console.log(task.owner)
    
//     const user = await User.findById("61e4fc6e0df23099a905ccea");
//     await user.populate("tasks");
//     console.log(user.tasks)
// }

// main();