let stati = ['todo', 'progress', 'awaiting', 'done'];




function findTask() {
    let search = document.getElementById('search_input_board');


    console.log(search.value)
    search.value = '';

};


async function initBoard() {
    await loadTasks();
    renderTasksBoard();


    console.log('Test')

};



function renderTasksBoard() {

    for (let i = 0; i < stati.length; i++) {
        const status = stati[i];

        let content = document.getElementById('container_tasks_board_' + status);
        content.innerHTML = '';

        console.log(content)

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
        <div class="single-task">
            <div class="${task['category']} category" class="single-task-category">
                ${task['category'].slice(0,1).toUpperCase()}${task['category'].slice(1)}
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


