const express = require('express');
const addData = require('./controler');

const router = express.Router();

router.route("/").post(addData);

module.exports = router;