// ======= STATE =======
let allTasks = [];
let currentFilter = 'ALL';

// ======= DOM ELEMENTS =======
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');

// ======= HELPER FUNCTIONS =======
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function showLoading() { loadingOverlay.style.display = 'flex'; }
function hideLoading() { loadingOverlay.style.display = 'none'; }

// ======= API CALLS =======
async function fetchTasks() {
    showLoading();
    try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        allTasks = data.tasks;
        renderTasks();
    } catch(err) {
        alert('Failed to load tasks');
        console.error(err);
    } finally { hideLoading(); }
}

async function createTask(taskData) {
    showLoading();
    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(taskData)
        });
        const data = await res.json();
        allTasks.unshift(data.task);
        renderTasks();
        addTaskForm.reset();
    } catch(err) { console.error(err); alert('Failed to create task'); }
    finally { hideLoading(); }
}

async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        const res = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        allTasks = allTasks.map(t => t.id === taskId ? data.task : t);
        renderTasks();
    } catch(err) { console.error(err); alert('Failed to update status'); }
    finally { hideLoading(); }
}

async function deleteTask(taskId) {
    if(!confirm('Are you sure you want to delete this task?')) return;
    showLoading();
    try {
        await fetch(`/api/tasks/${taskId}`, { method:'DELETE' });
        allTasks = allTasks.filter(t => t.id !== taskId);
        renderTasks();
    } catch(err) { console.error(err); alert('Failed to delete task'); }
    finally { hideLoading(); }
}

// ======= RENDER =======
function renderTasks() {
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    let filtered = allTasks;
    if(currentFilter !== 'ALL') filtered = filtered.filter(t => t.status === currentFilter);

    const todo = filtered.filter(t => t.status === 'TODO');
    const progress = filtered.filter(t => t.status === 'IN_PROGRESS');
    const done = filtered.filter(t => t.status === 'DONE');

    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;

    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}

function renderTaskList(tasks, container, status) {
    if(tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks yet</p></div>';
        return;
    }
    tasks.forEach(task => container.appendChild(createTaskCard(task, status)));
}

function createTaskCard(task, status) {
    const card = document.createElement('div');
    card.className = 'task-card';
    const priorityClass = `priority-${task.priority.toLowerCase()}`;

    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">Created: ${formatDate(task.created_at)}</div>
        <div class="task-actions">
            ${createStatusButtons(task.id, status)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">🗑️ Delete</button>
        </div>
    `;
    return card;
}

function createStatusButtons(taskId, currentStatus) {
    const buttons = [];
    if(currentStatus !== 'TODO') buttons.push(`<button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">← To Do</button>`);
    if(currentStatus !== 'IN_PROGRESS') buttons.push(`<button class="btn btn-info btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">🔄 In Progress</button>`);
    if(currentStatus !== 'DONE') buttons.push(`<button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">→ Done</button>`);
    return buttons.join(' ');
}

// ======= EVENT LISTENERS =======
addTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    if(!title) return alert('Enter task title');
    createTask({ title, description, priority });
});

statusFilter.addEventListener('change', e => {
    currentFilter = e.target.value;
    renderTasks();
});

// ======= INITIALIZE =======
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});

// Expose globally for inline handlers
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;
