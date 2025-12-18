export function createTd(value, isBold = false) {
    const td = document.createElement("td");

    td.textContent = value;
    td.setAttribute("data-value", value);
    td.classList = "text-center";
    if (isBold === true) {
        td.classList.add("fw-bold");
    }

    return td;
}

export function createDateTimeTd(date, time = null, isBold = false) {
    const td = document.createElement("td");
    const divDate = document.createElement("div");
    const divTime = document.createElement("div");

    divDate.textContent = date;
    divDate.setAttribute("data-value", date);
    divDate.classList = "text-center";
    if (isBold === true) {
        divDate.classList.add("fw-bold");
    }
    td.appendChild(divDate);

    if (time !== null) {
        divTime.textContent = time;
        divTime.setAttribute("data-value", time);
        divTime.classList = "text-center";
        if (isBold === true) {
            divTime.classList.add("fw-bold");
        }
        td.appendChild(divTime);
    }

    return td;
}

export function createGuestTd(fullname, email = null, phone = null, isBold = false) {
    const td = document.createElement("td");
    const divFullname = document.createElement("div");
    const divEmail = document.createElement("div");
    const divPhone = document.createElement("div");


    divFullname.textContent = fullname;
    divFullname.setAttribute("data-fullname", fullname);
    divFullname.classList = "text-center";
    if (isBold === true) {
        divFullname.classList.add("fw-bold");
    }
    td.appendChild(divFullname);

    if (email !== null) {
        divEmail.textContent = email;
        divEmail.setAttribute("data-email", email);
        divEmail.classList = "text-center";
        if (isBold === true) {
            divEmail.classList.add("fw-bold");
        }
        td.appendChild(divEmail);
    }

    if (phone !== null) {
        divPhone.textContent = phone;
        divPhone.setAttribute("data-phone", phone);
        divPhone.classList = "text-center";
        if (isBold === true) {
            divPhone.classList.add("fw-bold");
        }
        td.appendChild(divPhone);
    }
    return td;
}

export function createEmployeeTd(fullname, email = null, phone = null, isBold = false) {
    const td = document.createElement("td");
    const divFullname = document.createElement("div");
    const divEmail = document.createElement("div");
    const divPhone = document.createElement("div");


    divFullname.textContent = fullname;
    divFullname.setAttribute("data-fullname", fullname);
    divFullname.classList = "text-center";
    if (isBold === true) {
        divFullname.classList.add("fw-bold");
    }
    td.appendChild(divFullname);

    if (email !== null) {
        divEmail.textContent = email;
        divEmail.setAttribute("data-email", email);
        divEmail.classList = "text-center";
        if (isBold === true) {
            divEmail.classList.add("fw-bold");
        }
        td.appendChild(divEmail);
    }

    if (phone !== null) {
        divPhone.textContent = phone;
        divPhone.setAttribute("data-phone", phone);
        divPhone.classList = "text-center";
        if (isBold === true) {
            divPhone.classList.add("fw-bold");
        }
        td.appendChild(divPhone);
    }
    return td;
}

export function createStatusTd(value, isBold = false) {
    const td = document.createElement("td");
    const selectOrderStatus = document.createElement("select");

    const optionPending = createOption("მიმდინარე", "pending", value);
    const optionReturn = createOption("დაბრუნებული", "return", value);
    const optionCompleted = createOption("დასრულებული", "completed", value);
    const optionCanceled = createOption("გაუქმებული", "canceled", value);


    //selectOrderStatus.classList = "text-center";
    selectOrderStatus.classList.add("status-select");
    selectOrderStatus.addEventListener("change", (event) => { changedSelectedStatus(event) });
    selectOrderStatus.setAttribute("data-template", value);
    selectOrderStatus.setAttribute("data-original", value);

    if (isBold === true) {
        selectOrderStatus.classList.add("fw-bold");
    }
    selectOrderStatus.appendChild(optionPending);
    selectOrderStatus.appendChild(optionReturn);
    selectOrderStatus.appendChild(optionCompleted);
    selectOrderStatus.appendChild(optionCanceled);

    td.appendChild(selectOrderStatus);
    return td;
}

function changedSelectedStatus(event) {
    console.log("this is firs log");
    console.log(event.target);
}

export function createOption(textContent, value, data) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    option.selected = value === data;

    return option;
}