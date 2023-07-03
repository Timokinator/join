let tasks = [];


function pushToArray(title, description, category, member, date, prio, subtasks, status) {
    tasks.push(
        {
            'title': title,
            'description': description,
            'category': category,
            'member': member,
            'date': date,
            'prio': prio,
            'subtasks': subtasks,
            'status': status    
        }
    );
};


async function safeTasks() {
    await setItem('task_array', JSON.stringify(tasks));
}

async function loadTasks() {
   tasks = JSON.parse(await getItem('task_array'));
};


function setPrioValue(prio) {
    let prioValue = document.getElementById('prio_hidden').value;
    prioValue = prio;
    let selectedButton = document.getElementById('prio_btn_'+prio)
    resetPrioValue();
    selectedButton.classList.add('prio-selected')
};


function resetPrioValue() {
    document.getElementById('prio_btn_urgent').classList.remove('prio-selected')
    document.getElementById('prio_btn_medium').classList.remove('prio-selected')
    document.getElementById('prio_btn_low').classList.remove('prio-selected')
};


function addSubtask() {
    console.log('Test')
}