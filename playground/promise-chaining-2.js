require("../src/db/mongoose.js");
const Task = require("../src/models/task");

const _id = "61dfd171dd3b63b490498022";

// Task.findByIdAndDelete(_id).then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false });
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const deleteTaskAndCount = async (_id) => {
    const task = await Task.findByIdAndDelete(_id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deleteTaskAndCount(_id).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})