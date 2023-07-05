let stati = ['todo', 'progress', 'awaiting', 'done'];




function findTask() {
    let search = document.getElementById('search_input_board');


    console.log(search.value)
    search.value = '';

};


async function initBoard() {
    await loadTasks();
    renderTasksBoard();

};



function renderTasksBoard() {

    for (let i = 0; i < stati.length; i++) {
        const status = stati[i];

        let content = document.getElementById('container_tasks_board_' + status);
        content.innerHTML = '';

        for (let j = 0; j < tasks.length; j++) {
            const task = tasks[j];

            if (task['status'] == status) {

                content.innerHTML += templateSingleTask(task, j)

                addMemberToSingleTask(task, j);
                addPrioToSingleTask(task, j);

            }


        }

    }

}

function templateSingleTask(task, j) {
    return /*html*/`
        <div class="single-task" onclick="openTask(${j})">
            <div class="${task['category']} category">
                ${task['category'].slice(0, 1).toUpperCase()}${task['category'].slice(1)}
            </div>

            <div class="single-task-title">
                ${task['title']}
            </div>

            <div class="single-task-description">
                ${task['description']}
            </div>

            <div class="single-task-subtasks">
                <span>Subtasks: </span>${task['subtasks'].length}
            </div>

            <div class="container-member-prio">
                <div class="single-task-member" id="single_task_member${j}"></div>
                <div class="single-task-prio" id="single-task-prio${j}"></div>
            </div>
        </div>
    `;
};

function addMemberToSingleTask(task, j) {
    let content = document.getElementById('single_task_member' + j)
    content.innerHTML = '';

    for (let k = 0; k < task['assignedTo'].length; k++) {
        const member = task['assignedTo'][k];

        content.innerHTML += /*html*/`
            <div class="single-task-member-member">
                ${task['assignedTo'][k].slice(0, 1).toUpperCase()}${task['assignedTo'][k].slice(1)}
            </div>
        `;
    };
};



function addPrioToSingleTask(task, j) {
    let content = document.getElementById('single-task-prio' + j);

    content.innerHTML = '';

    if (task['prio'] == 'urgent') {
        content.innerHTML += /*html*/`
            <img src="../assets/icons/icon_prio_high.svg" alt="">
        `;
    } else if (task['prio'] == 'medium') {
        content.innerHTML += /*html*/`
            <img src="../assets/icons/icon_prio_medium.svg" alt="">
        `;
    } else if (task['prio'] == 'low') {
        content.innerHTML += /*html*/`
            <img src="../assets/icons/icon_prio_low.svg" alt="">
        `;
    };
};


function openTask(j) {
    closeTaskDetail();
    addCloseWithEscape();
    const content = document.getElementById('container_single_task_details');
    content.innerHTML = '';
    content.classList.remove('d-none');
    content.innerHTML = templateDetailsTask(j);
    addPrioToDetailTask(j);

};


function closeTaskDetail() {
    const content = document.getElementById('container_single_task_details');
    content.innerHTML = '';
    content.classList.add('d-none');
};

function addCloseWithEscape() { //adds the possibility to close the details with the escape-key
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeTaskDetail();
        }
    });
};


function doNotClose(event) {
    event.stopPropagation();
};


function templateDetailsTask(j) {
    return /*html*/`
        <div onclick="doNotClose(event)" class="container-single-task">
            <div class="${tasks[j]['category']} category detail-task-category">
                ${tasks[j]['category'].slice(0, 1).toUpperCase()}${tasks[j]['category'].slice(1)}
            </div>

            <div class="detail-task-title">
                ${tasks[j]['title']}
            </div>

            <div class="detail-task-description">
                ${tasks[j]['description']}
            </div>

            <div class="detail-task-date">
                <span>Due Date:</span>
                ${tasks[j]['dueDate']}
            </div>

            <div class="detail-task-prio">
                <span>Priority:</span>
                <div id="detail_task_prio_img"></div>
            </div>

            <div class="detail-task-member">
                <span>Assigned to:</span>
                <div id="detail_task_member"></div>                
            </div>

            <img class="detail-task-close-btn" onclick="closeTaskDetail()" src="../assets/icons/icon_cross_dark.svg" alt="">


        </div>
    `;
};


function addPrioToDetailTask(j) {
    let content = document.getElementById('detail_task_prio_img');
    content.innerHTML = '';
    if (tasks[j]['prio'] == 'urgent') {
        content.innerHTML += /*html*/`
            <div class="border-urgent">
                <span>${tasks[j]['prio'].slice(0, 1).toUpperCase()}${tasks[j]['prio'].slice(1)}</span>
                <img src="../assets/icons/icon_prio_high.svg" alt="">
            </div>
        `;
    } else if (tasks[j]['prio'] == 'medium') {
        content.innerHTML += /*html*/`
            <div class="border-medium">
                <span>${tasks[j]['prio'].slice(0, 1).toUpperCase()}${tasks[j]['prio'].slice(1)}</span>         
                <img class="test" src="../assets/icons/icon_prio_medium.svg" alt="">
            </div>  
        `;
    } else if (tasks[j]['prio'] == 'low') {
        content.innerHTML += /*html*/`
            <div class="border-low">
                <span>${tasks[j]['prio'].slice(0, 1).toUpperCase()}${tasks[j]['prio'].slice(1)}</span>
                <img src="../assets/icons/icon_prio_low.svg" alt="">
            </div>
        `;
    };
};


