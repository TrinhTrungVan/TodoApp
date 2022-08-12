import Todo from "../models/todoModel.js";

export const getAllTodos = async (req, res) => {
    const todos = await Todo.find({});
    res.json(todos);
};

export const createTodo = async (req, res) => {
    const newTodoItem = new Todo(req.body);
    newTodoItem.save().then(() => res.send(JSON.stringify(newTodoItem)));
};

export const deleteTodo = async (req, res) => {
    const id = req.params.id;
    const deleteItem = await Todo.findById(id);
    await deleteItem.remove().then(() => res.send(JSON.stringify(deleteItem)));
};

export const updateTodo = async (req, res) => {
    const id = req.params.id;
    const updateItem = new Todo(req.body);
    await Todo.findByIdAndUpdate(id, updateItem).then(() => res.send(JSON.stringify(updateItem)));
};
