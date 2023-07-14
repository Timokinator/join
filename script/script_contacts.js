let contacts = [];
let initials = [];
let sortedalphabetically = [];
let letters = [];

// Asynchronous function that initializes all necessary functions when loading the page
async function init() {
    await loadContacts();
    await extractInitials(sortedalphabetically);
    renderContacts();
};

// Asynchronous function that refreshes the page
async function refresh() {
    let contactsboxbig = document.getElementById('contactsboxbig');
    contactsboxbig.innerHTML = '';
    let contact = document.getElementById('contactsboxsmall');
    contact.innerHTML = '';

    initials = [];
    sortedalphabetically = [];

    await safeContacts();
    await loadContacts();
    await extractInitials(sortedalphabetically);
    renderContacts();
};


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
}

// Asynchronous function to save all contacts from array "contacts" to remote storage
async function safeContacts() {
    await setItem('contact_array', JSON.stringify(contacts));
    await setItem('initials_array', JSON.stringify(initials));
}

// Asynchronous function to load all contacts from the remote storage and assign them to the "contacts" array
async function loadContacts() {
    contacts = JSON.parse(await getItem('contact_array'));
    initials = JSON.parse(await getItem('initials_array'));
}

// Asynchronous function to add a new contact to the "contacts" array
async function addContact() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    
    sortedalphabetically = [];

    if (name != '' && email != '' && phone != '') {
        pushToArray(name, email, phone);
        await safeContacts();
        createdContactSuccessfully();
        hideAddContactCard();
    }
    document.getElementById('form_add_contact').reset();
    await refresh();
}

// Function hides "Contact Container"
function hideAddContactCard() {     
    document.getElementById("overlay_add_contact").style.display = "none";
}

// Function hides "MOBILE Contact Container"
function hideMobileAddContactCard() {     
    document.getElementById("overlay_add_contact_mobile").style.display = "none";
}

// Function shows "Contact Container"
function showAddContactCard() {
    document.getElementById("addContactCard").style.display = "flex";
    document.getElementById("overlay_add_contact").style.display = "flex";
}

// Function shows "MOBILE Contact Container"
function showMobileAddContactCard() {
    document.getElementById("addContactCard_mobile").style.display = "flex";
    document.getElementById("overlay_add_contact_mobile").style.display = "flex";
}

// Function hides "Edit Contact Container"
function hideEditContactCard() {
    document.getElementById("editContactCard").style.display = "none";
    document.getElementById("overlay_add_contact").style.display = "none";
}

// Function shows "Edit Contact Container"
function showEditContactCard(i) {
    document.getElementById("overlay_edit_contact").style.display = "flex";
    document.getElementById("editContactCard").style.display = "flex";
    renderEditContact(i);
}

// Function closes Overlay from "ADD-/EDIT Contact Container"
function closeOverlay() {
    document.getElementById("overlay_add_contact").style.display = "none";
    document.getElementById("overlay_edit_contact").style.display = "none";
}

// Function whiches hides mobile detail view of a contact
function hideMobileContactView() {
    document.getElementById("contacts-right-mobile").style.display = "none";
}
// Function renders a specific contact in the detail view
function renderContact(i) {
    document.getElementById("contactsboxbig").style.display = "flex";
    let contactsboxbig = document.getElementById('contactsboxbig');
    contactsboxbig.innerHTML = '';

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let color = contacts[i]['color'];
    let initial = initials[i];

    contactsboxbig.innerHTML +=/*html*/`
        <div class="contact_big flex juststart fdc">
            <div class="flex align fdr">
                <div style="background-color:${color}" id="usercircle${i}" class="usercircle">${initial}</div>
                    <div class="flex juststart alignstart fdc gap5">          
                        <div class="contactNameBig FS47-500">${name}</div>
                        <div class="FS16-400 lightblue cursor">+ Add Task</div>
                    </div>
            </div>
            <div class="flex align fdr">
                <div class="flex align fdr gap59">
                    <div class="FS21-400">Contact Information</div>
                    <div class="flex align fdr gap6 cursor">
                        <img onclick="showEditContactCard (${i})" src="../assets/icons/icon_edit_contact_pencil.svg">
                        <div onclick="showEditContactCard (${i})" class="FS16-400">Edit Contact</div>
                    </div>
                </div>
            </div>
            <p class="FS16-700">Email</p>
            <a class="FS16-400 lightblue" href="mailto:${email}">${email}</a>
            <p class="FS16-700">Phone</p>
            <div class="FS16-400">${phone}</div>
        `;
}

