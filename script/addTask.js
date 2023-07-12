let tasks = [];
let subtasks = [];
let assignedTo = [];
let assignedToInitials = [];
let assignedToColors = [];
let contactsForm = [];
let memberAssignedTo = [];
let colorsAssignedTo = [];


function pushTaskToArray(title, description, category, member, dueDate, prio, subtasks, status, colors, initialsMembers) {
    tasks.push(
        {
            'title': title,
            'description': description,
            'category': category,
            'assignedTo': member,
            'dueDate': dueDate,
            'prio': prio,
            'subtasks': subtasks,
            'status': status,
            'initials': initialsMembers,
            'colors': colors,
        }
    );
};


function pushMemberToArrayAssignedTo() {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        
        memberAssignedTo.push(contact['name'])
    };
};


function pushColorToArrayAssignedTo() {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        colorsAssignedTo.push(contact['color']);
    };
};



async function safeTasks() {
    await setItem('task_array', JSON.stringify(tasks));
};


async function initAddTask() {
    await loadTasks();
    await loadContacts();
    await loadContactsToForm();
    pushMemberToArrayAssignedTo();
    pushColorToArrayAssignedTo();
};


async function loadTasks() {
    tasks = JSON.parse(await getItem('task_array'));
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



function setPrioValue(prio) {
    document.getElementById('prio_hidden').value = prio;
    let selectedButton = document.getElementById('prio_btn_' + prio);
    resetPrioValue();
    selectedButton.classList.add('prio-selected');
};


function resetPrioValue() {
    document.getElementById('prio_btn_urgent').classList.remove('prio-selected');
    document.getElementById('prio_btn_medium').classList.remove('prio-selected');
    document.getElementById('prio_btn_low').classList.remove('prio-selected');
};


function resetSubtaskArray() {
    subtasks = [];
    document.getElementById('container_subtasks').innerHTML = '';
};


function addSubtask() {
    let subtask = document.getElementById('input_subtask');
    subtasks.push(subtask.value);
    subtask.value = '';
    renderSubtasks();
};


function renderSubtasks() {
    let content = document.getElementById('container_subtasks');
    content.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        content.innerHTML += templateSubtasks(i);
    };
};


function templateSubtasks(i) {
    return /*html*/`
        <div class="text-subtask">
            ${subtasks[i]}
            <img onclick="deleteSubtask(${i})" class="hover" id="delete_btn_subtasks${i}" src="../assets/icons/trash.png" alt="">
        </div>
    `;
};


function deleteSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
};


async function addTask() {
    let title = document.getElementById('title_form').value;
    let description = document.getElementById('description_form').value;
    let category = document.getElementById('category_form').value;
    let member = assignedTo;
    let dueDate = document.getElementById('dueDate_form').value;
    let prio = document.getElementById('prio_hidden').value;
    let subtasks_task = subtasks;
    let status = 'todo';
    let colors = assignedToColors;
    let initialsMembers = assignedToInitials;


    if (title != '' && category != '' && assignedTo != '' && dueDate != '') {
        pushTaskToArray(title, description, category, member, dueDate, prio, subtasks_task, status, colors, initialsMembers);
        await safeTasks();
    };

    document.getElementById('form_add_task').reset();
    resetPrioValue();
    resetSubtaskArray();
    resetAssignedTo();
};


function addMember() {
    let member = document.getElementById('assignedTo_form')
    for (let i = 0; i < memberAssignedTo.length; i++) {
        const assignedMember = memberAssignedTo[i];
        
        if (assignedTo.indexOf(member.value) == -1) {
            assignedTo.push(member.value);
            assignedToInitials.push(initials[memberAssignedTo.indexOf(member.value)]);
            assignedToColors.push(colorsAssignedTo[memberAssignedTo.indexOf(member.value)]);
        }

    }
/* 
    assignedTo.sort();
    assignedToInitials.sort();
    assignedToColors.sort(); */
    renderMembers()
};


function renderMembers() {
    let content = document.getElementById('selected_members_add_task');
    let deleteArea = document.getElementById('click_to_delete_text');
    content.innerHTML = '';

    if (assignedTo.length > 0) {
        deleteArea.innerHTML = /*html*/`
            <span>Click to delete</span>
        `;
    } else {
        deleteArea.innerHTML = '';
    };

    for (let i = 0; i < assignedTo.length; i++) {
        const member = assignedTo[i];
        content.innerHTML += templateMembers(i);
    };
};


function resetAssignedTo() {
    assignedTo = [];
    renderMembers();
};







function templateMembers(i) {
    return /*html*/`
      <div style="background-color: ${assignedToColors[i]}" onclick=deleteMember(${i}) class="member-add-task">
        <span>${assignedToInitials[i]}</span>
      </div>
    `;
};


function deleteMember(i) {
    assignedTo.splice(i, 1);
    assignedToColors.splice(i, 1);
    assignedToInitials.splice(i, 1);
    renderMembers();
    document.getElementById('assignedTo_form').value = '';
};
