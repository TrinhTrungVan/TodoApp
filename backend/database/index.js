import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo_app");
        console.log("Connect sucessfully!");
    } catch (err) {
        console.log("Connect failed!");
    }
};

export default connectDB;
