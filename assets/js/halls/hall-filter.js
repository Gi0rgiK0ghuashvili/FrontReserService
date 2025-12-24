
import { getRequest, logException, setRequest } from "../Commons/requests.js";
import { generateButtonGroup } from "../Commons/actionButtons.js";

// ვარენდერებს ცხრილს მოცემული ელემენტის ID-ის მიხედვით
async function renderTableById(items, elementId) {
    console.log('=== renderTableById called ===');
    console.log('Items to render:', items?.length);

    try {
        if (elementId !== 'tableBody')
            return;

        const tableBody = document.getElementById(elementId);
        console.log('Table body element:', tableBody);

        if (!tableBody) {
            console.error(' tableBody element not found!');
            return;
        }

        console.log('Clearing table...');
        tableBody.innerHTML = "";

        if (!items) {
            console.warn(' No items provided');
            return;
        }

        if (!Array.isArray(items)) {
            console.error(' Items is not an array:', typeof items);
            throw items;
        }

        console.log(`Creating ${items.length} table rows...`);

        items.forEach((item, index) => {
            console.log(`Creating row ${index + 1}:`, item);
            const tr = document.createElement("tr");
            const tdNameGeo = document.createElement("td");
            const tdNameEng = document.createElement("td");
            const tdLocationGeo = document.createElement("td");
            const tdLocationEng = document.createElement("td");
            const tdDescription = document.createElement("td");
            const tdPhoneNumber = document.createElement("td");

            tdNameGeo.textContent = item.nameGeo ?? '-';
            tdNameEng.textContent = item.nameEng ?? '-';
            tdLocationGeo.textContent = item.locationGeo ?? '-';
            tdLocationEng.textContent = item.locationEng ?? '-';
            tdDescription.textContent = item.description ?? '-';
            tdPhoneNumber.textContent = item.phoneNumber ?? '-';

            tr.appendChild(tdNameGeo);
            tr.appendChild(tdNameEng);
            tr.appendChild(tdLocationGeo);
            tr.appendChild(tdLocationEng);
            tr.appendChild(tdDescription);
            tr.appendChild(tdPhoneNumber);

            tr.setAttribute("data-id", item.id);

           // ვამატებს მოქმედების ღილაკების ჯგუფს
            const td = generateButtonGroup(item);
            tr.appendChild(td);
            tableBody.appendChild(tr);
        });

        console.log(` Rendered ${items.length} rows to table`);
    }
    catch (exception) {
        console.error("Rendering error:", exception);
        await logException({
            message: exception.message ?? String(exception),
            source: "hallSearch.js",
            operationType: "render-table"
        });
    }
}


// ვტვირთავს ყველა დარბაზს და აჩვენებს ცხრილში

async function loadAllHalls() {
    console.log('=== Loading all halls ===');

    try {
        // მომაქ დარბაზების API
        const res = await getRequest('hall', 'getHall');
        const allHalls = res?.value ?? [];

        if (!Array.isArray(allHalls)) {
            console.warn('Expected array of halls, got:', typeof allHalls);
            return [];
        }

        
        await renderTableById(allHalls, 'tableBody');
        console.log('Loaded', allHalls.length, 'halls');
        return allHalls;
    }
    catch (ex) {
        console.error('Error loading halls:', ex);
        return [];
    }
}

/**
ვძებნის დარბაზებს მომხმარებლის შეყვანილი ტექსტის მიხედვით
@return {Array} - ფილტრირებული დარბაზების მასივი

 */
async function hallSearch() {
    console.log('=== hallSearch started ===');

    // ვიღებ საძიებო ტექსტს
    const searchInput = document.querySelector('.search-form input[name="query"]');
    const searchQuery = searchInput?.value.trim().toLowerCase() ?? '';
    console.log('Search query:', searchQuery);

    try {
        
        console.log('Fetching halls from API...');
        const res = await getRequest('hall', 'getHall');
        console.log('API Response:', res);

        
        const allHalls = res?.value ?? [];
        console.log('All halls count:', allHalls.length);

        if (!Array.isArray(allHalls)) {
            console.warn('Expected array of halls, got:', typeof allHalls);
            return [];
        }

        // თუ საძიებო ტექსტი ცარიელია, ვაჩვენებ ყველა დარბაზს
        if (!searchQuery) {
            console.log('Empty search query - showing all halls');
            await renderTableById(allHalls, 'tableBody');
            return [];
        }

        // კლიენტური ფილტრაცია
        console.log('Applying search filter...');
        const filteredHalls = allHalls.filter(hall => {
            // ვამოწმებ ყველა შესაბამის ატრიბუტს
            const nameGeoMatch = hall.nameGeo?.toLowerCase().includes(searchQuery);
            const nameEngMatch = hall.nameEng?.toLowerCase().includes(searchQuery);
            const locationGeoMatch = hall.locationGeo?.toLowerCase().includes(searchQuery);
            const locationEngMatch = hall.locationEng?.toLowerCase().includes(searchQuery);
            const descriptionMatch = hall.description?.toLowerCase().includes(searchQuery);
            const phoneNumberMatch = hall.phoneNumber?.includes(searchQuery);

            // თუ ემთხვევა რომელიმე, ვაბრუნებ შედეგს
            return nameGeoMatch || nameEngMatch || locationGeoMatch ||
                   locationEngMatch || descriptionMatch || phoneNumberMatch;
        });

        console.log('Filtered halls count:', filteredHalls.length);
        console.log('Filtered halls:', filteredHalls);

        // ვარენდერებ ფილტრირებულ შედეგებს
        await renderTableById(filteredHalls, 'tableBody');
        console.log('=== hallSearch completed ===');

        
        return filteredHalls;
    }
    catch (ex) {
        console.error('Search error:', ex);
        await logException({
            message: ex.message ?? String(ex),
            source: 'hallSearch',
            operationType: 'search'
        });
        alert('დაფიქსირდა პრობლემა მონაცემების ჩატვირთვისას.');
        return []; // ცარი მასივი შეცდომის შემთხვევაში
    }
}

