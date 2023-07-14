let stati = ['todo', 'progress', 'awaiting', 'done'];
let currentDraggedElement;



function findTask() {
    let search = document.getElementById('search_input_board');


    console.log(search.value)
    search.value = '';

};


async function initBoard() {
    await loadTasks();
    renderTasksBoard();
    await loadContacts();
    pushColorToArrayAssignedTo();
    pushMemberToArrayAssignedTo();
    pushMemberToArrayAssignedTo();
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
        <div draggable="true" class="single-task" onclick="openTask(${j})" ondragstart="startDragging(${j})">
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
            <div style="background-color: ${task['colors'][k]}" class="single-task-member-member">${task['initials'][k]}</div>
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
    addCloseWithEscape();
    const containerSlideOut = document.getElementById('container_single_task_details')
    containerSlideOut.classList.remove('slide-out')
    const content = document.getElementById('container_single_task_details');
    content.innerHTML = '';
    content.classList.remove('d-none');
    content.classList.add('slide-in');
    content.innerHTML = templateDetailsTask(j);
    addPrioToDetailTask(j);
    addMemberTaskDetail(j);
};


function closeTaskDetail() {
    slideOutTask();
    setTimeout(function () { clearHtmlSingleTask() }, 400);
};


function clearHtmlSingleTask() {
    const content = document.getElementById('container_single_task_details');
    content.classList.add('d-none');
    content.innerHTML = '';
};


function slideOutTask() {
    const containerSlideOut = document.getElementById('container_single_task_details')
    containerSlideOut.classList.add('slide-out');
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
            <div class="container-container-delete-and-edit-task">
                <div class="container-delete-and-edit-task">
                    <div class="container-delete-task">
                        <img onclick="deleteTask(${j})" src="../assets/icons/icon_trash_dark.svg" alt="">
                    </div>

                    <div class="container-edit-task">
                        <img onclick="editTask(${j})" src="../assets/icons/icon_pencil.svg" alt="">
                    </div>


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

        content.innerHTML += renderMemberTaskDetail(member, k, j);

    }

};


function renderMemberTaskDetail(member, k, j) {
    return /*html*/`
    <div class="container-initials-and-name-member-task-detail">
        <div style="background-color: ${tasks[j]['colors'][k]}" class="font-size-16 single-task-member-member">${tasks[j]['initials'][k]}</div> 
        <span class="font-weight-400">${member.slice(0, 1).toUpperCase()}${member.slice(1)}</span>
    </div>
    `;
};


async function deleteTask(j) {
    tasks.splice(j, 1)
    await safeTasks();
    closeTaskDetail();
    initBoard();
};


function addNewTask() {
    let content = document.getElementById('container_add_new_task_from_button');
    content.innerHTML = '';
    content.classList.remove('d-none');
    addCloseTaskWithEscape();
    content.innerHTML = templateFormAddTaskBoard()
    loadContactsToForm();
};


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

                    <button onclick="addTaskAndCloseForm()" class="btn-create-task">
                        <span>Create Task</span>
                        <img src="../assets/icons/icon_check_bright.svg" alt="">
                    </button>

                </div>
            </form>
        </div>
        
    </div>   
    `;
};


function addTaskAndCloseForm() {
    addTask();
    // setTimeout(function () { location.reload() }, 200);
};


function searchTaskFromBoard() {
    let search = document.getElementById('search_input_board').value;
    renderTasksBoard();
};


function loadContactsToForm() {
    let content = document.getElementById('assignedTo_form');
    content.innerHTML = /*html*/`
     <option value="" disabled selected>Select contacts</option>   
    `;

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        content.innerHTML += templateMembersChose(contact);
    };
};


function templateMembersChose(contact) {
    return /*html*/`
        <option value="${contact['name']}">${contact['name']}</option>
    `;
};


function startDragging(j) {
    currentDraggedElement = j;    
};


function allowDrop(ev) {
    ev.preventDefault();
};


function moveTaskTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    safeTasks();
    document.getElementById('container_tasks_board_' + status).classList.remove('highlight');
    renderTasksBoard();
};


function highlight(status) {
    let container = document.getElementById('container_tasks_board_' + status);
    container.classList.add('highlight');
};


function unsetHighlight(status) {
    let container = document.getElementById('container_tasks_board_' + status);
    container.classList.remove('highlight');
};


function closeEditTask() {
    let content = document.getElementById('container_background_edit_task');
    content.classList.add('d-none');
};


async function editTask(j) {
    closeTaskDetail();
    await loadTasks();
    editTaskAddCloseWithEscape();
    let content = document.getElementById('container_background_edit_task');
    content.classList.remove('d-none');
    content.innerHTML = '';
    content.innerHTML = templateEditTask(j);
    loadContactsToForm();
    renderMemberEditTask(j);
    setPrioEditTask(j);
    loadSubtasksEditTask(j);
    //load subtasks

};


function loadSubtasksEditTask(j) {
    let content = document.getElementById('container_subtasks');
    content.innerHTML = '';

    for (let i = 0; i < tasks[j]['subtasks'].length; i++) {
        const subtask = tasks[j]['subtasks'][i];
        content.innerHTML += templateSubtasksEditTask(j, i);
    };
};


function templateSubtasksEditTask(j, i) {
    return /*html*/`
    <div class="text-subtask">
    ${tasks[j]['subtasks'][i]}
    <img onclick="deleteSubtaskEditTask(${j},${i})" class="hover" id="delete_btn_subtasks${i}" src="../assets/icons/trash.png" alt="">
