const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Can't have 'password' in your password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//virtual property - relationship bw two entities (bw user and task)
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",  //where that local data is stored 
    foreignField: "owner" //name of field on the other thing (task) that is going to create this relationshhip - we set that to be the owner
});

//methods are accessible on the instances - instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    //use delete operator to delete stuff off of that object 
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

//static methods are accessible on the model - model methods
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable To Login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable To Login");
    }
    return user;
}

//arrow functions don't bind "this"
//hash the plain text password before saving
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id })
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;