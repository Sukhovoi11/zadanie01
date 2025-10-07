const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('counter');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    counter.textContent = `${total} zadań • ${completed} ukończonych`;
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';
        if (task.done) li.classList.add('completed');

        const span = document.createElement('span');
        span.textContent = task.text;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Usuń';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
    updateCounter();
    saveTasks();
}

function addTask(text) {
    const newTask = {
        id: Date.now(),
        text,
        done: false,
        date: new Date().toLocaleString()
    };
    tasks.push(newTask);
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
    );
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.done);
    renderTasks();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
        taskInput.value = '';
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

renderTasks();
