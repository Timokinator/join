let loggedInUser = [];
let tasksInProgress = [];
let tasksAwaitingFeedback = [];
let tasksToDo = [];
let tasksDone = [];
let tasksUrgent = [];
let tasksDates = [];


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
    loadTasksUrgent();
    loadTasksDueDates();
    loadTasksToDo();
    loadTasksDone();
    loadTasksGreeteng();
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


function loadTasksUrgent() {
    let content = document.getElementById('container_amount_urgent_number');
    let amountTasks = tasksUrgent.length;
    content.innerHTML = amountTasks
};


function loadTasksDueDates() {
    let content = document.getElementById('deadline_summary_date');
    let dueDate = tasksDates[0];
    content.innerHTML = dueDate;
};

function loadTasksToDo() {
    let content = document.getElementById('summary_todo_text');
    let amountTasks = tasksToDo.length;
    content.innerHTML = amountTasks
};


function loadTasksDone() {
    let content = document.getElementById('summary_done_text');
    let amountTasks = tasksDone.length;
    content.innerHTML = amountTasks
};

function loadTasksGreeteng() {
    implementCurrentTime();
    let  mins = new Date().getMinutes();
    if (mins == "00") {
        implementCurrentTime();
    }
}

setInterval(implementCurrentTime, 1000);

function implementCurrentTime() {
    let timeBox = document.getElementById('summary_username');
let today = new Date();
let dateHours = today.getHours();

if (dateHours < 12) {
    timeBox.innerHTML = 'Good Morning';
}else if (dateHours < 18) {
    timeBox.innerHTML = 'Hallo';
}else if (dateHours < 24) {
    timeBox.innerHTML = 'Good Evening';
}
}



function checkAndSortTasks() {
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

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

        tasksDates.push(task['dueDate']);
        tasksDates.sort();
    };
};




