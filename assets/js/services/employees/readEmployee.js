

export function buildEmployeeObject() {
    const employee = {
        name: document.getElementById("add-name").value.trim(),
        surname: document.getElementById("add-surname").value.trim(),
        userName: document.getElementById("add-username").value.trim(),
        email: document.getElementById("add-email").value.trim(),
        phoneNumber: document.getElementById("add-phoneNumber").value.trim(),
        role: document.getElementById("add-userRole").value,
        password: document.getElementById("add-password").value,
        confirmPassword: document.getElementById("add-confirmPassword").value
    };

    if (employee.name === null) {
            alert("სახელი ცარიელია.");
            return;
        }
        if (employee.surname === null) {
            alert("გვარი არასწორია.");
            return;
        }

        if (employee.password != employee.confirmPassword) {
            alert("განმეორებითი პაროლი არასწორია.");
            return;
        }


    return employee;
}