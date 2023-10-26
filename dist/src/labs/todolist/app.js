"use strict";
// Store the tasks
const tasks = [];
// Elements from the HTML
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const saveTaskButton = document.getElementById("saveTaskButton");
const deleteTaskButton = document.getElementById("deleteTaskButton");
const editTaskButton = document.getElementById("editTaskButton");
const taskList = document.getElementById("taskList");
const clearCompletedButton = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === "")
        return;
    const newTask = {
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
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        // Add the "completed" class to the <span> if the task is completed
        const spanClass = task.completed ? "completed" : "";
        li.innerHTML = `
        <input type="checkbox" class="form-check-input" data-task-id="${task.id}" ${task.completed ? "checked" : ""}>
        <span class="${spanClass} span-text">${task.text}</span>
        <button id="editTaskButton" data-task-id="${task.id}" type="button" class="btn btn-primary">
          Edit Task
        </button>
        <button id="deleteTaskButton" data-task-id="${task.id}" type="button" class="btn btn-primary">
          Delete Task
        </button>
      `;
        const checkbox = li.querySelector("input");
        checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));
        deleteTaskButton.addEventListener("click", () => deleteTask(task.id));
        editTaskButton.addEventListener("click", () => editTask(task.id));
        taskList.appendChild(li);
    });
    updateItemCount();
}
// Edit task
function editTask(taskId) {
    // Hide the "Add Task" button
    addTaskButton.style.display = "none";
    // Show the "Save Task" button
    saveTaskButton.style.display = "block";
    const task = tasks.find((t) => t.id === taskId);
    if (task && taskInput) {
        taskInput.value = task.text;
    }
    saveTaskButton.addEventListener("click", () => {
        // Hide the "Save Task" button
        saveTaskButton.style.display = "none";
        // Show the "Add Task" button
        addTaskButton.style.display = "block";
        // Perform any save logic here, e.g., updating the task with the new text
        if (task) {
            task.text = taskInput.value;
        }
        // Re-render the tasks to reflect the changes
        renderTasks();
    });
}
// Delete task
function deleteTask(taskId) {
    const newTaskList = tasks.filter((t) => t.id !== taskId);
    const result = window.confirm("Are you sure you want to delete this task?");
    if (result) {
        tasks.length = 0;
        tasks.push(...newTaskList);
        renderTasks();
    }
    else {
        window.alert("You cancelled the deletion!");
    }
    renderTasks();
}
// Toggle task completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}
// Update the item count
function updateItemCount() {
    const itemCount = tasks.filter((task) => !task.completed).length;
    const itemCountElement = document.querySelector("button.btn-light");
    if (itemCountElement) {
        itemCountElement.textContent = `${itemCount} item(s) left`;
    }
}
// Clear completed tasks
function clearCompletedTasks() {
    const incompleteTasks = tasks.filter((task) => !task.completed);
    tasks.length = 0; // Clear all tasks
    tasks.push(...incompleteTasks); // Add back the incomplete tasks
    renderTasks();
}
// Filter tasks based on completion status
function filterTasks(filter) {
    switch (filter) {
        case "all":
            renderTasks();
            break;
        case "active":
            const activeTasks = tasks.filter((task) => !task.completed);
            renderFilteredTasks(activeTasks);
            break;
        case "completed":
            const completedTasks = tasks.filter((task) => task.completed);
            renderFilteredTasks(completedTasks);
            break;
    }
}
// Render filtered tasks
function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = "";
    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `
        <input type="checkbox" class="form-check-input" data-task-id="${task.id}" ${task.completed ? "checked" : ""}>
        <span class="span-text">${task.text}</span>
      `;
        const checkbox = li.querySelector("input");
        checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));
        taskList.appendChild(li);
    });
}
// Event listeners
addTaskButton.addEventListener("click", addTask);
clearCompletedButton.addEventListener("click", clearCompletedTasks);
// Use event delegation for filter buttons
document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const filter = event.target.getAttribute("data-filter");
        if (filter !== null) {
            filterTasks(filter);
        }
    });
});
// Initial rendering
renderTasks();
