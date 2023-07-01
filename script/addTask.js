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