/* import {setItem} from '../script/storage.js';
import {getItem} from '../script/storage.js'; */

let users = [];


async function register() {
    let name = document.getElementById('inputName');
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');

    users.push({
        email: email.value,
        password: password.value,
        name: name.value
    })

}