</div>
`;
};


function deleteSubtaskEditTask(j, i) {
    tasks[j]['subtasks'].splice(i, 1);
    loadSubtasksEditTask(j);
};


function addSubtaskEditTask(j) {
    let subtask = document.getElementById('input_subtask');
    tasks[j]['subtasks'].push(subtask.value);
    subtask.value = '';
    renderSubtasksEditTask(j);
};


function renderSubtasksEditTask(j) {
    let content = document.getElementById('container_subtasks');
    content.innerHTML = '';

    for (let i = 0; i < tasks[j]['subtasks'].length; i++) {
        const subtask = tasks[j]['subtasks'][i];
        content.innerHTML += templateSubtasksEditTask(j, i);
    };
};


function setPrioEditTask(j) {
    let selectedPrio = tasks[j]['prio'];
    let prioToselect = document.getElementById('prio_btn_'+selectedPrio);
    prioToselect.classList.add('prio-selected');
};


function renderMemberEditTask(j) {
    let content = document.getElementById('selected_members_add_task');
    let deleteArea = document.getElementById('click_to_delete_text');
    content.innerHTML = '';

    if (tasks[j]['assignedTo'].length > 0) {
        deleteArea.innerHTML = /*html*/`
            <span>Click to delete</span>
        `;
    } else {
        deleteArea.innerHTML = '';
    };

    for (let i = 0; i < tasks[j]['assignedTo'].length; i++) {
        const member = tasks[j]['assignedTo'][i];
        content.innerHTML += templateMembersEditTask(i, j);
    };
};


function templateMembersEditTask(i, j) {
    return /*html*/`
      <div style="background-color: ${tasks[j]['colors'][i]}" onclick=deleteMemberEditTask(${i},${j}) class="member-add-task">
        <span>${tasks[j]['initials'][i]}</span>
      </div>
    `;
};


function deleteMemberEditTask(i, j) {
    tasks[j]['assignedTo'].splice(i, 1);
    tasks[j]['colors'].splice(i, 1);
    tasks[j]['initials'].splice(i, 1);
    
    renderMemberEditTask(j);
    document.getElementById('assignedTo_form').value = '';
};


function addMemberEditTask(j) {
    let member = document.getElementById('assignedTo_form')
    for (let i = 0; i < tasks[j]['assignedTo'].length; i++) {
        const assignedMember = memberAssignedTo[i];
        
        if (tasks[j]['assignedTo'].indexOf(member.value) == -1) {
            tasks[j]['assignedTo'].push(member.value);
            tasks[j]['initials'].push(initials[memberAssignedTo.indexOf(member.value)]);
            tasks[j]['colors'].push(colorsAssignedTo[memberAssignedTo.indexOf(member.value)]);
        };
    };
    renderMemberEditTask(j);
};


function editTaskAddCloseWithEscape() { //adds the possibility to close the edit task with the escape-key
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeEditTask();
        };
    });
};


function templateEditTask(j) {
    return /*html*/`
      <div class="container-formular-task-on-board" onclick="doNotClose(event)">
            <span class="title-formular-on-board">Edit Task</span>

            <form id="form_add_task" class="form-add-task" onsubmit="return false">

                <div class="left_side_desktop-add-task">

                    <div class="container-input">
                        <span class="form-text-add-task">Title</span>
                        <input value="${tasks[j]['title']}" class="inputfield-add-task" type="text" required placeholder="Enter a title" name=""
                            id="title_form">
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Description</span>
                        <textarea class="inputfield-add-task" maxlength="200" placeholder="Enter a description" name=""
                            id="description_form">${tasks[j]['description']}</textarea>
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Category</span>
                        <select class="inputfield-add-task" type="text" required name="" id="category_form">
                            <option value="${tasks[j]['category']}"disabled selected>${tasks[j]['category'].slice(0, 1).toUpperCase()}${tasks[j]['category'].slice(1)}</option>
                            <option class="sales" value="sales">Sales</option>
                            <option class="marketing" value="marketing">Marketing</option>
                            <option class="accounting" value="accounting">Accounting</option>
                            <option class="development" value="development">Development</option>
                            <option class="purchase" value="purchase">Purchase</option>
                        </select>
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Assigned to</span>
                        <select oninput="addMemberEditTask(${j})" class="inputfield-add-task" type="text" name=""
                            id="assignedTo_form">
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
                        <input value="${tasks[j]['dueDate']}" class="inputfield-add-task" type="date" required placeholder="dd/mm/yyyy" name=""
                            id="dueDate_form">
                    </div>

                    <div class="container-input">
                        <span class="form-text-add-task">Prio</span>

                        <div class="container-prio-btn-add-task">

                            <div id="prio_btn_urgent" class="prio-btn-add-task" onclick="setPrioValueEditTask(${j},'urgent')">
                                <span class="text-btn-prio-add-task">Urgent</span>
                                <img src="../assets/icons/icon_prio_high.svg" alt="">
                            </div>

                            <div id="prio_btn_medium" class="prio-btn-add-task" onclick="setPrioValueEditTask(${j},'medium')">
                                <span class="text-btn-prio-add-task">Medium</span>
                                <img src="../assets/icons/icon_prio_medium.svg" alt="">
                            </div>

                            <div id="prio_btn_low" class="prio-btn-add-task" onclick="setPrioValueEditTask(${j},'low')">
                                <span class="text-btn-prio-add-task">Low</span>
                                <img src="../assets/icons/icon_prio_low.svg" alt="">
                            </div>

                            <!-- not needed: <input required id="prio_hidden" type="hidden" value="medium"> -->
                        </div>
                    </div>

                    <div class="container-input pos-relative">
                        <span class="form-text-add-task">Subtasks</span>
                        <input class="inputfield-add-task" maxlength="30" type="text" placeholder="Add new subtask"
                            name="" id="input_subtask">
                        <img onclick="addSubtaskEditTask(${j})" class="btn-plus-add-task" src="../assets/icons/icon_plus_dark.svg"
                            alt="">
                        <div class="container-subtasks" id="container_subtasks">

                        </div>
                    </div>
                </div>

                <div class="btn-container-add-task-on-board">
                    <button onclick="editTask(${j})"
                        id="btn_clear_task" type="button" for class="btn-clear">
                        <span>Reset</span>
                        <img src="../assets/icons/icon_cross_dark.svg" alt="">
                    </button>

                    <button onclick="safeChangesEditTask(${j})" class="btn-create-task">
                        <span>Safe Changes</span>
                        <img src="../assets/icons/icon_check_bright.svg" alt="">
                    </button>

                </div>
            </form>
        </div>
        
    </div>
    `;
};


function setPrioValueEditTask(j, prio) {
    tasks[j]['prio'] = prio;
    let selectedButton = document.getElementById('prio_btn_' + prio);
    resetPrioValue();
    selectedButton.classList.add('prio-selected');
};


async function safeChangesEditTask(j) {
    let category = document.getElementById('category_form');
    let description = document.getElementById('description_form');
    let dueDate = document.getElementById('dueDate_form');
    let title = document.getElementById('title_form');
    
    tasks[j]['category'] = category.value;
    tasks[j]['description'] = description.value;
    tasks[j]['dueDate'] = dueDate.value;
    tasks[j]['title'] = title.value;

    await safeTasks();

    closeEditTask();
    initBoard();
};