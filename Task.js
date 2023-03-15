const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    toDo: {
        type: String,
        required: [true, "Nothing to do provided"]
    }
});


module.exports = mongoose.model("Task", taskSchema);
module.exports.Schema = taskSchema;