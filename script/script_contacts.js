let contacts = [
    {
        "Name": "Benjamin Tietz",
        "Email": "Benjamin-Tietz@bla.net",
        "Phone": "0123456789"
    },
    {
        "Name": "Xenjamin Wietz",
        "Email": "Benjamin-Tietz@bla.net",
        "Phone": "0123456789"
    },
    {
        "Name": "Eenjamin Kietz",
        "Email": "Benjamin-Tietz@bla.net",
        "Phone": "0123456789"
    },
    {
        "Name": "Denjamin Lietz",
        "Email": "Benjamin-Tietz@bla.net",
        "Phone": "0123456789"
    }
];

function init() {
    renderContacts();
}

function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');

    let contact = {
        "Name": name.value,
        "Email": email.value,
        "Phone": phone.value
    };
    contacts.push(contact);
    console.log(contacts);
    name.value = '';
    email.value = '';
    phone.value = '';

    renderContact();
    renderContacts();
}

function hideAddContactCard() {
    document.getElementById("addContactCard").style.display = "none";
}

function showAddContactCard() {
    document.getElementById("addContactCard").style.display = "flex";
}

function hideEditContactCard() {
    document.getElementById("editContactCard").style.display = "none";
}

function showEditContactCard(i) {
    document.getElementById("editContactCard").style.display = "flex";
    renderEditContact(i);
}

function renderContact(i) {

    contactsboxbig.innerHTML = '';

    let name = contacts[i]['Name'];
    let email = contacts[i]['Email'];
    let phone = contacts[i]['Phone'];

    contactsboxbig.innerHTML += `
        <div class="contact_big flex juststart fdc">
            <div class="flex align fdr">
                <div class="usercircle">BT</div>
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
function renderContacts() {
    let contact = document.getElementById('contactsboxsmall');
    contact = '';

    for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i];
        let name = contacts[i]['Name'];
        let email = contacts[i]['Email'];
        let phone = contacts[i]['Phone'];

        contactsboxsmall.innerHTML += `
    <div id="firstLetter"></div>
        <div onclick="renderContact(${i})" id="${i}" class="contact_small flex just align">   
            <div class="usercircle">BT</div>
        <div>    
            <div>
                <div class="contactNameBig FS32pxbold">${name}</div>
            <div>
            <a href="mailto:${email}">${email}</a>
        </div>
    <div>        
        `;
    }
}

function renderEditContact(i) {
    editContactForm.innerHTML = '';

    let name = contacts[i]['Name'];
    let email = contacts[i]['Email'];
    let phone = contacts[i]['Phone'];

    editContactForm.innerHTML += `
    <img onclick="hideEditContactCard()" class="close_symbol" src="../assets/icons/icon_add_contact_X.svg">
                    <form class="editContactRight_right">
                        <input id="name" type="text" value="${name}" required>
                        <input id="email" type="email" value="${email}" required>
                        <input id="phone" type="tel"  value="${phone}" required>
                            <div class="flex">
                                <button onclick="deleteContact(${i})" class="cancel_btn">Delete</button>
                                <button onclick="editContact(${i})"  class="create_btn">Save</button>
                            </div>
                    </form>
    `;
}

function deleteContact(i) {
    const removed = contacts.splice(i, 1);

    renderContacts();
}

function editContact(i) {
    const edit = contacts.splice(start, deleteCount, item1);

    renderContacts();
}

