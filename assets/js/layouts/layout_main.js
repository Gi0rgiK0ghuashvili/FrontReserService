function loadLayout(id, url) {
    fetch(url)
        .then(r => r.text())
        .then(html => document.getElementById(id).innerHTML = html);
}