/**
 * ჰარდაზის ობიექტი დამატებისთვის
 */
class Hall {
    constructor() {
        this.nameGeo = null;
        this.nameEng = null;
        this.locationGeo = null;
        this.locationEng = null;
        this.description = null;
        this.phoneNumber = null;
    }
}

/**
 * აჩენს შეტყობინებას დამატების ფორმის ქვემოთ
 * @param {string} notification - შეტყობინების ტექსტი
 * @param {boolean} succeed - წარმატების ინდიკატორი     
 */
function showMessage(notification, succeed = false) {
    const message = document.getElementById('add-message');
    if (!message) return;

    message.textContent = notification;
    message.style.color = succeed ? 'green' : 'red';
    message.classList.add('text-center');
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('Hall search initialized');

   // ვიცავ ფორმების სუბმიტის თავიდან აცილებას
    const allForms = document.querySelectorAll('form');
    console.log('Found forms:', allForms.length);
    allForms.forEach((form, index) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submission prevented for form', index);
            return false;
        });
    });

    console.log('Loading initial halls...');
    loadAllHalls();

   
    const searchInput = document.querySelector('.search-form input[name="query"]');
    const searchButton = document.querySelector('.search-form button[type="submit"]');

    console.log('Search input found:', searchInput);
    console.log('Search button found:', searchButton);

    if (searchButton) {
        // ვადებ ღილაკს საძიებო ფუნქციას
        searchButton.addEventListener('click', async (e) => {
            console.log('Search button clicked');
            e.preventDefault();
            // ვფილტრავ შედეგებს
            const filteredHalls = await hallSearch();
            console.log('🔍 Search returned', filteredHalls.length, 'matching halls');
            console.log('📦 Filtered hall objects:', filteredHalls);
        });
    } else {
        console.warn('⚠️ Header search button not found!');
    }

    if (searchInput) {
    
        searchInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in search');
                e.preventDefault();

                // ვფილტრავ შედეგებს
                const filteredHalls = await hallSearch();
                console.log('🔍 Search returned', filteredHalls.length, 'matching halls');
                console.log('📦 Filtered hall objects:', filteredHalls);
            }
        });
    } else {
        console.warn('⚠️ Header search input not found!');
    }

    // ვადებ ღილაკს ფუნქციას,  დარბაზის დამატებისთვის
    const addButton = document.getElementById('add-button');
    if (addButton) {
        console.log('Add button found, attaching event listener');
        addButton.addEventListener('click', async (e) => {
            console.log('Add button clicked');
            e.preventDefault();

            const hallData = new Hall();

            hallData.nameGeo = document.getElementById('add-hall-name-geo').value.trim();
            hallData.nameEng = document.getElementById('add-hall-name-eng').value.trim();
            hallData.locationGeo = document.getElementById('add-hall-location-geo').value.trim();
            hallData.locationEng = document.getElementById('add-hall-location-eng').value.trim();
            hallData.description = document.getElementById('add-hall-description').value.trim();
            hallData.phoneNumber = document.getElementById('add-hall-phoneNumber').value.trim();

            console.log('Hall data to add:', hallData);

            if (!hallData.nameGeo) {
                showMessage('გთხოვთ შეიყვანოთ დარბაზის სახელი ქართულად', false);
                return;
            }
            if (!hallData.nameEng) {
                showMessage('გთხოვთ შეიყვანოთ დარბაზის სახელი ინგლისურად', false);
                return;
            }

            try {
                console.log('Sending add request...');
                const data = await setRequest('hall', 'addHall', hallData);
                console.log('Add response:', data);

                const status = data.status === 200;
                showMessage(data.value, status);

                // ვასუფთავებ ფორმას წარმატების შემთხვევაში
                if (status) {
                    console.log('Clearing form inputs...');
                    const formInputIds = [
                        'add-hall-name-geo',
                        'add-hall-name-eng',
                        'add-hall-location-geo',
                        'add-hall-location-eng',
                        'add-hall-description',
                        'add-hall-phoneNumber'
                    ];
                    formInputIds.forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.value = '';
                    });
                }

                console.log('Reloading halls table...');
                await loadAllHalls();
            }
            catch (ex) {
                console.error('Error adding hall:', ex);
                showMessage('დაფიქსირდა პრობლემა დარბაზის დამატებისას', false);
            }
        });
    } else {
        console.warn(' Add button not found!');
    }
}
