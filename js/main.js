// Form
const addItems = document.querySelector('.add-items');
// Ul
const todos = document.querySelector('.todos');
// Array for the items
// Try to get content from the localStorage, if not possible, set to empty array
let itemsList = JSON.parse(localStorage.getItem('items')) || [];

// Keep track of the last item that was checked
let lastChecked;

/* Get the Date */
const displayDate = document.querySelector('.display-date');
let prevDay = JSON.parse(localStorage.getItem('prevDay')) || '';

function showDay() {
  const date = new Date();
  const numberOfDayOfWeek = date.getDay();
  let dayOfWeek;

  switch (numberOfDayOfWeek) {
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
  if (prevDay != dayOfWeek && prevDay != '') {
    localStorage.removeItem('items');
    itemsList = [];
  }

  localStorage.setItem('prevDay', JSON.stringify(dayOfWeek));
}

function addItem(e) {
  e.preventDefault();

  // this = e.target = form
  // Grab the text
  const text = this.querySelector('input[type=text]').value;

  // Create an obj for the item
  const obj = {
    text,
    done: false
  };

  // Add item to list
  itemsList.push(obj);

  updateStorageAndScreen('items', itemsList, todos);

  // Clean the form
  this.reset();
}

function populateList(list = [], todoList) {
  todoList.innerHTML = list
    .map((item, i) => {
      // Create the li element and add it to the ul
      return `<li>
            <input type="checkbox" data-index=${i} id="item${i}" ${item.done ? 'checked' : ''}>
            <label for="item${i}">${item.text}<label>
            <span data-index=${i} class="shadow fa fa-close"></span>
        </li>`;
    })
    .join(''); // Add a string to the html element
}

function toggleDone(e) {
  // Check where we clicked inside the ul

  // Element clicked
  const element = e.target;
  // element.matches(selector) = check if the element is the selector

  // Click was on 'empty' space; not on the checkbox, text or X
  if (!element.matches('input') && !element.matches('span')) {
    // Do nothing
    return;
  }
  console.log(element);
  // Clicked on the X
  if (element.matches('span')) {
    // Pass the item we clicked on
    deleteItem(element);
    return;
  }

  /* Change the status of the item we clicked on */
  // Get the index of the element
  const index = element.dataset.index;

  // Change the state of the element to its opposite
  itemsList[index].done = !itemsList[index].done;

  /* If SHIFT is pressed, change the status of the items between the previously selected item and the current item */
  // Check the boxes between using shift
  let inBetween = false;

  if (e.shiftKey) {
    // Loop through the array using the index of the item to compare
    itemsList.map((item, i) => {
      // i==index -> current array item = most recent item clicked
      // i==lastChecked -> current array item = previous item clicked
      if (i == index || i == lastChecked) {
        // Only stay true while the item isn't the one we clicked
        inBetween = !inBetween;
      }

      if (inBetween) {
        item.done = true;
      }
    });
  }

  // Update the last checked checkbox
  lastChecked = index;

  updateStorageAndScreen('items', itemsList, todos);
}

function deleteItem(e) {
  const index = e.dataset.index;

  // Delete the selected item from the list
  itemsList.splice(index, 1);

  updateStorageAndScreen('items', itemsList, todos);
}

function updateStorageAndScreen(itemToStorage, array, htmlList) {
  // Populate html list
  populateList(array, htmlList);

  // Update the local storage
  localStorage.setItem(itemToStorage, JSON.stringify(array));
}

/* Events */

addItems.addEventListener('submit', addItem);
todos.addEventListener('click', toggleDone);

// Display date on screen
showDay();
// Check for content on localStorage after window finishes loading
populateList(itemsList, todos);
