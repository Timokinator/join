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
    let search = document.getElementById('search_input_board').value;

    for (let i = 0; i < stati.length; i++) {
        const status = stati[i];
        let content = document.getElementById('container_tasks_board_' + status);
        content.innerHTML = '';

        if (search == '') {
            renderTasksBoardWithoutSearch(content, status);
        } else {
            renderTasksBoardWithSearch(content, status, search);
        }
    };
};


function renderTasksBoardWithSearch(content, status, search) {
    console.log(search)

    for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        if (task['status'] == status) {
            if (task['title'].toLowerCase().includes(search) || task['description'].toLowerCase().includes(search)) {
                content.innerHTML += templateSingleTask(task, j)
                addMemberToSingleTask(task, j);
                addPrioToSingleTask(task, j);
            };
        };
    };
};


function renderTasksBoardWithoutSearch(content, status) {
    for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        if (task['status'] == status) {
            content.innerHTML += templateSingleTask(task, j);
            addMemberToSingleTask(task, j);
            addPrioToSingleTask(task, j);
        };
    };
};


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
    addMemberTaskDetail(j);
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
                <div class="detail-task-member-container" id="detail_task_member"></div>                
            </div>

            <img class="detail-task-close-btn" onclick="closeTaskDetail()" src="../assets/icons/icon_cross_dark.svg" alt="">

            <div class="container-delete-and-edit-task">
                <div class="container-delete-task">
                    <img onclick="deleteTask(${j})" src="../assets/icons/icon_trash_dark.svg" alt="">
                </div>

                <div class="container-edit-task">
                    <img onclick="editTask(${j})" src="../assets/icons/icon_pencil.svg" alt="">
                </div>


            </div>

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


function addMemberTaskDetail(j) {
    let content = document.getElementById('detail_task_member');
    content.innerHTML = '';

    for (let k = 0; k < tasks[j]['assignedTo'].length; k++) {
        const member = tasks[j]['assignedTo'][k];

        content.innerHTML += renderMemberTaskDetail(member);

    }

}

// img muss noch ausgetauscht / gerendert werden wenn contacts fertig sind
function renderMemberTaskDetail(member) {
    return /*html*/`
    <div class="container-initials-and-name-member-task-detail">
        <img class="img-member-task-detail" src="../assets/img/logo_contact.svg" alt=""> 
        <span>${member.slice(0, 1).toUpperCase()}${member.slice(1)}</span>
    </div>


    `;
};


async function deleteTask(j) {
    tasks.splice(j, 1)
    await safeTasks();
    closeTaskDetail();
    initBoard();
};


async function editTask(j) {
    console.log('edit-function follows')
};


function addNewTask() {
    let content = document.getElementById('container_add_new_task_from_button');
    content.innerHTML = '';
    content.classList.remove('d-none');
    addCloseTaskWithEscape();
    content.innerHTML = templateFormAddTaskBoard()


}


function addCloseTaskWithEscape() { //adds the possibility to close the details with the escape-key
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeAddTaskBoard();
        }
    });
};


function closeAddTaskBoard() {
    let content = document.getElementById('container_add_new_task_from_button');
    content.classList.add('d-none');
    resetForm();
};


function resetForm() {
    document.getElementById('form_add_task').reset();
    resetPrioValue();
    resetSubtaskArray();
    resetAssignedTo()
};


function templateFormAddTaskBoard() {
    return /*html*/`
        <div class="container-formular-task-on-board" onclick="doNotClose(event)">
            <span class="title-formular-on-board">Add Task</span>

            <form id="form_add_task" class="form-add-task" onsubmit="return false">

                <div class="left_side_desktop-add-task">

                    <div class="container-input">
                        <span class="form-text-add-task">Title</span>
                        <input class="inputfield-add-task" type="text" required placeholder="Enter a title" name=""
                            id="title_form">
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Description</span>
                        <textarea class="inputfield-add-task" maxlength="200" placeholder="Enter a description" name=""
                            id="description_form"></textarea>
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Category</span>
                        <select class="inputfield-add-task" type="text" required name="" id="category_form">
                            <option value="" disabled selected>Select a category</option>
                            <option class="sales" value="sales">Sales</option>
                            <option class="marketing" value="marketing">Marketing</option>
                            <option class="accounting" value="accounting">Accounting</option>
                            <option class="development" value="development">Development</option>
                            <option class="purchase" value="purchase">Purchase</option>
                        </select>
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Assigned to</span>
                        <select oninput="addMember()" class="inputfield-add-task" type="text" required name=""
                            id="assignedTo_form">
                            <option value="" disabled selected>Select contacts</option>
                            <option value="timo">Timo</option>
                            <option value="filip">Filip</option>
                            <option value="benjamin">Benjamin</option>

                        </select>

                        <div class="" id="click_to_delete_text"></div>

                        <div class="selected-members-add-task" id="selected_members_add_task">

                        </div>


                    </div>
                </div>

                <img class="line-icon-add-task" src="../assets/icons/vertical_line_addTask.svg" alt="">

                <div class="right_side_desktop-add-task">

                    <div class="container-input">
                        <span class="form-text-add-task">Due date</span>
                        <input class="inputfield-add-task" type="date" required placeholder="dd/mm/yyyy" name=""
                            id="dueDate_form">
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Prio</span>

                        <div class="container-prio-btn-add-task">

                            <div id="prio_btn_urgent" class="prio-btn-add-task" onclick="setPrioValue('urgent')">
                                <span class="text-btn-prio-add-task">Urgent</span>
                                <img src="../assets/icons/icon_prio_high.svg" alt="">
                            </div>

                            <div id="prio_btn_medium" class="prio-btn-add-task" onclick="setPrioValue('medium')">
                                <span class="text-btn-prio-add-task">Medium</span>
                                <img src="../assets/icons/icon_prio_medium.svg" alt="">
                            </div>

                            <div id="prio_btn_low" class="prio-btn-add-task" onclick="setPrioValue('low')">
                                <span class="text-btn-prio-add-task">Low</span>
                                <img src="../assets/icons/icon_prio_low.svg" alt="">
                            </div>

                            <input required id="prio_hidden" type="hidden" value="medium">
                        </div>
                    </div>

                    <div class="container-input pos-relative">
                        <span class="form-text-add-task">Subtasks</span>
                        <input class="inputfield-add-task" maxlength="30" type="text" placeholder="Add new subtask"
                            name="" id="input_subtask">
                        <img onclick="addSubtask()" class="btn-plus-add-task" src="../assets/icons/icon_plus_dark.svg"
                            alt="">
                        <div class="container-subtasks" id="container_subtasks">

                        </div>
                    </div>
                </div>

                <div class="btn-container-add-task-on-board">
                    <button onclick="reset(); resetPrioValue(); resetSubtaskArray(); resetAssignedTo()"
                        id="btn_clear_task" type="button" for class="btn-clear">
                        <span>Clear</span>
                        <img src="../assets/icons/icon_cross_dark.svg" alt="">
                    </button>

                    <button onclick="addTask(); closeAddTaskBoardWithButton()" class="btn-create-task">
                        <span>Creat Task</span>
                        <img src="../assets/icons/icon_check_bright.svg" alt="">
                    </button>

                </div>
            </form>
        </div>
        
    </div>   
    `;
};


function closeAddTaskBoardWithButton() {
    let content = document.getElementById('container_add_new_task_from_button');
    content.classList.add('d-none');
};


function searchTaskFromBoard() {
    let search = document.getElementById('search_input_board').value;
    renderTasksBoard();
};

