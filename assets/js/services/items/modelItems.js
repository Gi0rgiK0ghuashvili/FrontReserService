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

