(function activateAddButton() {

    const modalEl = document.getElementById("add-fullscreenModal");

    if (!modalEl) {
        return;
    }

    console.log("modalEl: ", modalEl);

    const modal = new bootstrap.Modal(modalEl);

    const hideButton = document.getElementById("hide-add-modal");
    if(!hideButton){
        return;
    }

    console.log("hideButton: ", hideButton);

    document.getElementById('add-button').addEventListener('click', () => {
        modal.show();
    });

    hideButton.addEventListener('click', () => {
        modal.hide();
    });

})();