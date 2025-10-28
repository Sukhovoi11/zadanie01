// pobieranie elementów
const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clear-completed');
const filters = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

// localStorage
function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// aktualizacja licznika
function updateCounter() {
    const all = tasks.length;
    const done = tasks.filter(t => t.done).length;
    counter.textContent = `${all} zadań • ${done} ukończonych`;
}

// renderowanie listy
function render() {
    list.innerHTML = '';

    let filtered = tasks;
    if (filter === 'active') filtered = tasks.filter(t => !t.done);
    if (filter === 'completed') filtered = tasks.filter(t => t.done);

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';
        if (task.done) li.classList.add('completed');

        const span = document.createElement('span');
        span.textContent = `${task.text} (${task.date})`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggle(task.id));

        const del = document.createElement('button');
        del.textContent = 'Usuń';
        del.addEventListener('click', () => remove(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(del);
        list.appendChild(li);
    });

    updateCounter();
    save();
}

// dodaj nowe zadanie
function addTask(text) {
    const newTask = {
        id: Date.now(),
        text,
        done: false,
        date: new Date().toLocaleString()
    };
    tasks.push(newTask);
    render();
}

// zmiana statusu
function toggle(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    render();
}

// usuń zadanie
function remove(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

// usuń ukończone
function clearCompleted() {
    tasks = tasks.filter(t => !t.done);
    render();
}

// filtrowanie
filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        render();
    });
});

// obsługa formularza
form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        addTask(text);
        input.value = '';
    }
});

clearBtn.addEventListener('click', clearCompleted);

// pierwsze renderowanie
render();
