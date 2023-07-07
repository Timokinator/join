let loggedInUser = [];
let tasksInProgress = [];
let tasksAwaitingFeedback = [];
let tasksToDo = [];
let tasksDone = [];
let tasksUrgent = [];


async function loadUserData() {
    loggedInUser = JSON.parse(await getItem('users'));
    console.log(loggedInUser);
};


function linkToBoardHTML() {
    window.location.href = '../html/board.html'
};

async function initSummary() {
    await loadTasks();
    loadTasksInBoard();
    checkAndSortTasks();
    loadTasksInProgress();
    loadTasksAwaitingFeedback();
};


function loadTasksInBoard() {
    let content = document.getElementById('tasks_in_board');
    let amountTasks = tasks.length;
    content.innerHTML = amountTasks;
};


function loadTasksInProgress() {
    let content = document.getElementById('tasks_in_progress');
    let amountTasks = tasksInProgress.length;
    content.innerHTML = amountTasks;
};


function loadTasksAwaitingFeedback() {
    let content = document.getElementById('awaiting_tasks');
    let amountTasks = tasksAwaitingFeedback.length;
    content.innerHTML = amountTasks;
};


function checkAndSortTasks() {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (task['status'] == 'progress') {
            tasksInProgress.push(task);
        } else if (task['status'] == 'awaiting') {
            tasksAwaitingFeedback.push(task);
        } else if (task['status'] == 'todo') {
            tasksToDo.push(task);
        } else if (task['status'] == 'done') {
            tasksDone.push(task);
        };

        if (task['prio'] == 'urgent') {
            tasksUrgent.push(task);
        };
    };
};




