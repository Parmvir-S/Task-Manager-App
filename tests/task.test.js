const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { userOneId, userOne, userTwo, userTwoId, taskOne, taskTwo, taskThree, setupDatabase} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should Create Task For User", async () => {
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description" : "Homework",
            "owner" : userOneId
        })
        .expect(201)
    
    const tasks = await Task.find({owner: userOneId});
    expect(tasks.length).toBe(3); //2 to start off with
})

test("Should Create Task For User", async () => {
    await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    
    const tasks = await Task.find({owner: userOneId});
    expect(tasks.length).toBe(2); //2 to start off with
})

test("Test Delete Task Security", async () => {
    const resposne = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})