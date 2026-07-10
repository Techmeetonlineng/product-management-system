const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, (req, res) => {

    res.json({

        success: true,

        message: "Welcome to your dashboard.",

        user: req.user

    });

});

module.exports = router;