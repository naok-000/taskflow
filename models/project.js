const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// プロジェクトのスキーマを定義
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Project", projectSchema);
