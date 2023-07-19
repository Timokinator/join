let logedInUser = [];
let logedInUserInitials = [];
let tasksInProgress = [];
let tasksAwaitingFeedback = [];
let tasksToDo = [];
let tasksDone = [];
let tasksUrgent = [];
let tasksDates = [];


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
    loadUserData();
};


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadUserData() {
    logedInUser = [];
    logedInUser = JSON.parse(await getItem('user'));
    let currentUser = logedInUser.name;

    let userBox = document.getElementById('summary_username');

    if (currentUser) {
        userBox.innerHTML = capitalizeFirstLetter(currentUser);
    } else {
        userBox.innerHTML = 'Guest';
    }

    // if (currentUser != null) {
    //     getInitials(currentUser);
    // }
};


// function getInitials(currentUser) {
//     const names = currentUser.split(' ');
//     const initials = names.map(name => name.charAt(0).toUpperCase());
//     const newInitials = initials.join(' ');
//     logedInUserInitials.push(newInitials);
//     loadUserInitials();
// }

// async function loadUserInitials() {
//     let box = document.querySelector('.initialsBox');
//     box.innerHTML = '';
    
//     for (let i = 0; i < logedInUserInitials.length; i++) {
//         const element = logedInUserInitials[i];
//         box.innerHTML =  `<span>${element}</span>`;
        
//     }
// }






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
    setInterval(implementCurrentTime, 60000);
}


function implementCurrentTime() {
    let timeBox = document.querySelector('.summary-good-morning');
    let today = new Date();
    let dateHours = today.getHours();

    if (dateHours >= 0 && dateHours < 12) {
        timeBox.innerHTML = 'Good Morning, ';
    }
    if (dateHours >= 12 && dateHours < 18) {
        timeBox.innerHTML = 'Good day, ';
    }
    if (dateHours >= 18 && dateHours <= 24) {
        timeBox.innerHTML = 'Good Evening, ';
    }

}

newUser = [];

async function loadLoagedInUser() {

    let currentUser = logedInUser['name'];
    console.log(logedInUser);
    if (!newUser.includes(currentUser)) {
        newUser.push(currentUser);
    }
    let logedInUser = currentUser[0]['name'];
    console.log(logedInUser);

    let userBox = document.getElementById('summary_username');

    if (logedInUser) {
        userBox.innerHTML = capitalizeFirstLetter(logedInUser);
    } else {
        userBox.innerHTML = 'Guest';
    }


}

// window.addEventListener("offline", (event) => {
//     newUser = [];
// });



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




