export function createSelectObject(selectId) {
    const selectedHall = document.getElementById(selectId);
    if(!selectedHall)
    {
        return null;
    }
    const selectedOption = selectedHall.options[selectedHall.selectedIndex];
    const menu = {
        id: selectedOption.dataset.id,
        nameGeo: selectedOption.dataset.nameGeo,
        nameEng: selectedOption.dataset.nameEng
    }

    return menu;
}

export function getSelectedDataId(selectId) {
    const selectedHall = document.getElementById(selectId);
    if(!selectedHall)
    {
        return null;
    }
    
    const selectedOption = selectedHall.options[selectedHall.selectedIndex];
    const menu = {
        id: selectedOption.dataset.id,
        nameGeo: selectedOption.dataset.nameGeo,
        nameEng: selectedOption.dataset.nameEng
    }

    return menu;
}