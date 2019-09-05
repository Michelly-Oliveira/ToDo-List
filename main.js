// Form
const addItems = document.querySelector(".add-items");
// Ul
const todos = document.querySelector(".todos");
// Array for the items
// Try to get content from the localStorage, if not possible, set to empty array
let itemsList = JSON.parse(localStorage.getItem("items")) || [];

// Keep track of the last item that was checked
let lastChecked;

/* Get the Date */
const displayDate = document.querySelector(".display-date");
let prevDay = JSON.parse(localStorage.getItem('prevDay')) || '';

function showDay() {
    const date = new Date();
    const numberOfDayOfWeek = date.getDay();
    let dayOfWeek;

    switch(numberOfDayOfWeek) {
        case 0: 
            dayOfWeek = 'Sunday';
            break;
        case 1: 
            dayOfWeek = 'Monday';
            break;
        case 2: 
            dayOfWeek = 'Tuesday';
            break;
        case 3: 
            dayOfWeek = 'Wednesday';
            break;
        case 4: 
            dayOfWeek = 'Thursday';
            break;
        case 5: 
            dayOfWeek = 'Friday';
            break;
        case 6: 
            dayOfWeek = 'Saturday';
            break;
    }

    displayDate.innerHTML = dayOfWeek;

    // If today isn't the same day as the previous day, clean the list on localStorage, reset the list
    if(prevDay != dayOfWeek && prevDay != '') {
        localStorage.removeItem('items');
        itemsList = [];
    }

    localStorage.setItem('prevDay',JSON.stringify(dayOfWeek));
}

function addItem(e) {
    e.preventDefault();

    // this = e.target = form
    // Grab the text
    const text = this.querySelector("input[type=text]").value;

    // Create an obj for the item
    const obj = {
        text,
        done: false
    };

    // Add item to list
    itemsList.push(obj);

    updateStorageandScreen('items', itemsList, todos);

    // Clean the form
    this.reset();
}

function populateList(list = [], todoList) {
    todoList.innerHTML = list.map((item, i) => {
        // Create the li element and add it to the ul
        return `<li>
            <input type="checkbox" data-index=${i} id="item${i}" ${item.done ? "checked" : ""}>
            <label for="item${i}">${item.text}<label>
            <span data-index=${i}><i class="shadow fa fa-close" aria-hidden="true"></i></span>
        </li>`;
    }).join(""); // Add a string to the html element
}

function toggleDone(e) {
    // Check if we clicked on an input, not on the li

    const element = e.target;

    if(!element.matches('input') && !(element.matches('i') || element.matches('span'))) {
        // Skip this unless it's an input/label we clicked on
        return;
    } 

    if(element.matches('i') || element.matches('span')) {
        // Pass the item we clicked on
        // (element.parentNode) = span, .parentNode = label, .parentNode = li
        deleteItem(element.parentNode);
        return;
    }

    /* Change the status of the item we clicked on */
    // Get the index of the element
    const index = element.dataset.index;

    // Change the state of the element
    itemsList[index].done = !itemsList[index].done;

    /* If necessary, change the status of the items between the previously selected item and the current item */
    // Check the boxes between using shift
    let inBetween = false;

    if(e.shiftKey) {
        // Loop through the array using the index of the item to compare
        itemsList.map((item, i) => {
            // i==index -> current array item = item that triggered the event
            // i==lastChecked -> current array item = previous item to trigger the event
            if(i == index || i == lastChecked) {
                // Only stay true while the item isn't the one we selected
                inBetween = !inBetween;
            }
            
            if(inBetween) {
                item.done = true;
            }
        });
    }

    // Update the last checked checkbox
    lastChecked = index;

    updateStorageandScreen('items', itemsList, todos);
}

function deleteItem(e) {
    const index = e.dataset.index;
    console.log(index,e)
    // Delete the selected item
    itemsList.splice(index, 1);

    updateStorageandScreen('items', itemsList, todos)
}

function updateStorageandScreen(itemToStorage, array, htmlList) {
    // Populate html list
    populateList(array, htmlList);

    // Update the local storage
    localStorage.setItem(itemToStorage, JSON.stringify(array));
}

/* Events */

addItems.addEventListener("submit", addItem);
todos.addEventListener("click", toggleDone);

/* Call this after page loads */

// Display date on screen
showDay();

// Check for content on localStorage after window finishes loading
populateList(itemsList, todos);