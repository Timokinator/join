let loggedInUser = [];

async function loadUserData() {
    loggedInUser = JSON.parse(await getItem('users'));
    console.log(loggedInUser);
}