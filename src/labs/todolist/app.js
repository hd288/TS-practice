// Store the tasks
var tasks = [];
// Elements from the HTML
var taskInput = document.getElementById("taskInput");
var addTaskButton = document.getElementById("addTaskButton");
var saveTaskButton = document.getElementById("saveTaskButton");
// const deleteTaskButton = document.getElementById(
//   "deleteTaskButton"
// ) as HTMLButtonElement;
// const editTaskButton = document.getElementById(
//   "editTaskButton"
// ) as HTMLButtonElement;
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
        li.innerHTML = "\n        <div class=\"container d-flex flex-row align-items-center\">\n        <input type=\"checkbox\" class=\"form-check-input check-box\" data-task-id=\"".concat(task.id, "\" ").concat(task.completed ? "checked" : "", ">\n        <span class=\"").concat(spanClass, " span-text w-50\">").concat(task.text, "</span>\n        <div class=\"container d-flex flex-row justify-content-end align-items-center\">\n        <button id=\"editTaskButton\" data-task-id=\"").concat(task.id, "\" type=\"button\" class=\"btn btn-warning\">\n          Edit Task\n        </button>\n        <button id=\"deleteTaskButton\" data-task-id=\"").concat(task.id, "\" type=\"button\" class=\"btn btn-danger\">\n          Delete Task\n        </button>\n        </div>\n        </div>\n      ");
        var checkbox = li.querySelector("input");
        checkbox.addEventListener("change", function () { return toggleTaskCompletion(task.id); });
        // Find the "Delete Task" and "Edit Task" buttons within the current li element
        var deleteTaskButton = li.querySelector("#deleteTaskButton");
        var editTaskButton = li.querySelector("#editTaskButton");
        // Add event listeners for button clicks
        deleteTaskButton.addEventListener("click", function () { return deleteTask(task.id); });
        editTaskButton.addEventListener("click", function () { return editTask(task.id); });
        taskList.appendChild(li);
    });
    updateItemCount();
}
// Edit task
function editTask(taskId) {
    // Find the task by taskId
    var task = tasks.find(function (t) { return t.id === taskId; });
    if (!task) {
        console.error("Task with id ".concat(taskId, " not found."));
        return;
    }
    // Hide the "Add Task" button and show the "Save Task" button
    addTaskButton.style.display = "none";
    saveTaskButton.style.display = "block";
    // Set the taskInput value to the task's text
    if (taskInput) {
        taskInput.value = task.text;
    }
    else {
        alert("Task input element not found.");
        return;
    }
    // Add an event listener for the "Save Task" button
    var saveTaskClickHandler = function () {
        if (taskInput) {
            // Update the task's text
            task.text = taskInput.value;
            // Hide the "Save Task" button and show the "Add Task" button
            saveTaskButton.style.display = "none";
            addTaskButton.style.display = "block";
            // Re-render the tasks to reflect the changes
            renderTasks();
            taskInput.value = "";
            // Remove the event listener to avoid multiple listeners
            saveTaskButton.removeEventListener("click", saveTaskClickHandler);
        }
        else {
            alert("Task input element not found.");
        }
    };
    saveTaskButton.addEventListener("click", saveTaskClickHandler);
}
// Delete task
function deleteTask(taskId) {
    var newTaskList = tasks.filter(function (t) { return t.id !== taskId; });
    var result = window.confirm("Are you sure you want to delete this task?");
    if (result) {
        tasks.length = 0;
        tasks.push.apply(tasks, newTaskList);
        renderTasks();
    }
    else {
        window.alert("You cancelled the deletion!");
    }
    renderTasks();
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
        // Add the "completed" class to the <span> if the task is completed
        var spanClass = task.completed ? "completed" : "";
        li.innerHTML = "\n        <div class=\"container d-flex flex-row align-items-center\">\n        <input type=\"checkbox\" class=\"form-check-input check-box\" data-task-id=\"".concat(task.id, "\" ").concat(task.completed ? "checked" : "", ">\n        <span class=\"").concat(spanClass, " span-text w-50\">").concat(task.text, "</span>\n        <div class=\"container d-flex flex-row justify-content-end align-items-center\">\n        <button id=\"editTaskButton\" data-task-id=\"").concat(task.id, "\" type=\"button\" class=\"btn btn-warning\">\n          Edit Task\n        </button>\n        <button id=\"deleteTaskButton\" data-task-id=\"").concat(task.id, "\" type=\"button\" class=\"btn btn-danger\">\n          Delete Task\n        </button>\n        </div>\n        </div>\n      ");
        var checkbox = li.querySelector("input");
        checkbox.addEventListener("change", function () { return toggleTaskCompletion(task.id); });
        // Find the "Delete Task" and "Edit Task" buttons within the current li element
        var deleteTaskButton = li.querySelector("#deleteTaskButton");
        var editTaskButton = li.querySelector("#editTaskButton");
        // Add event listeners for button clicks
        deleteTaskButton.addEventListener("click", function () { return deleteTask(task.id); });
        editTaskButton.addEventListener("click", function () { return editTask(task.id); });
        taskList.appendChild(li);
    });
}
// Event listeners
addTaskButton.addEventListener("click", addTask);
clearCompletedButton.addEventListener("click", clearCompletedTasks);
// Use event delegation for filter buttons
document.querySelectorAll(".filter-btn").forEach(function (button) {
    button.addEventListener("click", function (event) {
        var filter = event.target.getAttribute("data-filter");
        if (filter !== null) {
            filterTasks(filter);
        }
    });
});
// Initial rendering
renderTasks();
