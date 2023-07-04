let contacts = [];

function init() {
    renderContacts();
}

function pushToArray(name, email, phone) {
    contacts.push(
        {
            'name': name,
            'email': email,
            'phone': phone,
        }
    );
};

async function safeContacts() {
    await setItem('contact_array', JSON.stringify(contacts));
};


async function loadContacts() {
    contacts = JSON.parse(await getItem('contact_array'));
};

async function addContact() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    if (name != '' && email != '' && phone != '') {
        console.log('Test');
        pushToArray(name, email, phone);
        await safeContacts();
    }
    document.getElementById('form_add_contact').reset();
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

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];

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
async function renderContacts() {
    await loadContacts();

    let contact = document.getElementById('contactsboxsmall');
    contact = '';

    for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i];
        let name = contacts[i]['name'];
        let email = contacts[i]['email'];
        let phone = contacts[i]['phone'];

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
    editContactForm = document.getElementById('editContactForm')
    editContactForm.innerHTML = '';

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    
    editContactForm.innerHTML += `
    <img onclick="hideEditContactCard()" class="close_symbol" src="../assets/icons/icon_add_contact_X.svg">
                    <form id="form_edit_contact" class="editContactRight_right" onsubmit="return false">
                        <input id="name" type="text" value="${name}" required>
                        <input id="email" type="email" value="${email}" required>
                        <input id="phone" type="tel"  value="${phone}" required>
                            <div class="flex">
                                <button onclick="deleteContact(${i})" class="delete_btn">Delete</button>
                                <button onclick="editContact(${i})"  class="save_btn">Save</button>
                            </div>
                    </form>
    `;
}


//**non-functional */
function deleteContact(i) {
    contacts.splice(i, 1);
    renderContacts();

}

function editContact(i) {
    const edit = contacts.splice(start, deleteCount, item1);
}
//**non-functional */

