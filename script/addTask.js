let tasks = [];
let subtasks = [];
let assignedTo = [];
let logedInUserInitials2 = [];
let assignedToInitials = [];
let assignedToColors = [];
let contactsForm = [];
let memberAssignedTo = [];
let colorsAssignedTo = [];


// Funktion zum Hinzufügen einer Aufgabe in das tasks-Array
function pushTaskToArray(title, description, category, member, dueDate, prio, subtasks, status, colors, initialsMembers) {
    // Die übergebenen Daten in einem Objekt speichern und in das tasks-Array pushen
    tasks.push({
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
    });
};

// Funktion zum Hinzufügen der Mitglieder in das memberAssignedTo-Array
function pushMemberToArrayAssignedTo() {
    // Alle Mitglieder aus dem contacts-Array in das memberAssignedTo-Array pushen
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        memberAssignedTo.push(contact['name']);
    };
};

// Funktion zum Hinzufügen der Farben in das colorsAssignedTo-Array
function pushColorToArrayAssignedTo() {
    // Alle Farben aus dem contacts-Array in das colorsAssignedTo-Array pushen
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        colorsAssignedTo.push(contact['color']);
    };
};

// Funktion zum Speichern des tasks-Arrays in Local Storage
async function safeTasks() {
    await setItem('task_array', JSON.stringify(tasks));
};

// Funktion zum Initialisieren des Hinzufügens einer Aufgabe
async function initAddTask() {
    // Aufgaben und Kontakte laden
    await loadTasks();
    await loadContacts();
    // Kontakte in die Form hinzufügen
    await loadContactsToForm();
    // Mitglieder in das memberAssignedTo-Array hinzufügen
    pushMemberToArrayAssignedTo();
    // Farben in das colorsAssignedTo-Array hinzufügen
    pushColorToArrayAssignedTo();
    loadUserData();

};

// Funktion zum Laden der Aufgaben aus dem Local Storage
async function loadTasks() {
    tasks = JSON.parse(await getItem('task_array'));
};

// Funktion zum Laden der Kontakte in das Formular
function loadContactsToForm() {
    // Das Formular leeren und die Optionen für Kontakte erstellen
    let content = document.getElementById('assignedTo_form');
    content.innerHTML = /*html*/`
        <option value="" disabled selected>Select contacts</option>
    `;

    // Alle Kontakte durchlaufen und Optionen für das Formular erstellen
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        content.innerHTML += templateMembersChose(contact);
    };
};

// Funktion zur Erstellung des HTML-Templates für die Optionen der Mitglieder im Formular
function templateMembersChose(contact) {
    return /*html*/`
        <option value="${contact['name']}">${contact['name']}</option>
    `;
};

// Funktion zur Festlegung des Prioritätswerts
function setPrioValue(prio) {
    // Den Wert des Prioritätshidden-Inputs setzen und das ausgewählte Button-Design anpassen
    document.getElementById('prio_hidden').value = prio;
    let selectedButton = document.getElementById('prio_btn_' + prio);
    resetPrioValue();
    selectedButton.classList.add('prio-selected');
};

// Funktion zum Zurücksetzen des Prioritätswerts
function resetPrioValue() {
    // Das ausgewählte Button-Design für die Priorität zurücksetzen
    document.getElementById('prio_btn_urgent').classList.remove('prio-selected');
    document.getElementById('prio_btn_medium').classList.remove('prio-selected');
    document.getElementById('prio_btn_low').classList.remove('prio-selected');
};

// Funktion zum Zurücksetzen des subtasks-Arrays und des zugehörigen Containers
function resetSubtaskArray() {
    subtasks = [];
    document.getElementById('container_subtasks').innerHTML = '';
};

// Funktion zum Hinzufügen eines neuen Subtasks
function addSubtask() {
    // Den eingegebenen Subtask zum subtasks-Array hinzufügen und das Rendering aktualisieren
    let subtask = document.getElementById('input_subtask');
    subtasks.push(subtask.value);
    subtask.value = '';
    renderSubtasks();
};

// Funktion zum Rendern der Subtasks
function renderSubtasks() {
    // Den Container für Subtasks leeren und jedes Subtask-Element rendern
    let content = document.getElementById('container_subtasks');
    content.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        content.innerHTML += templateSubtasks(i);
    };
};

// Funktion zum Erstellen des HTML-Templates für ein Subtask-Element
function templateSubtasks(i) {
    return /*html*/`
        <div class="text-subtask">
            ${subtasks[i]}
            <img onclick="deleteSubtask(${i})" class="hover" id="delete_btn_subtasks${i}" src="../assets/icons/trash.png" alt="">
        </div>
    `;
};

// Funktion zum Löschen eines Subtasks
function deleteSubtask(i) {
    // Den Subtask aus dem subtasks-Array entfernen und das Rendering aktualisieren
    subtasks.splice(i, 1);
    renderSubtasks();
};

