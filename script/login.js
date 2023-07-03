const myTimeout = setTimeout(removeLandingImg, 1000);

function removeLandingImg() {
    const landingPageImg = document.querySelector('.landingPageImg');
    const landingImg = document.querySelector('.landingImg');
    landingPageImg.classList.add('d-none');
    landingImg.classList.add('d-none');
    loadLoginPage();
}

function loadLoginPage() {
    location.replace('http://127.0.0.1:5500/join/html/login.html');
}
