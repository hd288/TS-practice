// Define a Task type
type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// Store the tasks
const tasks: Task[] = [];

// Elements from the HTML
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskButton = document.getElementById(
  "addTaskButton"
) as HTMLButtonElement;
const saveTaskButton = document.getElementById(
  "saveTaskButton"
) as HTMLButtonElement;

// const deleteTaskButton = document.getElementById(
//   "deleteTaskButton"
// ) as HTMLButtonElement;
// const editTaskButton = document.getElementById(
//   "editTaskButton"
// ) as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;
const clearCompletedButton = document.getElementById(
  "clearCompleted"
) as HTMLButtonElement;
const filterButtons = document.querySelectorAll(".filter-btn");

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask: Task = {
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
        <div class="container d-flex flex-row align-items-center">
        <input type="checkbox" class="form-check-input check-box" data-task-id="${
          task.id
        }" ${task.completed ? "checked" : ""}>
        <span class="${spanClass} span-text w-50">${task.text}</span>
        <div class="container d-flex flex-row justify-content-end align-items-center">
        <button id="editTaskButton" data-task-id="${
          task.id
        }" type="button" class="btn btn-warning">
          Edit Task
        </button>
        <button id="deleteTaskButton" data-task-id="${
          task.id
        }" type="button" class="btn btn-danger">
          Delete Task
        </button>
        </div>
        </div>
      `;

    const checkbox = li.querySelector("input") as HTMLInputElement;
    checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));

    // Find the "Delete Task" and "Edit Task" buttons within the current li element
    const deleteTaskButton = li.querySelector(
      "#deleteTaskButton"
    ) as HTMLButtonElement;
    const editTaskButton = li.querySelector(
      "#editTaskButton"
    ) as HTMLButtonElement;

    // Add event listeners for button clicks
    deleteTaskButton.addEventListener("click", () => deleteTask(task.id));
    editTaskButton.addEventListener("click", () => editTask(task.id));

    taskList.appendChild(li);
  });

  updateItemCount();
}

// Edit task
function editTask(taskId: number) {
  // Find the task by taskId
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    console.error(`Task with id ${taskId} not found.`);
    return;
  }

  // Hide the "Add Task" button and show the "Save Task" button
  addTaskButton.style.display = "none";
  saveTaskButton.style.display = "block";

  // Set the taskInput value to the task's text
  if (taskInput) {
    taskInput.value = task.text;
  } else {
    alert("Task input element not found.");
    return;
  }

  // Add an event listener for the "Save Task" button
  const saveTaskClickHandler = () => {
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
    } else {
      alert("Task input element not found.");
    }
  };

  saveTaskButton.addEventListener("click", saveTaskClickHandler);
}


// Delete task
function deleteTask(taskId: number) {
  const newTaskList = tasks.filter((t) => t.id !== taskId);
  const result = window.confirm("Are you sure you want to delete this task?");
  if (result) {
    tasks.length = 0;
    tasks.push(...newTaskList);
    renderTasks();
  } else {
    window.alert("You cancelled the deletion!");
  }
  renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(taskId: number) {
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
function filterTasks(filter: string) {
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
function renderFilteredTasks(filteredTasks: Task[]) {
  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
        <input type="checkbox" class="form-check-input" data-task-id="${
          task.id
        }" ${task.completed ? "checked" : ""}>
        <span class="span-text">${task.text}</span>
      `;
    const checkbox = li.querySelector("input") as HTMLInputElement;
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
    const filter = (event.target as HTMLElement).getAttribute("data-filter");
    if (filter !== null) {
      filterTasks(filter);
    }
  });
});

// Initial rendering
renderTasks();
