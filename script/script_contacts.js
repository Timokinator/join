let contacts = [];
let initials = [];

// Asynchronous function that initializes all necessary functions when loading the page
async function init() {
    await loadContacts();
    await extractInitials(contacts);
    renderContacts();
}
// Function to push the entered contacts into the "contacts" array
function pushToArray(name, email, phone, color) {
    contacts.push(
        {
            'name': name,
            'email': email,
            'phone': phone,
            'color': color,
        }
    );
};

// Asynchronous function to save all contacts from array "contacts" to remote storage
async function safeContacts() {
    await setItem('contact_array', JSON.stringify(contacts));
};

// Asynchronous function to load all contacts from the remote storage and assign them to the "contacts" array
async function loadContacts() {
    contacts = JSON.parse(await getItem('contact_array'));
};

// Asynchronous function to add a new contact to the "contacts" array
async function addContact() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    if (name != '' && email != '' && phone != '') {
        console.log('Test');
        pushToArray(name, email, phone);
        await safeContacts();
        createdContactSuccessfully();
        hideAddContactCard();

    }
    document.getElementById('form_add_contact').reset();
    renderContacts();
}

// Function hides "Contact Container"
function hideAddContactCard() {
    document.getElementById("addContactCard").style.display = "none";
}

// Function shows "Contact Container"
function showAddContactCard() {
    document.getElementById("addContactCard").style.display = "flex";
}

// Function hides "Edit Contact Container"
function hideEditContactCard() {
    document.getElementById("editContactCard").style.display = "none";
}

// Function shows "Edit Contact Container"
function showEditContactCard(i) {
    document.getElementById("editContactCard").style.display = "flex";
    renderEditContact(i);
}

// Function renders a specific contact in the detail view
function renderContact(i) {

    contactsboxbig.innerHTML = '';

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let color = contacts[i]['color'];
    let initial = initials[i];

    contactsboxbig.innerHTML += `
        <div class="contact_big flex juststart fdc">
            <div class="flex align fdr">
                <div style="background-color:${color}" id="usercircle${i}" class="usercircle">${initial}</div>
                    <div class="flex juststart alignstart fdc">          
                        <div class="contactNameBig FS47-500">${name}</div>
                        <div class="FS16-400 lightblue cursor">+ Add Task</div>
                    </div>
            </div>
            <div class="flex align fdr">
                <div class="flex align fdr">
                    <div class="FS21-400">Contact Information</div>
                    <img src="../assets/icons/icon_edit_contact_pencil.svg">
                    <div onclick="showEditContactCard (${i})" class="FS16-400 cursor">Edit Contact</div>
                </div>
            </div>
            <p class="FS16-700">Email</p>
            <a class="FS16-400 lightblue" href="mailto:${email}">${email}</a>
            <p class="FS16-700">Phone</p>
            <div class="FS16-400">${phone}</div>
        `;
}

// Asynchronous function renders all existing contacts
async function renderContacts() {
    let contact = document.getElementById('contactsboxsmall');
    contact.innerHTML = '';
    
    await loadContacts();

    
    for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i];
        let name = contacts[i]['name'];
        let email = contacts[i]['email'];
        let phone = contacts[i]['phone'];
        let color = contacts[i]['color'];
        let initial = initials[i];


        contactsboxsmall.innerHTML += `
    <div id="firstLetter"></div>
        <div onclick="renderContact(${i})" id="${i}" class="contact_small flex juststart align">   
            <div style="background-color:${color}" id="usercircle${i}" class="usercircle">${initial}</div>
        <div>    
            <div>
                <div class="contactNameBig FS32pxbold">${name}</div>
            <div>
            <a href="mailto:${email}">${email}</a>
        </div>
    <div>        
        `;
    }
    extractInitials(contacts);
}

// Function renders the "Edit Contact" container
function renderEditContact(i) {
    editContactForm = document.getElementById('editContactForm')
    editContactForm.innerHTML = '';

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    
    editContactForm.innerHTML += `
    <img onclick="hideEditContactCard()" class="close_symbol" src="../assets/icons/icon_add_contact_X.svg">
                    <form id="form_edit_contact" class="editContactRight_right" onsubmit="return false">
                        <input id="edit-name" type="text" value="${name}" required>
                        <input id="edit-email" type="email" value="${email}" required>
                        <input id="edit-phone" type="tel"  value="${phone}" required>
                            <div class="flex">
                                <button onclick="deleteContact(${i})" class="delete_btn">Delete</button>
                                <button onclick="editContact(${i})" class="save_btn">Save</button>
                            </div>
                            <img class="icon-name-add-contact" src="../assets/icons/icon_add_contact_user.svg" alt="">
                            <img class="icon-email-add-contact" src="../assets/icons/icon_add_contact_mail.svg" alt="">
                            <img class="icon-phone-add-contact" src="../assets/icons/icon_add_contact_phone.svg" alt="">
                    </form>
    `;
}

// Function which deletes a specific contact in the array "contacts" at position [i].
function deleteContact(i) {
    if (contacts.length > 9) {
        contacts.splice(i, 1);
    } else {
        alert("For Testreasons we can´t delete a contact if there is only 10 or less available.");
    }
    
    contactsboxbig.innerHTML = '';
    hideEditContactCard();
    renderContacts();
}

// Function shows a popup for a certain time "created contact successfully"
function createdContactSuccessfully() {
    document.getElementById("addContactCard").style.display = "none";
    document.getElementById('success').style.display = '';
    document.getElementById('success').classList.add("animate-contact");

    setTimeout(() => {
        document.getElementById('success').style.display = 'none';
    }
        , 2000);
}

// Edit function Overwrites the values from the "contacts" array insofar as new data is entered
async function editContact(i) {
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');

    const newName = nameInput.value;
    const newEmail = emailInput.value;
    const newPhone = phoneInput.value;

    // Update the existing entry in the array
    contacts[i].name = newName;
    contacts[i].email = newEmail;
    contacts[i].phone = newPhone;

    
    // Optional: Display the updated values in the console
    console.log(contacts);

    // Do more actions after array update
    document.getElementById("editContactCard").style.display = "none";
    await safeContacts();
    await loadContacts();
    await extractInitials(contacts);
    renderContacts();
}

// Extracts the uppercase initials from the array "contacts"['name']
async function extractInitials(contacts) {
    for (var i = 0; i < contacts.length; i++) {
        var name = contacts[i].name;
        var initialsString = '';
        for (var j = 0; j < name.length; j++) {
            var char = name[j];
        if (char === char.toUpperCase()) {
            initialsString += char;
        }
    }
        initials.push(initialsString);
    }
    return initials;
}

//Function generates random colors and assigns them to the "Usercircle" in which the initials are also there
function assignRandomColorToDiv(i) {
    // Generate random RGB values
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    // Convert RGB values to a color string
    var color = "rgb(" + red + ", " + green + ", " + blue + ")";

    // Select div container with id and set background color
    var containerId = "usercircle" + i;
    var container = document.getElementById(containerId);
    container.style.backgroundColor = color;

    // Map the color value to the corresponding object in the "contacts" array
    contacts[i].color = color;
}










