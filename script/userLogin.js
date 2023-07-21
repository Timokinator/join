
let users = [];
let currentUser = [];
let guestUser = [];


async function loadSavedUsers() {
    if (users != null) {
        users = JSON.parse(await getItem('users'));
    }
}


async function register() {
    let userName = document.getElementById('inputName');
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword').value;
    let confirmPassword = document.querySelector('.confirmPasswordBox').value;

    if (password === confirmPassword) {
        users.push({
            email: email.value,
            password: password,
            name: userName.value
        })

        await setItem('users', JSON.stringify(users));
        resetForm(userName, email, password);
        users = JSON.parse(await getItem('users'));
        window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
    } else {
        alert("Password and confirm password don't match!");
        password.value = '';
        confirmPassword.value = '';
        return;
    }




}

function resetForm(userName, email, password) {
    email.value = '';
    password.value = '';
    userName.value = '';
}

function loadLogInHTML() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    const password = urlParams.get('password');
    let msgBox = document.querySelector('.msgBox');

    if (msg) {
        msgBox.classList.remove('visible');
        msgBox.innerHTML = 'Du hast dich erfolgreich Registriert';
    } else {
        msgBox.classList.add('visible');
    }

    if (password) {
        msgBox.classList.remove('visible');
        msgBox.innerHTML = 'Du hast dein Password erfolgreich zurückgesetzt';
    } else {
        msgBox.classList.add('visible');
    }

}


async function init() {
    loadUsers();
}


async function getUsersInfo() {
    loadUsers();
}


async function getUserData() {
    loadUsers();
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * This function search for User Data and than tried with that data to log in in to JOIN
 * @date 7/15/2023 - 9:37:56 AM
 *
 */
async function logIn() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        await setItem('user', JSON.stringify(user));
        currentUser = JSON.parse(await getItem('user'));
        window.location.href = 'summary.html';
        email.value = '';
        password.value = '';
    } else {
        failedLogIn(email, password);
    }
}

let counter = 0;

function failedLogIn(email, password) {
    let warningbox = document.querySelector('.warningBox');
    let counterBox = document.querySelector('.counter');
    if (counter < 2) {
        warningbox.style.display = 'block';
        counterBox.textContent = counter + 1 + `/3 Versuchen`;
        counter++
        email.value = '';
        password.value = '';
    } else {
        window.location.href = 'forgetPassword.html';
        counter = 0;
    }
}

async function guestLogIn() {
    if (guestUser != null) {
        currentUser = JSON.parse(await getItem('user'));
        guestUser.push(currentUser);
        guestUser = [];
        await setItem('user', JSON.stringify(guestUser));
        window.location.href = 'summary.html';
    } else {
        window.location.href = 'summary.html';
    }
}


async function sendEmail() {
    let forgotEmail = document.getElementById('email');
    let hidenBox = document.querySelector('.forgotPasswordBox');
    let user = await users.find(u => u.email == forgotEmail.value);
    if (user == undefined) {
        console.log('user nicht gefunden');
        hidenBox.style.display = 'block';
    } else {
        window.location.href = 'resetPassword.html'
        console.log(user);
    }
}


function resetPassword() {
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword == confirmPassword) {
        window.location.href = 'login.html?password=dein Password wurde erfolgreich zurueckgesetzt';
        newPassword.value = '';
        confirmPassword.value = '';
    } else {
        document.querySelector('.resetBox').style.display = 'block';
        newPassword.value = '';
        confirmPassword.value = '';
    }
}


