let tasks = [];
let subtasks = [];


function pushToArray(title, description, category, assignedTo, dueDate, prio, subtasks, status) {
    tasks.push(
        {
            'title': title,
            'description': description,
            'category': category,
            'assignedTo': assignedTo,
            'dueDate': dueDate,
            'prio': prio,
            'subtasks': subtasks,
            'status': status
        }
    );
};


async function safeTasks() {
    await setItem('task_array', JSON.stringify(tasks));
};


async function loadTasks() {
    tasks = JSON.parse(await getItem('task_array'));
};


function setPrioValue(prio) {
    document.getElementById('prio_hidden').value = prio;
    let selectedButton = document.getElementById('prio_btn_' + prio)
    resetPrioValue();
    selectedButton.classList.add('prio-selected')
};


function resetPrioValue() {
    document.getElementById('prio_btn_urgent').classList.remove('prio-selected')
    document.getElementById('prio_btn_medium').classList.remove('prio-selected')
    document.getElementById('prio_btn_low').classList.remove('prio-selected')
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
            <img onclick="deleteSubtask(${i})" id="delete_btn_subtasks${i}" src="../assets/icons/trash.png" alt="">
        </div>
    `;
}


function deleteSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
};


async function addTask() {

    let title = document.getElementById('title_form').value;
    let description = document.getElementById('description_form').value;
    let category = document.getElementById('category_form').value;
    let assignedTo = document.getElementById('assignedTo_form').value;
    let dueDate = document.getElementById('dueDate_form').value;
    let prio = document.getElementById('prio_hidden').value;
    let subtasks_task = subtasks;
    let status = 'todo';

    if (title != '' && category != '' && assignedTo != '' && dueDate != '') {
        console.log('Test');
        pushToArray(title, description, category, assignedTo, dueDate, prio, subtasks_task, status);
        await safeTasks();
    }

    document.getElementById('form_add_task').reset();
    resetPrioValue();
    resetSubtaskArray();

};


