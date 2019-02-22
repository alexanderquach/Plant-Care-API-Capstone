'use strict';

console.log('Dashhboard');

const authToken = localStorage.getItem('authToken');

function showDashboard() {
  // Displays dashboard
  $('#dashboard-buttons').show();
  $('#user-plants').show();
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-messsage-form').hide();
};

function showNewPlantPost() {
  // Displays new plant post form
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').hide();
  $('#new-plant-form').show();
  $('#edit-plant-form').hide();
  $('#user-messsage-form').hide();
};

function showEditPlantPost() {
  // Displays edit plant post form
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').show();
  $('#user-messsage-form').hide();
};

function findUsers() {
  // Search list of users
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').show();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-messsage-form').hide();
};

function showMessaging() {
  // Displays user message form
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-messsage-form').show();
};

function getPlants() {
  // Retrieves plants from server
  fetch('/plants', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    displayPlants(responseJson);
  })
  .catch(error => {
    console.log(error.message)
  });
};

function displayPlants(plants) {
  // Displays plants in dashboard
  console.log(plants);
  for (let i = 0; i < plants.length; i++) {
    $('#plants-list').append(
      `<li>
        <button type="button">${plants[i].name}</button>
        <div class="plant-info hidden">
          <img src="plant-icons/${plants[i].icon}>
          <p>Watering Requirements: ${plants[i].wateringRequirements}</p>
          <p>Sunlight Requirements: ${plants[i].sunlightRequirements}</p>
          <p>Notes: ${plants[i].notes}</p>
        </div>
      </li>`
    )
  };
};

function postNewPlant(plantInfo) {
  // Creates a new plant post
  fetch('/plants/new', {
    method: 'POST',
    body: JSON.stringify(plantInfo),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    console.log(responseJson);
    getPlants();
  })
  .catch(error => {
    console.log(error.message);
  })
  showDashboard();
};

function editPlant(plant, id) {
  // Edits a plant post
  fetch('/plants/' + id, {
    method: 'PUT',
    body: JSON.stringify(plant),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    console.log('Plant has been updated');
    getPlants();
  })
  .catch(error => {
    console.log(error.message);
  })
  showDashboard();
};

function deletePlant(id) {
  // Deletes a plant post
  fetch('/plants/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('Plant deleted');
      getPlants();
    }
    throw new Error(response.statusText)
  })
  .catch(error => {
    console.log(error.message);
  })
  showDashboard();
};

function searchUsers() {
  // Searches users and their plants
  const username = $('#user-search').val();
  if (username === '') {
    fetch('/users', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      console.log(responseJson)
      // displayUsers(responseJson);
    })
    .catch(error => {
      console.log(error.message)
    })
  }
  fetch('/users')
};

function displaySearchedUserPlants() {
  // Displays plants of searched users
};

function displayUsers(users) {
  // Displays users after search
  console.log(users);
  for (let i = 0; i < users.length; i++) {
    $('#users-list').append(
      `<li>
        <button type="button">${users[i]}</button>
      </li>`
    )
  };
};

function messageUsers(message) {
  // Sends messages to other users
};

// Event handlers ------------------------------------------------------------------

function handleNewPlantSubmit() {
  // Handles new plant submission
};

function handleEditPlantSubmit() {
  // Handles plant edit submission
};

function handleUserSearch() {
  // Handles user search
};

function handleUserSearchSubmit() {
  // Handles user search submission
};

function handleMessages() {
  // Handles messages
};

function handleMessageSubmit() {
  // Handles message submission
};

// Dashboard begin -----------------------------------------------------------------

$(function() {
  console.log('Welcome to your dashboard');
  showDashboard();
  handleNewPlantSubmit();
  handleEditPlantSubmit();
  handleUserSearchSubmit();
  handleMessageSubmit();
});