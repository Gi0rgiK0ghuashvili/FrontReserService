export function showActionButtons(isHidden = false){
    const pdfButton = document.getElementById("export_pdf");
    const excelButton = document.getElementById("export_excel");
    const saveChangesButton = document.getElementById("add-saveChanges");

    if(pdfButton){
        pdfButton.hidden = isHidden;
    }
    if(excelButton){
        excelButton.hidden = isHidden;
    }
    if(saveChangesButton){
        saveChangesButton.hidden = isHidden;
    }
}