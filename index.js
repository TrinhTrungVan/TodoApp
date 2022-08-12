const todoApp = document.querySelector(".app");
const todoList = document.querySelector(".todo_list");
const todoName = document.querySelector(".todo_name");

let item;
let deleteIdx;
let insertIdx;
let isReadyToDrag = false;
let moved = false;

const addTodoItem = async (data) => {
    try {
        const res = await axios.post("http://localhost:5000/api/todos/create", data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const deleteTodoItem = async (id) => {
    try {
        const res = await axios.delete(`http://localhost:5000/api/todos/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const updateTodoItem = async (data) => {
    try {
        const res = await axios.put(`http://localhost:5000/api/todos/${data._id}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const saveLocal = () => {
    localStorage.setItem("todos", JSON.stringify(TODOS));
};

let TODOS;
const render = () => {
    let content = "";
    TODOS.forEach((item, index) => {
        content += `
        <li id=${item._id} data-index="${index}" class="todo_item" style="${item.status ? "opacity: 0.3" : ""}">
            <input type="checkbox" class="status" ${item.status ? "checked" : ""}>
            <p class="name">${item.name}</p>
            <span class="space"></span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </li>
        `;
    });
    todoList.innerHTML = content;
};

const load = async () => {
    if (localStorage.hasOwnProperty("todos")) {
        TODOS = JSON.parse(localStorage.getItem("todos"));
        render();
    } else {
        try {
            const res = await axios.get("http://localhost:5000/api/todos");
            TODOS = res.data;
            localStorage.setItem("todos", JSON.stringify(TODOS));
            render();
        } catch (error) {
            console.log(error);
        }
    }
};
load();

addEventListener("click", async (e) => {
    if (e.target.matches(".add_todo")) {
        const item = await addTodoItem({ name: todoName.value, status: false });
        TODOS.push(item);
        saveLocal();
        todoName.value = "";
        render();
    }
    if (e.target.matches(".delete")) {
        const deleteId = e.target.parentElement.id;
        const deleteIdx = e.target.parentElement.dataset.index;
        TODOS.splice(deleteIdx, 1);
        saveLocal();
        await deleteTodoItem(deleteId);
        render();
    }
    if (e.target.matches(".edit")) {
        const index = e.target.parentElement.dataset.index;
        const todoItem = document.querySelector(`[data-index="${index}"]`);
        const oldNode = todoItem.querySelector("p");
        const newNode = document.createElement("input");

        if (e.target.innerHTML === "Save") {
            const newNode = todoItem.querySelector("input[type='text']");
            const oldNode = document.createElement("p");
            todoItem.replaceChild(oldNode, newNode);
            oldNode.innerHTML = newNode.value;
            e.target.innerHTML = "Edit";
            TODOS[index].name = newNode.value;
            saveLocal();

            await updateTodoItem(TODOS[index]);
            render();
            return;
        }
        e.target.innerHTML = "Save";
        todoItem.replaceChild(newNode, oldNode);
        newNode.setAttribute("type", "text");
        newNode.setAttribute("value", oldNode.innerHTML);
        // Chuyển chuột về cuối ô input
        const end = newNode.value.length;
        newNode.setSelectionRange(end, end);
        newNode.focus();
    }
    if (e.target.matches(".status")) {
        const updateIdx = e.target.parentElement.dataset.index;
        TODOS[updateIdx].status = !TODOS[updateIdx].status;
        saveLocal();
        await updateTodoItem(TODOS[updateIdx]);
        render();
    }
});

const mouseDownTodo = (e) => {
    if (e.target.matches(".todo_item") || e.target.matches(".name")) {
        isReadyToDrag = true;
        deleteIdx = e.target.closest(".todo_item").dataset.index;
        item = TODOS[deleteIdx];

        const removeItem = document.querySelector(`[data-index="${deleteIdx}"]`);
        removeItem.style.opacity = "0.2";

        const shadow = e.target.closest(".todo_item").cloneNode(true);
        todoList.appendChild(shadow);
        shadow.id = "shadow";
        shadow.style.display = "none";
    }
};

const mouseMoveTodo = (e) => {
    if (isReadyToDrag) {
        moved = true;
        const shadow = document.getElementById("shadow");
        if (shadow) {
            shadow.style.opacity = "0.7";
            shadow.style.display = "flex";

            // Giới hạn khoảng kéo thả
            let shadowHeight = shadow.getBoundingClientRect().height;
            let moveMin = -shadowHeight / 2;
            let moveMax = todoList.getBoundingClientRect().height - shadowHeight / 2;

            let shadowTop = e.clientY - todoList.getBoundingClientRect().top - shadowHeight / 2;
            if (shadowTop <= moveMin) shadowTop = moveMin;
            if (shadowTop >= moveMax) shadowTop = moveMax;
            shadow.style.top = shadowTop + "px";

            insertIdx = Math.floor(shadowTop / shadowHeight);

            // Check khi kéo lên
            if (insertIdx < deleteIdx) {
                insertIdx += 1;
            }
        }
    }
};

const mouseUpTodo = async (e) => {
    if (isReadyToDrag) {
        const shadow = todoList.querySelector("#shadow");
        if (shadow) {
            todoList.removeChild(shadow);
        }
        if (moved) {
            TODOS.splice(deleteIdx, 1);
            TODOS.splice(insertIdx, 0, item);
            saveLocal();
        }
        render();
    }
    isReadyToDrag = false;
    moved = false;
};

todoList.addEventListener("mousedown", (e) => mouseDownTodo(e));
addEventListener("mousemove", (e) => mouseMoveTodo(e));
addEventListener("mouseup", (e) => mouseUpTodo(e));
