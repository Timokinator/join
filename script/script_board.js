/**
 * An array containing different task statuses: todo, progress, awaiting, done.
 * @type {string[]}
 */
let stati = ['todo', 'progress', 'awaiting', 'done'];

/**
 * The currently dragged element.
 */
let currentDraggedElement;

/**
 * Initializes the board asynchronously.
 * Loads tasks from storage, renders tasks on the board, and loads contacts.
 * Pushes colors and member names to the assignedTo array.
 * @returns {Promise<void>}
 */
async function initBoard() {
    await loadTasks(); // Load tasks from storage.
    renderTasksBoard(); // Render tasks on the board.
    await loadContacts(); // Load contacts from storage.
    pushColorToArrayAssignedTo(); // Push colors to the assignedTo array.
    pushMemberToArrayAssignedTo(); // Push member names to the assignedTo array.
    loadUserData();
};

/**
 * Renders tasks on the board based on the search query and task status.
 */
function renderTasksBoard() {
    // Get the value of the search input field.
    let search = document.getElementById('search_input_board').value;

    // Loop through all task statuses (defined in the 'stati' array).
    for (let i = 0; i < stati.length; i++) {
        const status = stati[i]; // Get the current task status.

        // Get the container element for the current status on the board.
        let content = document.getElementById('container_tasks_board_' + status);
        content.innerHTML = ''; // Clear the container's content.

        // Check if there is no search query entered by the user.
        if (search == '') {
            // If there's no search query, render tasks without filtering.
            renderTasksBoardWithoutSearch(content, status);
        } else {
            // If there's a search query, render tasks with filtering based on the query.
            renderTasksBoardWithSearch(content, status, search);
        }
    };
};

/**
 * Renders tasks on the board based on the provided search query and status.
 * @param {Element} content - The container element to render the tasks in.
 * @param {string} status - The status of the tasks to display (e.g., 'todo', 'progress', etc.).
 * @param {string} search - The search query used to filter the tasks based on title or description.
 */
function renderTasksBoardWithSearch(content, status, search) {
    for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];
        if (task['status'] == status) {
            // Check if the current task's title or description includes the search query (case-insensitive).
            if (task['title'].toLowerCase().includes(search) || task['description'].toLowerCase().includes(search)) {
                // If the search query matches, render the single task.
                content.innerHTML += templateSingleTask(task, j);

                // Add the member assigned to the task and their initials.
                addMemberToSingleTask(task, j);

                // Add the priority (prio) indicator to the single task.
                addPrioToSingleTask(task, j);
            };
        };
    };
};

/**
 * Renders all tasks belonging to a specific status on the board without any search filtering.
 * @param {Element} content - The container element for the current status on the board.
 * @param {string} status - The task status to be rendered.
 */
function renderTasksBoardWithoutSearch(content, status) {
    // Loop through all tasks.
    for (let j = 0; j < tasks.length; j++) {
        const task = tasks[j];

        // Check if the task belongs to the specified status.
        if (task['status'] == status) {
            // If the task belongs to the status, render the task on the board.
            content.innerHTML += templateSingleTask(task, j);
            addMemberToSingleTask(task, j);
            addPrioToSingleTask(task, j);
        };
    };
};

