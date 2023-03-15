const mongoose = require("mongoose");
const Task = require(__dirname + "/Task");


const listSchema = new mongoose.Schema({
    name: String,
    items: [Task.Schema]
});



module.exports = mongoose.model("List", listSchema);
