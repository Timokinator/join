let users = [];
let currentUser = [];


async function loadSavedUsers() {
    if(users != null) {
    users = JSON.parse(await getItem('users'));
    }
}

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

    users = JSON.parse(await getItem('users'));
    

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

async function init(){
    loadUsers();
}

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}



async function logIn() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    

    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user && navigator.onLine) {
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
        console.log(counter);
    } else {
        window.location.href = 'forgetPassword.html';
        counter = 0;
    }
}

async function loadUserData() {
   await getUserData();
}

async function getUserData(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}


 function sendEmail() {
    let forgetEmail = document.getElementById('forgetEmail');
    let hidenBox = Document.querySelector('.forgotPasswordBox');
    let user =  users.find(u => u.email == forgetEmail.value );
    console.log(users);
    if(user == undefined) {
        console.log('user nicht gefunden');
        hidenBox.style.display = 'block';

    } else {
        console.log(user);
    }
}

