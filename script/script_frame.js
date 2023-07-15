async function includeHtml() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found'
        };
    };
};


function toSummary() {
    window.location.href='../html/summary.html'
};


function openSubmenu(resolution) {
    let content = document.getElementById('container_submenu_user');
    content.classList.remove('d-none');

    if (resolution == 'desktop') {
    content.innerHTML = renderSubmenuDesktop();
    } else if (resolution == 'mobile') {
    content.innerHTML = renderSubmenuMobile();
    setTimeout(() => {
        closeSubmenu();
    }, 2500);
    };
};


function renderSubmenuDesktop() {
    return /*html*/`
        <div onclick="closeSubmenu()" class="submenu">
            <a href="../html/index.html">Log out</a>
        </div>
    `;
};


function renderSubmenuMobile() {
    return /*html*/`
        <div class="submenu">
            <a href="../html/help.html">Help</a>
            <a href="../html/legal_notice.html">Legal Notice</a>
            <a href="../html/index.html">Log out</a>
        </div>
    `;
};


function closeSubmenu() {
    let content = document.getElementById('container_submenu_user');
    content.classList.add('d-none');
};


