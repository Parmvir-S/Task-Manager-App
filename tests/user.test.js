const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
    name: "Piara",
    email: "piararm@example.com",
    password: "torontoRaptors123%%"
}

beforeEach(async () => {
    await User.deleteMany(); //wipes db
    await new User(userOne).save(); //save user to db
})

test("Should Signup New User", async () => {
    await request(app).post("/users").send({
        name: "Parm",
        email: "parm@example.com",
        password: "parmparmparm12345#"
    }).expect(201)
})

test("Should Login Existing User", async () => {
    await request(app).post("/users/login").send({
        "email": userOne.email,
        "password": userOne.password
    }).expect(200)
})

test("Should Not Login Non-Existent User", async () => {
    await request(app).post("/users/login").send({
        "email": "Lebron@gmail.com",
        "password": "LALakers12345^#%"
    }).expect(400)
})