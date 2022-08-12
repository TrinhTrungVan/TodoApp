import mongoose from "mongoose";

const todoScheme = new mongoose.Schema({
    name: String,
    status: Boolean,
});

const Todo = mongoose.model("todo", todoScheme);

export default Todo;
