// Store the tasks
var tasks = [];
// Elements from the HTML
var taskInput = document.getElementById("taskInput");
var addTaskButton = document.getElementById("addTaskButton");
var taskList = document.getElementById("taskList");
var clearCompletedButton = document.getElementById("clearCompleted");
var filterButtons = document.querySelectorAll(".filter-btn");
// Add a new task
function addTask() {
    var text = taskInput.value.trim();
    if (text === "")
        return;
    var newTask = {
        id: tasks.length + 1,
        text: text,
        completed: false,
    };
    tasks.push(newTask);
    taskInput.value = "";
    renderTasks();
}
// Render the task list
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(function (task) {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        // Add the "completed" class to the <span> if the task is completed
        var spanClass = task.completed ? "completed" : "";
        li.innerHTML = "\n        <input type=\"checkbox\" class=\"form-check-input\" data-task-id=\"".concat(task.id, "\" ").concat(task.completed ? "checked" : "", ">\n        <span class=\"").concat(spanClass, " span-text\">").concat(task.text, "</span>\n      ");
        var checkbox = li.querySelector("input");
        checkbox.addEventListener("change", function () { return toggleTaskCompletion(task.id); });
        taskList.appendChild(li);
    });
    updateItemCount();
}
// Toggle task completion
function toggleTaskCompletion(taskId) {
    var task = tasks.find(function (t) { return t.id === taskId; });
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}
// Update the item count
function updateItemCount() {
    var itemCount = tasks.filter(function (task) { return !task.completed; }).length;
    var itemCountElement = document.querySelector("button.btn-light");
    if (itemCountElement) {
        itemCountElement.textContent = "".concat(itemCount, " item(s) left");
    }
}
// Clear completed tasks
function clearCompletedTasks() {
    var incompleteTasks = tasks.filter(function (task) { return !task.completed; });
    tasks.length = 0; // Clear all tasks
    tasks.push.apply(// Clear all tasks
    tasks, incompleteTasks); // Add back the incomplete tasks
    renderTasks();
}
// Filter tasks based on completion status
function filterTasks(filter) {
    switch (filter) {
        case "all":
            renderTasks();
            break;
        case "active":
            var activeTasks = tasks.filter(function (task) { return !task.completed; });
            renderFilteredTasks(activeTasks);
            break;
        case "completed":
            var completedTasks = tasks.filter(function (task) { return task.completed; });
            renderFilteredTasks(completedTasks);
            break;
    }
}
// Render filtered tasks
function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = "";
    filteredTasks.forEach(function (task) {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = "\n        <input type=\"checkbox\" class=\"form-check-input\" data-task-id=\"".concat(task.id, "\" ").concat(task.completed ? "checked" : "", ">\n        <span class=\"span-text\">").concat(task.text, "</span>\n      ");
        var checkbox = li.querySelector("input");
        checkbox.addEventListener("change", function () { return toggleTaskCompletion(task.id); });
        taskList.appendChild(li);
    });
}
// Event listeners
addTaskButton.addEventListener("click", addTask);
clearCompletedButton.addEventListener("click", clearCompletedTasks);
// Use event delegation for filter buttons
document.querySelectorAll('.filter-btn').forEach(function (button) {
    button.addEventListener("click", function (event) {
        var filter = event.target.getAttribute("data-filter");
        if (filter !== null) {
            filterTasks(filter);
        }
    });
});
// Initial rendering
renderTasks();
