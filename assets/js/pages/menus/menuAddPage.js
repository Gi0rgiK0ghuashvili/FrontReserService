import { initializeEditableTable, addMenuHeaderButtonEvent, addItemButtonEvent, selectMenuButtonEvent, addSaveChangesButtonEvent, activeItemElements } from "../../services/menus/eventMenus.js";
import { getMenus } from "../../services/menus/renderMenuTable.js";
import { showMenuInTable, selectedMenuChangeSelectedEvent } from "../../services/menus/viewMenu.js";

getMenus();
addMenuHeaderButtonEvent();
addItemButtonEvent();
selectMenuButtonEvent();
addSaveChangesButtonEvent();
activeItemElements(false);
showMenuInTable();
selectedMenuChangeSelectedEvent();

document.addEventListener('DOMContentLoaded', function () {

  const collapseElement = document.getElementById('menuCreateCollapse');
  const headerElement = document.getElementById('menuCreateHeader');

  if (!collapseElement || !headerElement) return;

  // საწყისი მდგომარეობის გასწორება
  if (collapseElement.classList.contains('show')) {
    headerElement.classList.remove('collapsed');
  } else {
    headerElement.classList.add('collapsed');
  }

  // როცა იხსნება
  collapseElement.addEventListener('show.bs.collapse', function () {
    headerElement.classList.remove('collapsed');
  });

  // როცა იკეცება
  collapseElement.addEventListener('hide.bs.collapse', function () {
    headerElement.classList.add('collapsed');
  });
  initializeEditableTable("tableBody");
  
});
