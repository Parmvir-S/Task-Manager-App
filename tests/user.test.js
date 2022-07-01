const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Piara",
    email: "piararm@example.com",
    password: "torontoRaptors123%%",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
}

beforeEach(async () => {
    await User.deleteMany(); //wipes db
    await new User(userOne).save(); //save user to db
})

test("Should Signup New User", async () => {
    const response = await request(app).post("/users").send({
        name: "Parm",
        email: "parm@example.com",
        password: "parmparmparm12345#"
    })

    // Assert that the db was changed correctly
    // new user with same id as the id we are getting back as response body

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Parm",
            email: "parm@example.com",
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("parmparmparm12345#");
})

test("Should Login Existing User", async () => {
    const response = await request(app).post("/users/login").send({
        "email": userOne.email,
        "password": userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(user).not.toBeNull();

    expect(user.tokens[1].token).toBe(response.body.token)

})

test("Should Not Login Non-Existent User", async () => {
    await request(app).post("/users/login").send({
        "email": "Lebron@gmail.com",
        "password": "LALakers12345^#%"
    }).expect(400)
})

test("Should Get Profile For User", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should Not Get Profile For UnAuthenticated User", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401)
})

test("Should Delete Account For User", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test("Should Not Delete Account For Unauthenticated User", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should Upload Avatar Img", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should Update Valid User Fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            "name" : "LeBron James"
        })
        .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user.name).toBe("LeBron James");
})

test("Should Not Update InValid User Fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            "Location" : "Vancouver"
        })
        .expect(400)
})