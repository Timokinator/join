

let currenrUserInitials = [];

async function loadInitials() {
    try {
        const user = await getItem('user');
        if (user) {
            currenrUserInitials = JSON.parse(user);
            loadUserInitials2();
        }
    } catch (e) {
        console.warn('Fehler ist ' + e);
    }
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} - The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Loads the logged-in user's data and displays the username on the summary view.
 */
async function loadUserInitials2() {
    let currentUser = await currenrUserInitials.name;
    const names = currentUser.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase());
    const newInitials = initials.join(' ');
    const withoutSpaces = newInitials.replace(/\s/g, '');


    let userBox = document.querySelector('.userInitials');
    let userMobileBox = document.querySelector('.userInitialsMobile');

    if (currentUser) {
        userBox.innerHTML = capitalizeFirstLetter(withoutSpaces);
        userMobileBox.innerHTML = capitalizeFirstLetter(withoutSpaces);
    } else {
        userBox.innerHTML = 'G';
        userMobileBox.innerHTML = 'G';
    }
}

