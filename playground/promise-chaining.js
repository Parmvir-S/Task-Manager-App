require("../src/db/mongoose.js");
const User = require("../src/models/user.js");

const _id = "61dfced687e463cac1620b16"

// User.findByIdAndUpdate(_id, { age: 99}).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 99 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (_id, age) => {
    const user = await User.findByIdAndUpdate(_id, { age });
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount(_id, 25).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})