// Function renders a specific contact in the MOBILE detail view
function renderContactMobile(i) {
    document.getElementById("contacts-right-mobile").style.display = "block";
    let contactsboxbigmobile = document.getElementById('contactsboxbigmobile');
    contactsboxbigmobile.innerHTML = '';

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let color = contacts[i]['color'];
    let initial = initials[i];

    contactsboxbigmobile.innerHTML +=/*html*/`
        <div class="contact_big_mobile flex juststart fdc">
            <div class="flex align fdr">
                <div style="background-color:${color}" id="usercircle${i}" class="usercircle">${initial}</div>
                    <div class="flex juststart alignstart fdc gap5">          
                        <div class="contactNameBig FS47-500">${name}</div>
                        <div class="FS16-400 lightblue cursor">+ Add Task</div>
                    </div>
            </div>
            <div class="flex align fdr">
                <div class="flex align fdr gap59">
                    <div class="FS21-400">Contact Information</div>
                </div>
            </div>
            <p class="FS16-700">Email</p>
            <a class="FS16-400 lightblue" href="mailto:${email}">${email}</a>
            <p class="FS16-700">Phone</p>
            <div class="FS16-400">${phone}</div>
            <div class="icon_container">
                <div onclick="deleteContact(${i})" class="trash-container"><img class="icon_mobile_Trashcan"src="../assets/icons/icon_contact_trashcan.svg"></div>
                <div class="pencil-container"><img class="icon_mobile_Pencil" src="../assets/icons/icon_contact_pencil_white.svg"><div>
            </div>
        `;
}

// Asynchronous function renders all existing contacts
async function renderContacts() {
    let contact = document.getElementById('contactsboxsmall');
    contact.innerHTML = '';

    await loadContacts();

    sortedalphabetically = sortContactsAlphabetically(contacts);
    extractInitials(sortedalphabetically);

    const letters = [];

    for (let i = 0; i < sortedalphabetically.length; i++) {
        const element = sortedalphabetically[i];
        let name = element['name'];
        let email = element['email'];
        let phone = element['phone'];
        let initial = initials[i];
        let color = element.color;

        const firstLetter = name.charAt(0).toUpperCase();

        if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);

        const containerId = `letter${firstLetter}`;
        const container = document.createElement('div');
        container.id = containerId;
        contact.appendChild(container);

        const letterContainer = document.createElement('div');
        letterContainer.className = 'letter-container';
        letterContainer.innerHTML = firstLetter;
        container.appendChild(letterContainer);

        const letterdevide = document.createElement('div');
        letterdevide.className = 'letter-devide';
        letterdevide.innerHTML = '<hr>';
        container.appendChild(letterdevide);
        }

        if (!color) {
        color = assignRandomColorToDiv(i);
        element.color = color;
        }

        const containerId = `letter${firstLetter}`;
        const container = document.getElementById(containerId);

        const contactDiv = document.createElement('div');
        contactDiv.onclick = function () {
        renderContact(i), renderContactMobile(i);
    };
        contactDiv.id = i;
        contactDiv.className = 'contact_small_content flex juststart align';
        contactDiv.innerHTML =/*html*/`
        <div style="background-color:${color}" id="usercircle${i}" class="usercircle_small">${initial}</div>
        <div>
            <div class="FS21-400">${name}</div>
            <div>
            <a class="FS16-400" href="mailto:${email}">${email}</a>
            </div>
        </div>`;
        container.appendChild(contactDiv);
        container.classList.add('letterbox');
    }
}

