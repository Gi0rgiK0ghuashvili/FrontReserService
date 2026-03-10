export function handleKeyup(event) {
    if (event.key !== 'Enter') return;

    const input = event.target;

    const percent = parseFloat(input.value) || 0;
    const hall = input.dataset.hall;
    const category = input.dataset.category;

    const categoryTotal = calculateCategoryTotal(hall, category);

    const result = DiscountLogic.calculate(categoryTotal, percent);

    DiscountUI.updateCategoryFinalAmount(
        hall,
        category,
        result.finalAmount
    );

    MenuState.categoryDiscounts[`${hall}|${category}`] = result.discountAmount;
}

return {
    handleKeyup
};