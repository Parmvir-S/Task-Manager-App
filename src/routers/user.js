const { application } = require("express");
const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken(); 
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get("/users/me", auth, async (req, res) => {
    const user = req.user;
    res.send(user);
});

//Dont Need - Shouldnt be able to fetch user profile of other users
// router.get("/users/:id", async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// });

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    };

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save();
        //top version allows for use of middleware
        //bottom one is simpler but bypasses mongoose 

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        
        //we already know they exist - because logged in
        // if (!user) {
        //     return res.status(404).send();
        // }

        res.send(req.user);
    } catch (e) {
        res.status(400).send(); //validation error - can also have db connection error 500
    }
});

router.delete("/users/me", auth, async (req, res) => {
    const _id = req.user._id;
    try {
        //Dont need these - just fetched the user in the auth middleware function
        // const user = await User.findByIdAndDelete(_id);
        // if (!user) {
        //     return res.status(404).send();
        // }

        //line below is simpler version of above - remove is a mongoose method - deletes a document
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

const upload = multer({
    dest: "avatars"
});

router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
    res.send();
})


module.exports = router;