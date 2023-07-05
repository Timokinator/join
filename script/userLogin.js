let users = [];


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


function logIn() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        console.log(user);
    } else {
        console.warn('User nicht gefunden');
    }
}