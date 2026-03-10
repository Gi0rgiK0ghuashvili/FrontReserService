const MenuState = {

    selectedMenuId: null,
    selectedCategoryId: null,

    selectedMenus: [],
    selectedCategories: [],
    selectedItems: [],

    categoryDiscounts: {},

    orderLines: []

};

export const orderState = {
    menus: [],
    items: [],
    discounts: {},
    guest: {
        name: '',
        phone: '',
        date: null
    },
    payment: {
        total: 0,
        prepayment: 0,
        vatEnabled: false
    }
};

// export const MenuState = {
//     selectedMenuIds: [],
//     orderLines: []
// };