// Function renders the "Edit Contact" container
function renderEditContact(i) {
    editContactForm = document.getElementById('editContactForm');
    editContactForm.innerHTML = '';

    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let initial = initials[i];
    let color = contacts[i]['color'];

    editContactRight_left = document.getElementById('editContactRight_left');
    editContactRight_left.innerHTML = '';
    editContactRight_left.innerHTML +=`<div style="background-color:${color}" id="usercircle${i}" class="usercircle_edit_contact">${initial}</div>`;
    
    editContactForm.innerHTML +=/*html*/`
    <img onclick="hideEditContactCard();closeOverlay()" class="close_symbol" src="../assets/icons/icon_add_contact_X.svg">
                    <form id="form_edit_contact" class="editContactRight_right" onsubmit="return false">
                        <input class="inputDesktop" id="edit-name" type="text" value="${name}" required>
                        <input class="inputDesktop" id="edit-email" type="email" value="${email}" required>
                        <input class="inputDesktop" id="edit-phone" type="tel"  value="${phone}" required>
                            <div class="flex">
                                <button onclick="deleteContact(${i});closeOverlay()" class="delete_btn">Delete</button>
                                <button onclick="editContact(${i});closeOverlay()" class="save_btn">Save</button>
                            </div>
                            <img class="icon-name-add-contact" src="../assets/icons/icon_add_contact_user.svg" alt="">
                            <img class="icon-email-add-contact" src="../assets/icons/icon_add_contact_mail.svg" alt="">
                            <img class="icon-phone-add-contact" src="../assets/icons/icon_add_contact_phone.svg" alt="">
                    </form>
    `;
}

// Function which deletes a specific contact in the array "contacts" at position [i].
async function deleteContact(i) {
    if (contacts.length > 9) {
        contacts.splice(i, 1);
    } else {
        alert("For Testreasons we can´t delete a contact if there is only 10 or less available.");
    }

    sortedalphabetically = [];
    await refresh();
    hideEditContactCard();

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
    await refresh();
}

// Extracts the uppercase initials from the array "contacts"['name']
function extractInitials(sortedContacts) {
    initials = sortedContacts.map(contact => {
        const name = contact.name;
        const matches = name.match(/[A-Z]/g);
        const initialsString = matches ? matches.join('') : '';
        return initialsString;
    });
}

// Function assignes random Color to Usercircle
function assignRandomColorToDiv(i) {
    // Check if the contact already has a color assigned
    if (!contacts[i].color) {
      // Generate random HSL values with fixed saturation and lightness ranges
      var hue = Math.floor(Math.random() * 361); // Random hue between 0 and 360
      var saturation = Math.floor(Math.random() * 51) + 50; // Random saturation between 50 and 100
      var lightness = Math.floor(Math.random() * 26) + 35; // Random lightness between 35 and 60
    
      // Convert HSL values to a color string
        var color = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
    
      // Update the corresponding contact object in the "contacts" array with the color
        contacts[i].color = color;
    }
    // Return the assigned color
    return contacts[i].color;
}

// function alphabetically sorts the "contacts" array by the first capital letter of the "name" field and pushes it into a new array named "sortedalphabetically"
function sortContactsAlphabetically(contacts) {

    // Sort the contacts by the first capital letter of the name
    contacts.sort((a, b) => {
        const nameA = a.name.charAt(0).toUpperCase();
        const nameB = b.name.charAt(0).toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    // Add the sorted contacts to the "alphabeticallySorted" array
    contacts.forEach(contact => {
        sortedalphabetically.push(contact);
    });

    return sortedalphabetically;
}