/**
 * Generates the HTML template for rendering a single task on the board.
 * @param {Object} task - The task object containing task information.
 * @param {number} j - The index of the task in the tasks array.
 * @returns {string} The HTML template for the single task.
 */
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

            <div onclick="doNotClose(event)" class="change-status-mobile">
                <span>Change status</span>
                <img onclick="changeStatusClick(${j},'up')" class="img-btn-status-up" src="../assets/icons/icon_arrow_down.png" alt="">
                <img onclick="changeStatusClick(${j},'down')" class="img-btn-status-down" src="../assets/icons/icon_arrow_down.png" alt="">
            </div>
        </div>
    `;
};


/**
 * Asynchronously changes the status of a task and updates the board.
 *
 * @param {number} j - The index of the task in the tasks array.
 * @param {string} direction - The direction of status change ('up' or 'down').
 * @returns {Promise<void>} A Promise that resolves after the task status has been updated and the board is reinitialized.
 */
async function changeStatusClick(j, direction) {
    let oldStatus = tasks[j]['status'];
    let newStatus;

    if (oldStatus == 'todo') {
        if (direction == 'up') {
            newStatus = 'todo';
        } else {
            newStatus = 'progress';
        }
    } else if (oldStatus == 'progress') {
        if (direction == 'up') {
            newStatus = 'todo';
        } else {
            newStatus = 'awaiting';
        }
    } else if (oldStatus == 'awaiting') {
        if (direction == 'up') {
            newStatus = 'progress';
        } else {
            newStatus = 'done';
        }
    } else if (oldStatus == 'done') {
        if (direction == 'up') {
            newStatus = 'awaiting';
        } else {
            newStatus = 'done'
        }
    }

    tasks[j]['status'] = newStatus;
    await safeTasks(); // Save the updated tasks to storage.
    initBoard(); // Reinitialize the board to reflect the changes.
};


/**
 * Adds member information to a single task on the board.
 *
 * @param {object} task - The task object to which members will be added.
 * @param {number} j - The index of the task in the tasks array.
 */
function addMemberToSingleTask(task, j) {
    let content = document.getElementById('single_task_member' + j);
    content.innerHTML = '';

    // Loop through all assigned members for the task.
    for (let k = 0; k < task['assignedTo'].length; k++) {
        const member = task['assignedTo'][k];

        // Add a member element with their initials and background color to the task.
        content.innerHTML += /*html*/`
            <div style="background-color: ${task['colors'][k]}" class="single-task-member-member">${task['initials'][k]}</div>
        `;
    };
};


/**
 * Adds priority information to a single task on the board.
 *
 * @param {object} task - The task object to which priority will be added.
 * @param {number} j - The index of the task in the tasks array.
 */
function addPrioToSingleTask(task, j) {
    let content = document.getElementById('single-task-prio' + j);
    content.innerHTML = '';

    // Check the priority of the task and add the corresponding icon.
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



/**
 * Opens the task details view with the given task index (j).
 * Adds the ability to close the details view using the escape key.
 *
 * @param {number} j - The index of the task in the tasks array.
 */
function openTask(j) {
    addCloseWithEscape();
    const containerSlideOut = document.getElementById('container_single_task_details');
    containerSlideOut.classList.remove('slide-out');
    const content = document.getElementById('container_single_task_details');
    content.innerHTML = '';
    content.classList.remove('d-none');
    content.classList.add('slide-in');
    content.innerHTML = templateDetailsTask(j);
    addPrioToDetailTask(j);
    addMemberTaskDetail(j);
};

/**
 * Closes the task details view.
 * Invokes slideOutTask() to animate the slide-out effect and clears the task details content after 400ms.
 */
function closeTaskDetail() {
    slideOutTask();
    setTimeout(function () { clearHtmlSingleTask() }, 400);
};

/**
 * Clears the content and hides the task details view.
 */
function clearHtmlSingleTask() {
    const content = document.getElementById('container_single_task_details');
    content.classList.add('d-none');
    content.innerHTML = '';
};

/**
 * Animates the slide-out effect for the task details view.
 */
function slideOutTask() {
    const containerSlideOut = document.getElementById('container_single_task_details');
    containerSlideOut.classList.add('slide-out');
};

/**
 * Adds the ability to close the task details view using the escape key.
 */
function addCloseWithEscape() {
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeTaskDetail();
        }
    });
};

/**
 * Prevents the task details view from closing when clicking inside it.
 * @param {Event} event - The click event object.
 */
function doNotClose(event) {
    event.stopPropagation();
};

/**
 * Generates the HTML template for rendering the task details view.
 *
 * @param {number} j - The index of the task in the tasks array.
 * @returns {string} The HTML template for the task details view.
 */
function templateDetailsTask(j) {
    return /*html*/`
        <!-- HTML template for task details view -->
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

/**
 * Adds the priority (prio) indicator to the task details view for the specified task.
 *
 * @param {number} j - The index of the task in the tasks array.
 */
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

/**
 * Adds the member(s) assigned to the task in the task details view.
 *
 * @param {number} j - The index of the task in the tasks array.
 */
function addMemberTaskDetail(j) {
    let content = document.getElementById('detail_task_member');
    content.innerHTML = '';

    for (let k = 0; k < tasks[j]['assignedTo'].length; k++) {
        const member = tasks[j]['assignedTo'][k];

        content.innerHTML += renderMemberTaskDetail(member, k, j);
    };
};

