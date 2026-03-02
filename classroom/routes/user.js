const express = require("express");
const router = express.Router();

// Route to get users
router.get("/", (req, res) => {
    res.send("Get route for users");
});

// Route to delete a user by ID
router.delete("/:id", (req, res) => {
    res.send(`Delete route for user with ID: ${req.params.id}`);
});

// Route to add a new user
router.post("/", (req, res) => {
    res.send("Post route for users");
});

// Route to edit a user by ID
router.put("/:id/edit", (req, res) => {
    res.send(`Edit route for user with ID: ${req.params.id}`);
});

module.exports = router;
