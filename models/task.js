const mongoose = require("mongoose");
const taskStatus = require("../constants/taskStatus");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.NOT_STARTED,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
});

module.exports = mongoose.model("Task", taskSchema);
