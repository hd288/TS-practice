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
        <input type="checkbox" class="form-check-input" data-task-id="${task.id}" ${
        task.completed ? "checked" : ""
      }>
        <span class="${spanClass} span-text">${task.text}</span>
      `;
  
      const checkbox = li.querySelector("input") as HTMLInputElement;
      checkbox.addEventListener("change", () => toggleTaskCompletion(task.id));
  
      taskList.appendChild(li);
    });
  
    updateItemCount();
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
document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener("click", (event) => {
    const filter = (event.target as HTMLElement).getAttribute("data-filter");
    if (filter !== null) {
      filterTasks(filter);
    }
  });
});


// Initial rendering
renderTasks();
