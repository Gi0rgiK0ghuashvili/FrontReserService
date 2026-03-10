const DiscountUI = (() => {

    function updateCategoryFinalAmount(hall, category, amount) {
        const element = document.querySelector(
            `[data-category="${category}"][data-hall="${hall}"].category-final-amount`
        );

        if (element) {
            element.textContent = amount.toFixed(2) + ' ₾';
        }
    }

    return {
        updateCategoryFinalAmount
    };

})();