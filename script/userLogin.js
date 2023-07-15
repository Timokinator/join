let users = [];
let currentUser = [];


async function register() {
    let userName = document.getElementById('inputName');
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');

    users.push({
        email: email.value,
        password: password.value,
        name: userName.value
    })

    await setItem('users', JSON.stringify(users));
    resetForm(userName, email, password);

    window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
    loadLogInHTML();
}

function resetForm(userName, email, password) {
    email.value = '';
    password.value = '';
    userName.value = '';
}


function loadLogInHTML() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get(msg);
    if (msg) {
        let msgBox = document.querySelector('.msgBox');
        msgBox.classList.remove('visible');
    }

}
async function getUsersInfo() {
    loadUsers()
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


async function logIn() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
<<<<<<< HEAD
    

    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user && navigator.onLine) {
=======
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log(user);
        currentUser.push(user);
>>>>>>> a678ec0495fd691cad955ee40c5fcab15a9a0bca
        await setItem('user', JSON.stringify(user));
        currentUser = JSON.parse(await getItem('users'));
        console.log(currentUser);
    } else {
        console.warn('User nicht gefunden');
        failedLogIn(email, password);
    }
}

let counter = 0;

function failedLogIn(email, password) {
    let warningbox = document.querySelector('.warningBox');
    let counterBox = document.querySelector('.counter');
    if (counter < 3) {
        warningbox.style.display = 'block';
        counterBox.textContent = counter + 1 + `/3 Versuchen`;
        counter++
        email.value = '';
        password.value = '';
        console.log(counter);
    } else {
        window.location.href = 'forgetPassword.html';
        counter = 0;
    }
}