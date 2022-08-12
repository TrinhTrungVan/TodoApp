import todoRouter from "../routes/todoRouter.js";

const route = (app) => {
    app.use("/api/todos", todoRouter);
};

export default route;
