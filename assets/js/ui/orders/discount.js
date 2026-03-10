
 const DiscountLogic = (() => {

    function calculate(categoryTotal, percent) {
        const discountAmount = (categoryTotal * percent) / 100;
        const finalAmount = Math.max(0, categoryTotal - discountAmount);

        return {
            discountAmount,
            finalAmount
        };
    }

    return { calculate };

})();

