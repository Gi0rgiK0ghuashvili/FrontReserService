export function validatedName(inputElement) {

    inputElement.classList.remove("is-invalid");

    if (!inputElement.checkValidity()) {
        inputElement.classList.add("is-invalid");
        return false;
    }
    return true;
}