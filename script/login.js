const myTimeout = setTimeout(removeLandingImg, 1000);

function removeLandingImg() {
    const landingPageImg = document.querySelector('.landingPageImg');
    const landingImg = document.querySelector('.landingImg');
    landingPageImg.classList.add('d-none');
    landingImg.classList.add('d-none');
    window.location.href = '../login.html';
}