/**
 * Renders a single member assigned to the task in the task details view.
 *
 * @param {string} member - The name of the member.
 * @param {number} k - The index of the member in the assignedTo array of the task.
 * @param {number} j - The index of the task in the tasks array.
 * @returns {string} The HTML template for the single member in the task details view.
 */
function renderMemberTaskDetail(member, k, j) {
    return /*html*/`
    <div class="container-initials-and-name-member-task-detail">
        <div style="background-color: ${tasks[j]['colors'][k]}" class="font-size-16 single-task-member-member">${tasks[j]['initials'][k]}</div> 
        <span class="font-weight-400">${member.slice(0, 1).toUpperCase()}${member.slice(1)}</span>
    </div>
    `;
};

/**
 * Deletes the task at the specified index (j).
 * Saves the updated tasks array to the local storage, closes the task details view, and reinitializes the board.
 *
 * @param {number} j - The index of the task in the tasks array.
 */
async function deleteTask(j) {
    tasks.splice(j, 1);
    await safeTasks(); // Save the updated tasks array to the local storage.
    closeTaskDetail(); // Close the task details view.
    initBoard(); // Reinitialize the board.
};

/**
 * Displays the form to add a new task on the board.
 * Adds the ability to close the form using the escape key.
 *
 * @param {string[]} stati - An array containing different task statuses: todo, progress, awaiting, done.
 */
function addNewTask(stati) {
    let content = document.getElementById('container_add_new_task_from_button');
    content.innerHTML = '';
    content.classList.remove('d-none');
    addCloseTaskWithEscape();
    content.innerHTML = templateFormAddTaskBoard(stati);
    loadContactsToForm();
};

/**
 * Adds the ability to close the task form using the escape key.
 */
function addCloseTaskWithEscape() {
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeAddTaskBoard();
        }
    });
};


/**
 * Closes the form to add a new task on the board.
 * Hides the form and resets its content.
 */
function closeAddTaskBoard() {
    let content = document.getElementById('container_add_new_task_from_button');
    content.classList.add('d-none');
    resetForm();
};

/**
 * Resets the add task form by clearing the input fields, resetting priority value,
 * subtask array, and assignedTo field.
 */
function resetForm() {
    document.getElementById('form_add_task').reset();
    resetPrioValue();
    resetSubtaskArray();
    resetAssignedTo();
};

/**
 * Generates the HTML template for the form to add a new task on the board.
 * @param {string[]} stati - An array containing different task statuses: todo, progress, awaiting, done.
 * @returns {string} The HTML template for the add task form.
 */
function templateFormAddTaskBoard(stati) {
    return /*html*/`
        <!-- HTML template for the add task form -->
        <div class="container-formular-task-on-board" onclick="doNotClose(event)">

<img onclick="closeAddTaskBoard()" src="../assets/icons/icon_cross_dark.svg" alt class="detail-task-close-btn">

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

        <button onclick="addTaskAndCloseForm('${stati}')" class="btn-create-task">
            <span>Create Task</span>
            <img src="../assets/icons/icon_check_bright.svg" alt="">
        </button>

    </div>
</form>
</div>

</div>   
    `;
};

/**
 * Adds a new task to the board and closes the add task form.
 * Initializes the board after adding the task if the current page is the board.
 * @param {string} status - The status of the task to be added.
 */
async function addTaskAndCloseForm(status) {
    await addTask(status);
    if (window.location['pathname'].includes('board') == true) {
        initBoard();
    };
    setTimeout(function () { closeAddTaskBoard() }, 200);
};

/**
 * Searches for tasks on the board based on the search query and task status.
 */
function searchTaskFromBoard() {
    let search = document.getElementById('search_input_board').value;
    renderTasksBoard();
};

/**
 * Loads contacts into the add task form's "Assigned to" dropdown.
 */
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

/**
 * Generates the HTML template for a single contact option in the "Assigned to" dropdown.
 * @param {Object} contact - The contact object containing contact information (e.g., name).
 * @returns {string} The HTML template for a single contact option in the dropdown.
 */
function templateMembersChose(contact) {
    return /*html*/`
    <option value="${contact['name']}">${contact['name']}</option>
`;
};

