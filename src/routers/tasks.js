const { request } = require("express");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});

router.get("/tasks", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        // await res.user.populate("tasks").execPopulate(); this would also work
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body); //converts to an array of properties
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!"});
    }

    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id});  

        if (!task) {
            res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e); //some sort of validation error
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;