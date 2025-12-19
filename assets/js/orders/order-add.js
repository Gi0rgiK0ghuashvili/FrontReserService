import { getRequest } from "../Commons/requests.js";

document.addEventListener("DOMContentLoaded", () => {
    const addItemsButton = document.getElementById("add-items-button");
    const guestHalss = document.getElementById("guest-hall");
    const guestCategories = document.getElementById("guest-category");
    const guestItems = document.getElementById("guest-item");


    setItemsInSelect();
    addItemsButton.addEventListener("click", (event) => {

        //addItemInOrder(event);
    });

    guestHalss.addEventListener("change", (event) => {
        const selectedOption = changedItem(event);
        console.log("Changed Item: ", selectedOption);
    });

    guestCategories.addEventListener("change", (event) => {
        const selectedOption = changedItem(event);
        const select = event.target;
        //const drinkOptions = event.target.querySelectorAll(`option[category="${select.dataset.categoryGeo}"]`);
        const drinkOptions = [...select.options].filter(
            opt => opt.dataset.categoryGeo === selectedOption.categoryGeo);
        console.log(drinkOptions);

        drinkOptions.forEach(option => {
            console.log("option.dataset.categoryGeo", option.dataset.categoryGeo);
            console.log("option.dataset.categoryEng", option.dataset.categoryEng);
            console.log("option.dataset.nameGeo", option.dataset.nameGeo);
            console.log("option.dataset.nameEng", option.dataset.nameEng);
            console.log("option.dataset.price", option.dataset.price);

            guestItems.appendChild(option);

        });
        console.log("Changed Item: ", selectedOption);

});


guestItems.addEventListener("change", (event) => {
    const selectedOption = changedItem(event);
    console.log("Changed Item: ", selectedOption);

});

});

function changedItem(event) {
    return event.target.options[event.target.selectedIndex];
}

function addItemInOrder(event) {

    const guestName = document.getElementById("add-guestName");
    const guestPhone = document.getElementById("add-guestPhone");
    const guestEmail = document.getElementById("add-guestEmail");

    const guestReservationDate = document.getElementById("add-guestReservationDate");
    const guestReservationTime = document.getElementById("add-guestReservationTime");
    const guestsNumber = document.getElementById("add-guestsNumber");
    const guestHall = document.getElementById("add-guestHall");
    const guestHallArrangement = document.getElementById("add-guestHallArrangement");

}

function checkInputs() {

}

async function setItemsInSelect() {
    const guestHalss = document.getElementById("guest-hall");
    const guestCategories = document.getElementById("guest-category");
    const guestItems = document.getElementById("guest-category");

    const halls = await getRequest("hall", "getHall");

    if (halls.statusCode === 200) {
        halls.value.forEach((item) => {

            const option = createOption(item.nameGeo, item.nameEng);
            guestHalss.appendChild(option);

        });
    }

    const items = await getRequest("items", "getItems");

    if (items.statusCode === 200) {

        items.value.forEach((item) => {
            const option = createItemOption(item.categoryGeo, item.categoryEng, item.nameGeo, item.nameEng, item.price);
            guestCategories.appendChild(option);
        });
    }

}

function createItemOption(categoryGeo, categoryEng, nameGeo, nameEng, price = 0) {
    const option = document.createElement("option");

    option.setAttribute("value", categoryGeo);
    option.setAttribute("data-category-geo", categoryGeo);
    option.setAttribute("data-category-eng", categoryEng);
    option.setAttribute("data-name-geo", nameGeo);
    option.setAttribute("data-name-eng", nameEng);
    option.setAttribute("data-price", price);
    option.textContent = categoryGeo;

    return option;
}

function createOption(valueGeo, valueEng) {
    const option = document.createElement("option");

    option.setAttribute("value", valueGeo);
    option.setAttribute("data-value-geo", valueGeo);
    option.setAttribute("data-value-eng", valueEng);
    option.textContent = valueEng;

    return option;
}