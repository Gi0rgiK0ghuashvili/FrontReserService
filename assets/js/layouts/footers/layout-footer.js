// ამჟამინდელი თარიღის მიღება
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('ka-GE', options); // ქართულ ფორმატში

// ელემენტის მოძებნა ID-ით
const footer = document.getElementById("footer");
const div = document.createElement("div");
const span = document.createElement("span");
const divDate = document.createElement("div");
const strong = document.createElement("strong");

div.classList = "copyright";
div.textContent = "Copyright ";

span.textContent = "GMT Hospitality";
strong.appendChild(span);
div.appendChild(strong);

divDate.classList = "today";
divDate.textContent = formattedDate;
div.appendChild(divDate);
footer.appendChild(div);