// Funktion zum Hinzufügen einer Aufgabe
async function addTask(setStatus) {
    // Die Informationen aus dem Formular abrufen
    let title = document.getElementById('title_form').value;
    let description = document.getElementById('description_form').value;
    let category = document.getElementById('category_form').value;
    let member = assignedTo;
    let dueDate = document.getElementById('dueDate_form').value;
    let prio = document.getElementById('prio_hidden').value;
    let subtasks_task = subtasks;
    let status = setStatus;
    let colors = assignedToColors;
    let initialsMembers = assignedToInitials;

    // Überprüfen, ob die Pflichtfelder ausgefüllt sind, und die Aufgabe hinzufügen
    if (title != '' && category != '' && assignedTo != '' && dueDate != '') {
        pushTaskToArray(title, description, category, member, dueDate, prio, subtasks_task, status, colors, initialsMembers);
        await safeTasks();

        document.getElementById('form_add_task').reset();
        resetPrioValue();
        resetSubtaskArray();
        resetAssignedTo();
        resetAssignedToArrays();
        taskAddedPopUp();
    };
};

// Funktion zum Hinzufügen eines Mitglieds
function addMember() {
    let member = document.getElementById('assignedTo_form');

    for (let i = 0; i < memberAssignedTo.length; i++) {
        const assignedMember = memberAssignedTo[i];

        if (assignedTo.indexOf(member.value) == -1) {
            // Das ausgewählte Mitglied in die assignedTo-Arrays hinzufügen
            assignedTo.push(member.value);
            assignedToInitials.push(initials[memberAssignedTo.indexOf(member.value)]);
            assignedToColors.push(colorsAssignedTo[memberAssignedTo.indexOf(member.value)]);
        }
    };
    renderMembers()
};

// Funktion zum Rendern der Mitglieder
function renderMembers() {
    // Den Container für die ausgewählten Mitglieder leeren und jedes Mitglied rendern
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

// Funktion zum Zurücksetzen der ausgewählten Mitglieder
function resetAssignedTo() {
    assignedTo = [];
    assignedToColors = [];
    assignedToInitials = [];
    renderMembers();
};

// Funktion zum Zurücksetzen der Arrays für die ausgewählten Mitglieder, Subtasks und Prioritäten
function resetAssignedToArrays() {
    resetAssignedTo();
    resetSubtaskArray();
    resetPrioValue();
    resetAssignedToInitials();
    resetAssignedToColors();
};

// Funktion zum Zurücksetzen der initialsMembers-Array
function resetAssignedToInitials() {
    assignedToInitials = [];
};

// Funktion zum Zurücksetzen der colors-Array
function resetAssignedToColors() {
    assignedToColors = [];
};

// Funktion zum Erstellen des HTML-Templates für die ausgewählten Mitglieder
function templateMembers(i) {
    return /*html*/`
      <div style="background-color: ${assignedToColors[i]}" onclick=deleteMember(${i}) class="member-add-task">
        <span>${assignedToInitials[i]}</span>
      </div>
    `;
};

// Funktion zum Löschen eines Mitglieds
function deleteMember(i) {
    // Das Mitglied aus den assignedTo-Arrays entfernen und das Rendering aktualisieren
    assignedTo.splice(i, 1);
    assignedToColors.splice(i, 1);
    assignedToInitials.splice(i, 1);
    renderMembers();
    document.getElementById('assignedTo_form').value = '';
};

// Funktion zum Anzeigen eines Pop-up-Benachrichtigung, dass die Aufgabe hinzugefügt wurde
function taskAddedPopUp() {
    let popup = document.getElementById('container_pop_up_add_task');
    popup.innerHTML = templatePopUpTaskAdded();
    popup.classList.remove('d-none');

    setTimeout(() => {
        popup.classList.add('d-none');
    }, 2000);
};

// Funktion zum Erstellen des HTML-Templates für das Pop-up
function templatePopUpTaskAdded() {
    return /*html*/`
        <div class="pop-up-task-added" id="pop_up_task_added">
                <span class="pop-up-task-added-text">Task added to board</span>
                <img class="pop-up-task-added-img" src="../assets/icons/icon_sidebar_board.svg" alt="">
        </div>
    `;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    }
};


    function getInitials(currentUser) {
    const names = currentUser.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase());

    const newInitials = initials.join(' ');
    const withoutSpaces = newInitials.replace(/\s/g, '');

    logedInUserInitials2.push(withoutSpaces);
    loadUserInitials();
}

async function loadUserInitials() {
    let box = document.querySelector('.userInitials');
    box.innerHTML = '';
    
    if(logedInUserInitials2 != null) {
        for (let i = 0; i < logedInUserInitials2.length; i++) {
            const element = logedInUserInitials2[i];
            box.innerHTML =  `<span>${element}</span>`;   
        }
    } else {
        box.innerHTML =  `<span>G</span>`; 
    }
}
