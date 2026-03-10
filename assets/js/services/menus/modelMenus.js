export class Menu {
    constructor() {
        this.nameGeo = null;
        this.nameEng = null;
        this.description = null;
        this.phoneNumber = null;

        this.items = [];
    }
}

export class OrderMenu{
    constructor(){
        this.id = null;
        this.nameGeo = null;
        this.nameEng = null;
        this.description = null;
        this.phoneNumber = null;
    }
}

export class Item {
    constructor({
        categoryGeo = null,
        categoryEng = null,
        nameGeo = null,
        nameEng = null,
        price = null
    } = {}) {
        this.categoryGeo = categoryGeo;
        this.categoryEng = categoryEng;
        this.nameGeo = nameGeo;
        this.nameEng = nameEng;
        this.price = price;
    }
}

export class Notification {
    constructor({
        menuNotification = "menu-notification",
        selectedMenuNotification = "selected-menu-notification",
        itemNotification = "item-notification",
        saveChanges = ""
    } = {}) {
        this.menuNotification = menuNotification;
        this.selectedMenuNotification = selectedMenuNotification;
        this.itemNotification = itemNotification;
        this.saveChanges = saveChanges;
    }
}