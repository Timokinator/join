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

             content.innerHTML += templateSingleTask(task)

            }


        }

    }

}

function templateSingleTask(task) {
    return /*html*/`
        <div class="single-task">
            ${task['title']}




        </div>
        
        

    `


}
