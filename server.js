const express = require("express");
const connect = require("./config/db");
const app = express();

// Connect DB
connect();

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