/**
 * Sets the currently dragged element's index to 'j'.
 * @param {number} j - The index of the currently dragged task in the tasks array.
 */
function startDragging(j) {
    currentDraggedElement = j;
};

/**
 * Allows dropping elements during drag and drop operations.
 * @param {Event} ev - The drag event object.
 */
function allowDrop(ev) {
    ev.preventDefault();
};

/**
 * Moves the currently dragged task to the specified status and saves the updated tasks array.
 * @param {string} status - The status to which the task will be moved.
 */
function moveTaskTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    safeTasks(); // Save the updated tasks array to local storage.
    document.getElementById('container_tasks_board_' + status).classList.remove('highlight');
    renderTasksBoard();
};

/**
 * Highlights the container for the specified status to indicate the potential drop target during drag and drop.
 * @param {string} status - The status for which the container should be highlighted.
 */
function highlight(status) {
    let container = document.getElementById('container_tasks_board_' + status);
    container.classList.add('highlight');
};

/**
 * Removes the highlight from the container for the specified status after the drag and drop operation.
 * @param {string} status - The status for which the container should have the highlight removed.
 */
function unsetHighlight(status) {
    let container = document.getElementById('container_tasks_board_' + status);
    container.classList.remove('highlight');
};

/**
 * Closes the edit task form.
 */
function closeEditTask() {
    let content = document.getElementById('container_background_edit_task');
    content.classList.add('d-none');
};

/**
 * Edits the task with the specified index (j) and opens the edit task form.
 * Closes the task details view before opening the edit task form.
 * @param {number} j - The index of the task in the tasks array to be edited.
 */
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
};


/**
 * Loads subtasks for the task with index 'j' into the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
function loadSubtasksEditTask(j) {
    let content = document.getElementById('container_subtasks');
    content.innerHTML = '';

    for (let i = 0; i < tasks[j]['subtasks'].length; i++) {
        const subtask = tasks[j]['subtasks'][i];
        content.innerHTML += templateSubtasksEditTask(j, i);
    };
};

/**
 * Generates the HTML template for a single subtask in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 * @param {number} i - The index of the subtask in the subtasks array.
 * @returns {string} The HTML template for a single subtask in the edit task form.
 */
function templateSubtasksEditTask(j, i) {
    return /*html*/`
        <div class="text-subtask">
            ${tasks[j]['subtasks'][i]}
            <img onclick="deleteSubtaskEditTask(${j}, ${i})" class="hover" id="delete_btn_subtasks${i}" src="../assets/icons/trash.png" alt="">
        </div>
    `;
};

/**
 * Deletes the subtask at index 'i' from the task with index 'j' and reloads the subtasks in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 * @param {number} i - The index of the subtask to be deleted in the subtasks array.
 */
function deleteSubtaskEditTask(j, i) {
    tasks[j]['subtasks'].splice(i, 1);
    loadSubtasksEditTask(j);
};

/**
 * Adds a new subtask to the task with index 'j' and updates the subtask container in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
function addSubtaskEditTask(j) {
    let subtask = document.getElementById('input_subtask');
    tasks[j]['subtasks'].push(subtask.value);
    subtask.value = '';
    renderSubtasksEditTask(j);
};

/**
 * Renders the subtasks of the task with index 'j' in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
function renderSubtasksEditTask(j) {
    let content = document.getElementById('container_subtasks');
    content.innerHTML = '';

    for (let i = 0; i < tasks[j]['subtasks'].length; i++) {
        const subtask = tasks[j]['subtasks'][i];
        content.innerHTML += templateSubtasksEditTask(j, i);
    };
};

/**
 * Sets the priority button for the task with index 'j' as selected in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
function setPrioEditTask(j) {
    let selectedPrio = tasks[j]['prio'];
    let prioToSelect = document.getElementById('prio_btn_' + selectedPrio);
    prioToSelect.classList.add('prio-selected');
};

/**
 * Renders the selected members for the task with index 'j' in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
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

/**
 * Generates the HTML template for a single selected member in the edit task form.
 * @param {number} i - The index of the member in the assignedTo array.
 * @param {number} j - The index of the task in the tasks array.
 * @returns {string} The HTML template for a single selected member in the edit task form.
 */
