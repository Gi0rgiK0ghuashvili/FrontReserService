
export async function readInputsCategory(){

    const nameGeoElement = document.getElementById("add-category-name-geo");
    const nameEngElement = document.getElementById("add-category-name-eng");

    if(!nameGeoElement || !nameEngElement){
        console.error("Name Geo: ", nameGeoElement, "Name Eng: ", nameEngElement);
        return;
    }
    const category = {
        nameGeo: nameGeoElement.value,
        nameEng: nameEngElement.value,
    };
    return category;

}