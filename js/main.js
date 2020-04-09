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

  // Update the previous day to prevent the storage from being clean when page reloads
  localStorage.setItem('prevDay', JSON.stringify(dayOfWeek));
}

function addItem(e) {
  e.preventDefault();

  // this = e.target = form
  // Grab the text
  const text = this.querySelector('input[type=text]').value;

  // Create an obj for the item
  const todo = {
    text,
    done: false
  };

  // If item isn't empty
  if(text !== "") {
    console.log('hey');
    // Add item to list
    itemsList.push(todo);
  } else {
    alert('Please fill the todo item field');
  }

  updateStorageAndScreen('items', itemsList, todos);

  // Clean the form
  this.reset();
}

function checkWhereClicked(e) {
  /* Check where we clicked inside the ul */

  // Element clicked
  const element = e.target;
  // element.matches(selector) = check if the element is the selector

  // Click was on 'empty' space; not on the checkbox, text or 'X'
  if (!element.matches('input') && !element.matches('span')) {
    // Do nothing
    return;
  }

  // Clicked on the 'X'
  if (element.matches('span')) {
    // Pass the item we clicked on to be deleted
    deleteItem(element);
    return;
  }

  toggleDone(element, e.shiftKey);
}

function deleteItem(todo) {
  // Get the index of the todo
  const index = todo.dataset.index;

  // Remove the selected todo item from the list
  itemsList.splice(index, 1);

  // Remove todo item from the screen and storage
  updateStorageAndScreen('items', itemsList, todos);
}

function toggleDone(todo, isShiftPressed) {
  /* Change the status of the item we clicked on */
  // Get the index of the element
  const index = todo.dataset.index;

  // Change the state of the element to its opposite
  itemsList[index].done = !itemsList[index].done;

  /* If SHIFT is pressed, change the status of the items between the previously selected item and the current item */
  // Check the boxes between using shift
  let inBetween = false;

  if (isShiftPressed) {
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

function updateStorageAndScreen(itemOnLocalStorage, todoArray, listElement) {
  // Populate html list
  populateList(todoArray, listElement);

  // Update the local storage
  localStorage.setItem(itemOnLocalStorage, JSON.stringify(todoArray));
}

// If list isn't passed to the function, use an empty array
function populateList(todos = [], todoListHtml) {
  todoListHtml.innerHTML = todos
    .map((todo, index) => {
      // Create the html for the todo item and add it to the todo list on the screen
      return `<li>
        <input type="checkbox" data-index=${index} id="item${index}" ${todo.done ? 'checked' : ''}>
        <label for="item${index}">${todo.text}<label>
        <span data-index=${index} class="shadow fa fa-close"></span>
      </li>`;
    })
    .join(''); // Add a string to the html element
}

/* Events */
addItems.addEventListener('submit', addItem);
todos.addEventListener('click', checkWhereClicked);

// Display date on screen
showDay();
// Check for content on localStorage after window finishes loading
populateList(itemsList, todos);