function templateMembersEditTask(i, j) {
    return /*html*/`
        <div style="background-color: ${tasks[j]['colors'][i]}" onclick=deleteMemberEditTask(${i}, ${j}) class="member-add-task">
            <span>${tasks[j]['initials'][i]}</span>
        </div>
    `;
};

/**
 * Deletes the selected member at index 'i' from the task with index 'j'
 * and reloads the selected members in the edit task form.
 * @param {number} i - The index of the member in the assignedTo array to be deleted.
 * @param {number} j - The index of the task in the tasks array.
 */
function deleteMemberEditTask(i, j) {
    tasks[j]['assignedTo'].splice(i, 1);
    tasks[j]['colors'].splice(i, 1);
    tasks[j]['initials'].splice(i, 1);

    renderMemberEditTask(j);
    document.getElementById('assignedTo_form').value = '';
};

/**
 * Adds the selected member to the task with index 'j' in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
function addMemberEditTask(j) {
    let member = document.getElementById('assignedTo_form');
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

/**
 * Adds the possibility to close the edit task form with the escape key.
 */
function editTaskAddCloseWithEscape() {
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeEditTask();
        };
    });
};


/**
 * Generates the HTML template for the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 * @returns {string} The HTML template for the edit task form.
 */
function templateEditTask(j) {
    return /*html*/`
        <!-- HTML template for the edit task form -->
        <div class="container-formular-task-on-board" onclick="doNotClose(event)">
            
            <!-- Close button for the edit task form -->
            <img onclick="closeEditTask()" src="../assets/icons/icon_cross_dark.svg" alt="" class="detail-task-close-btn">
      
            <!-- Title of the edit task form -->
            <span class="title-formular-on-board">Edit Task</span>

            <!-- Edit task form -->
            <form id="form_add_task" class="form-add-task" onsubmit="return false">

                <!-- Left side of the form containing task details -->
                <div class="left_side_desktop-add-task">

                    <!-- Input field for the task title -->
                    <div class="container-input">
                        <span class="form-text-add-task">Title</span>
                        <input value="${tasks[j]['title']}" class="inputfield-add-task" type="text" required placeholder="Enter a title" name=""
                            id="title_form">
                    </div>

                    <!-- Text area for the task description -->
                    <div class="container-input">
                        <span class="form-text-add-task">Description</span>
                        <textarea class="inputfield-add-task" maxlength="200" placeholder="Enter a description" name=""
                            id="description_form">${tasks[j]['description']}</textarea>
                    </div>

                    <!-- Dropdown select field for task category -->
                    <div class="container-input">
                        <span class="form-text-add-task">Category</span>
                        <select class="inputfield-add-task" type="text" required name="" id="category_form">
                            <option value="${tasks[j]['category']}" disabled selected>${tasks[j]['category'].slice(0, 1).toUpperCase()}${tasks[j]['category'].slice(1)}</option>
                            <option class="sales" value="sales">Sales</option>
                            <option class="marketing" value="marketing">Marketing</option>
                            <option class="accounting" value="accounting">Accounting</option>
                            <option class="development" value="development">Development</option>
                            <option class="purchase" value="purchase">Purchase</option>
                        </select>
                    </div>

                    <!-- Dropdown select field for assigning the task to a team member -->
                    <div class="container-input">
                        <span class="form-text-add-task">Assigned to</span>
                        <select oninput="addMemberEditTask(${j})" class="inputfield-add-task" type="text" name=""
                            id="assignedTo_form">
                        </select>

                        <!-- Click to delete text for selected team members -->
                        <div class="" id="click_to_delete_text"></div>

                        <!-- Container for displaying selected team members -->
                        <div class="selected-members-add-task" id="selected_members_add_task">

                        </div>
                    </div>
                </div>

                <!-- Vertical line separating the left and right sides of the form -->
                <img class="line-icon-add-task" src="../assets/icons/vertical_line_addTask.svg" alt="">

                <!-- Right side of the form containing task details -->
                <div class="right_side_desktop-add-task">

                    <!-- Input field for the task due date -->
                    <div class="container-input">
                        <span class="form-text-add-task">Due date</span>
                        <input value="${tasks[j]['dueDate']}" class="inputfield-add-task" type="date" required placeholder="dd/mm/yyyy" name=""
                            id="dueDate_form">
                    </div>

                    <!-- Priority buttons for the task -->
                    <div class="container-input">
                        <span class="form-text-add-task">Prio</span>

                        <div class="container-prio-btn-add-task">

                            <!-- Urgent priority button -->
                            <div id="prio_btn_urgent" class="prio-btn-add-task" onclick="setPrioValueEditTask(${j},'urgent')">
                                <span class="text-btn-prio-add-task">Urgent</span>
                                <img src="../assets/icons/icon_prio_high.svg" alt="">
                            </div>

                            <!-- Medium priority button -->
                            <div id="prio_btn_medium" class="prio-btn-add-task" onclick="setPrioValueEditTask(${j},'medium')">
                                <span class="text-btn-prio-add-task">Medium</span>
                                <img src="../assets/icons/icon_prio_medium.svg" alt="">
                            </div>

                            <!-- Low priority button -->
                            <div id="prio_btn_low" class="prio-btn-add-task" onclick="setPrioValueEditTask(${j},'low')">
                                <span class="text-btn-prio-add-task">Low</span>
                                <img src="../assets/icons/icon_prio_low.svg" alt="">
                            </div>

                            <!-- Hidden input for storing the priority value (not needed) -->
                            <!-- <input required id="prio_hidden" type="hidden" value="medium"> -->
                        </div>
                    </div>

                    <!-- Input field for adding subtasks to the task -->
                    <div class="container-input pos-relative">
                        <span class="form-text-add-task">Subtasks</span>
                        <input class="inputfield-add-task" maxlength="30" type="text" placeholder="Add new subtask"
                            name="" id="input_subtask">
                        <img onclick="addSubtaskEditTask(${j})" class="btn-plus-add-task" src="../assets/icons/icon_plus_dark.svg"
                            alt="">
                        <!-- Container for displaying subtasks -->
                        <div class="container-subtasks" id="container_subtasks">

                        </div>
                    </div>
                </div>

                <!-- Container for the buttons at the bottom of the form -->
                <div class="btn-container-add-task-on-board">
                    <!-- Reset button to reset the form -->
                    <button onclick="editTask(${j})"
                        id="btn_clear_task" type="button" for class="btn-clear">
                        <span>Reset</span>
                        <img src="../assets/icons/icon_cross_dark.svg" alt="">
                    </button>

                    <!-- Button to save the changes made in the form -->
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


/**
 * Sets the priority value of a task and updates the selected button style.
 * @param {number} j - The index of the task in the tasks array.
 * @param {string} prio - The priority value to set for the task (e.g., 'urgent', 'medium', 'low').
 */
function setPrioValueEditTask(j, prio) {
    tasks[j]['prio'] = prio;
    let selectedButton = document.getElementById('prio_btn_' + prio);
    resetPrioValue();
    selectedButton.classList.add('prio-selected');
};

/**
 * Safely saves changes made to a task in the edit task form.
 * @param {number} j - The index of the task in the tasks array.
 */
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

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Loads the user data for the logged-in user.
 * Updates the user initials display.
 */
async function loadUserData() {
    logedInUser = [];
    logedInUser = JSON.parse(await getItem('user'));
    let currentUser = logedInUser.name;
    console.log(currentUser);

    let userBox = document.querySelector('.userInitials');

    if (currentUser) {
        userBox.innerHTML = capitalizeFirstLetter(currentUser);
    } else {
        userBox.innerHTML = 'Guest';
    }

    if (currentUser != null) {
        getInitials(currentUser);
    } else {
        iniGuest();
    };
};

/**
 * Extracts initials from the user's full name and stores them for display.
 * @param {string} currentUser - The full name of the logged-in user.
 */
function getInitials(currentUser) {
    const names = currentUser.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase());

    const newInitials = initials.join(' ');
    const withoutSpaces = newInitials.replace(/\s/g, '');

    logedInUserInitials4.push(withoutSpaces);
    loadUserInitials();
};

/**
 * Loads the user initials for display.
 */
async function loadUserInitials() {
    let box = document.querySelector('.userInitials');
    box.innerHTML = '';

    if (logedInUserInitials4 != null) {
        for (let i = 0; i < logedInUserInitials4.length; i++) {
            const element = logedInUserInitials4[i];
            box.innerHTML = `<span>${element}</span>`;
        }
    } else {
        box.innerHTML = `<span>G</span>`;
    };
};
