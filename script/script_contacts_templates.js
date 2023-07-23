/**
 * Template for the Function which returns HTML Block to render specific Contact
 * @param {number} i - This is the index of an existing contact
 */
function renderContactTemplate (i) {
    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let color = contacts[i]['color'];
    let initial = initials[i];
    return /*html*/`
    <div class="contact_big">
    <div class="flex align fdr">
        <div style="background-color:${color}" id="usercircle${i}" class="usercircle">${initial}</div>
            <div class="flex juststart alignstart fdc gap5">          
                <div class="contactNameBig FS47-500">${name}</div>
                <div onclick="addNewTaskFromContacts(${i},'todo')" class="FS16-400 lightblue cursor">+ Add Task</div>
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
/**
 * Template for the Function which returns HTML Block to render specific Contact of the mobile view
 * @param {number} i - This is the index of an existing contact
 */
function renderContactTemplateMobile (i) {
    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let color = contacts[i]['color'];
    let initial = initials[i];
    
    return /*html*/`
    <div class="contact_big_mobile flex juststart fdc">
            <div class="flex align fdr">
                <div style="background-color:${color}" id="usercircle${i}" class="usercircle_Mobile">${initial}</div>
                    <div class="flex juststart alignstart fdc gap5">          
                        <div class="FS36-400">${name}</div>
                        <div onclick="addNewTaskFromContacts(${i},'todo')" class="FS16-400 lightblue cursor">+ Add Task</div>
                    </div>
            </div>
            <div class="flex align fdr">
                <div class="flex align fdr gap59">
                    <div class="FS20-400">Contact Information</div>
                </div>
            </div>
            <p class="FS16-700">Email</p>
            <a class="FS16-400 lightblue" href="mailto:${email}">${email}</a>
            <p class="FS16-700">Phone</p>
            <div class="FS16-400">${phone}</div>
            <div class="icon_container">
                <div onclick="deleteContact(${i})" class="trash-container"><img class="icon_mobile_Trashcan"src="../assets/icons/icon_contact_trashcan.svg"></div>
                <div onclick="showMobileEditContactCard(${i})" class="pencil-container"><img class="icon_mobile_Pencil" src="../assets/icons/icon_contact_pencil_white.svg"><div>
            </div>
        `;
}
/**
 * Template for the Function which renders the "Edit Contact" container
 * @param {number} i - This is the index of an existing contact
 */
function renderEditContactTemplate(i) {
    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let initial = initials[i];
    let color = contacts[i]['color'];
    editContactRight_left = document.getElementById('editContactRight_left');
    editContactRight_left.innerHTML = '';
    editContactRight_left.innerHTML += `<div style="background-color:${color}" id="usercircle${i}" class="usercircle_edit_contact">${initial}</div>`;
    return /*html*/`
    <img onclick="hideEditContactCard();closeOverlay();" class="close_symbol_edit" src="../assets/icons/icon_add_contact_X.svg">
                    <form id="form_edit_contact" class="editContactRight_right" onsubmit="editContact(${i});closeOverlay();return false;">
                        <input class="inputDesktop" id="edit-name" type="text" value="${name}" required pattern="[A-Z][a-zA-Z ]*">
                        <input class="inputDesktop" id="edit-email" type="email" value="${email}" required>
                        <input class="inputDesktop" id="edit-phone" type="tel"  value="${phone}" required pattern="[0-9]+">
                            <div class="flex">
                                <button type="button" onclick="deleteContact(${i});closeOverlay()" class="delete_btn">Delete</button>
                                <button type="submit" class="save_btn">Save</button>
                            </div>
                            <img class="icon-name-add-contact" src="../assets/icons/icon_add_contact_user.svg" alt="">
                            <img class="icon-email-add-contact" src="../assets/icons/icon_add_contact_mail.svg" alt="">
                            <img class="icon-phone-add-contact" src="../assets/icons/icon_add_contact_phone.svg" alt="">
                    </form>
    `;
}
/**
 * Template for the Function which renders the MOBILE "Edit Contact" container
 * @param {number} i - This is the index of an existing contact
 */
function renderEditContactMobileTemplate(i) {
    let name = contacts[i]['name'];
    let email = contacts[i]['email'];
    let phone = contacts[i]['phone'];
    let initial = initials[i];
    let color = contacts[i]['color'];

    editContactRight_left = document.getElementById('editContactRight_mobile_usercircle');
    editContactRight_left.innerHTML = '';
    editContactRight_left.innerHTML += `<div style="background-color:${color}" id="usercircle${i}" class="usercircle_edit_contact addContactImg">${initial}</div>`;

    return /*html*/`
    <form id="form_edit_contact_mobile" class="editContactBottomMobileDown" onsubmit="editContact(${i});hideMobileEditContactCard();return false;">
        <input class="inputMobile" id="edit-name" type="text" value="${name}" required pattern="[A-Z][a-zA-Z ]*">
        <input class="inputMobile" id="edit-email" type="email" value="${email}" required>
        <input class="inputMobile" id="edit-phone" type="tel"  value="${phone}" required pattern="[0-9]+">
            <div class="btn_mobile_edit_contact">
                <button onclick="deleteContact(${i});closeOverlayMobile()" class="delete_btn">Delete</button>
                <button type="submit" class="save_btn">Save</button>
            </div>
            <img class="icon-name-edit-contact-mobile" src="../assets/icons/icon_add_contact_user.svg" alt="">
            <img class="icon-email-edit-contact-mobile" src="../assets/icons/icon_add_contact_mail.svg" alt="">
            <img class="icon-phone-edit-contact-mobile" src="../assets/icons/icon_add_contact_phone.svg" alt="">
    </form>
`;
}
/**
 * Template for Asynchronous function renders all existing contacts
 */
function renderContactsTemplate (i) {
    const element = sortedalphabetically[i];
        let name = element['name'];
        let email = element['email'];
        let phone = element['phone'];
        let initial = initials[i];
        let color = element.color;
    if (!color) {
        color = assignRandomColorToDiv(i);
        element.color = color;
    }

    return /*html*/`
    <div style="background-color:${color}" id="usercircle${i}" class="usercircle_small">${initial}</div>
    <div>
        <div class="FS21-400">${name}</div>
        <div>
        <a class="FS16-400" href="mailto:${email}">${email}</a>
        </div>
    </div>`;
}

