const todoList = [];
let comdoList = [];
let remList = [];

const addButton = document.getElementById("add-button");
const todoInput = document.getElementById("todo-input");
const deleteAllButton = document.getElementById("delete-all");
const allTodos = document.getElementById("all-todos");
const deleteSButton = document.getElementById("delete-selected");

// Event Listeners
addButton.addEventListener("click", (e) => e.preventDefault() || add());
deleteAllButton.addEventListener("click", deleteAll);
deleteSButton.addEventListener("click", deleteS);
todoInput.addEventListener("keypress", (e) => e.key === "Enter" && add());

document.addEventListener("click", (e) => {
    const targetClass = e.target.className.split(" ")[0];
    if (targetClass === "complete") completeTodo(e);
    if (targetClass === "delete") deleteTodo(e);
    if (e.target.id === "all") viewAll();
    if (e.target.id === "rem") viewRemaining();
    if (e.target.id === "com") viewCompleted();
});


// Core Functions
function update() {
    comdoList = todoList.filter((task) => task.complete);
    remList = todoList.filter((task) => !task.complete);
    document.getElementById("r-count").textContent = todoList.length;
    document.getElementById("c-count").textContent = comdoList.length;
}

function add() {
    const value = todoInput.value.trim();
    if (!value) {
        alert("⚠️ Mission cannot be empty");
        return;
    }
    todoList.push({
        task: value,
        id: Date.now().toString(),
        complete: false,
    });
    todoInput.value = "";
    update();
    addinmain(todoList);
}

function addinmain(tasks) {
    allTodos.innerHTML = tasks.map((task) => `
        <div id="${task.id}" class="todo-item">
            <p id="task" class="${task.complete ? "line" : ""}">
                ${task.task}
            </p>
            <div class="todo-actions">
                <button class="complete btn btn-success" aria-label="Complete task">
                    ✓
                </button>
                <button class="delete btn btn-error" aria-label="Delete task">
                    ×
                </button>
            </div>
        </div>
    `).join("");
}

function deleteTodo(e) {
    const id = e.target.closest(".todo-item").id;
    todoList = todoList.filter((task) => task.id !== id);
    update();
    addinmain(todoList);
}

function completeTodo(e) {
    const id = e.target.closest(".todo-item").id;
    const task = todoList.find((t) => t.id === id);
    task.complete = !task.complete;
    update();
    addinmain(todoList);
}

function deleteAll() {
    todoList.length = 0;
    update();
    addinmain(todoList);
}

function deleteS() {
    todoList = todoList.filter((task) => !task.complete);
    update();
    addinmain(todoList);
}

// Filter Functions
function viewCompleted() { addinmain(comdoList); }
function viewRemaining() { addinmain(remList); }
function viewAll() { addinmain(todoList); }