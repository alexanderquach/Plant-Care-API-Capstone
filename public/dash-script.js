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
  $('#user-message-form').hide();
  $('#search-list').hide();
  $('#user-messages').show();
  $('#plants-list').empty();
  getPlants();
};

function showNewPlantPost() {
  // Displays new plant post form
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').hide();
  $('#new-plant-form').show();
  $('#edit-plant-form').hide();
  $('#user-message-form').hide();
  $('#search-list').hide();
  $('#user-messages').hide();
};

function showEditPlantPost() {
  // Displays edit plant post form
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').show();
  $('#user-message-form').hide();
  $('#search-list').hide();
  $('#user-messages').hide();
};

function showAllUsers() {
  // Displays list of all users
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-message-form').hide();
  $('#search-list').show();
}

function showUserSearch() {
  // Search list of users
  $('#user-search-form').show();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-message-form').hide();
  $('#search-list').hide();
};

function showMessaging() {
  // Displays user message form
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-message-form').show();
  $('#search-list').hide();
};

function hideDashboard() {
  // Hides dashboard for homepage loading
  $('#dashboard-buttons').hide();
  $('#user-plants').hide();
  $('#user-search-form').hide();
  $('#new-plant-form').hide();
  $('#edit-plant-form').hide();
  $('#user-message-form').hide();
  $('#search-list').hide();
};

// Plant functions -----------------------------------------------------------------

function getPlants() {
  // Retrieves plants from server
  fetch('/plants/allPlants', {
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
      `<li class="individual-plant">
        <button class="plant-name button" type="button">
          <img class="display-icon icon" src="plant-icons/${plants[i].icon}.png" alt="${plants[i].icon}">
        </button>
        <div class="plant-info hidden">
          <p>Plant Species/Name: ${plants[i].name} <button class="plant-info-back" type="button">&times;</button></p>
          <p class="display-water">Watering Requirements: ${plants[i].wateringRequirements}</p>
          <p class="display-sunlight">Sunlight Requirements: ${plants[i].sunlightRequirements}</p>
          <p class="display-notes">Notes: ${plants[i].notes}</p>
          <button class="edit-plant button" data-id="${plants[i]._id}" type="button">Modify</button>
          <button class="delete-plant button" type="button">Delete</button>
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
    showDashboard();
  })
  .catch(error => {
    console.log(error.message);
  })
};

function getEditPlant(id) {
  // Finds desired plant info for editing
  console.log(id);
  fetch(`/plants/${id}`, {
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
    throw new Error(response.statusText)
  })
  .then(responseJson => {
    console.log(responseJson);
    showEditPlantPost();
    populateEditPlant(responseJson, id);
  })
  .catch(error => {
    console.log(error.message)
  })
};

function editPlant(plantData, id) {
  // Edits a plant post
  fetch(`/plants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(plantData),
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
    showDashboard();
    // $('#plants-list').empty()
    // getPlants();
  })
  .catch(error => {
    console.log(error.message);
  })
};

function populateEditPlant(plant, id) {
  $('#edit-plant-icons').attr('value', `${plant.icon}`);
  $('#edit-plant-name').attr('value', `${plant.name}`);
  $('#edit-plant-water').attr('value', `${plant.wateringRequirements}`);
  $('#edit-plant-sunlight').attr('value', `${plant.sunlightRequirements}`);
  $('#edit-plant-notes').attr('value', `${plant.notes}`);
};

function deletePlant(id) {
  // Deletes a plant post
  fetch(`/plants/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('Plant deleted');
      showDashboard();
      // $('#plants-list').empty();
      // getPlants();
    }
    throw new Error(response.statusText)
  })
  .catch(error => {
    console.log(error.message);
  })
};

// Search and message users functions ----------------------------------------------

function allUsersList() {
  // Searches all users and their plants
  fetch('/users', {
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
    // console.log(responseJson);
    showAllUsers();
    displayUsersList(responseJson);
  })
  .catch(error => {
    console.log(error.message)
  });
};

function searchUsers(username) {
  // Searches for a specific user
  fetch('/users/' + username, {
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
    throw new Error(response.statusText)
  })
  .then(responseJson => {
    console.log(responseJson);
    showAllUsers();
    displaySearchedUser(responseJson);
  })
  .catch(error => {
    console.log(error.message);
  })
};

function displayUsersList(users) {
  // Displays all users
  console.log(users);
  $('#users-list').empty();
  for (let i = 0; i < users.length; i++) {
    $('#users-list').append(
      `<li>
        <button class="searched-user-name button" data-username="${users[i].username}" type="button">${users[i].username}</button>
        <ul class="searched-user-plants hidden" data-username="${users[i].username}"></ul>
      </li>`
    )
  };
};

function displaySearchedUser(user) {
  // Displays searched user
  $('#users-list').empty();
  $('#users-list').append(
    `<li>
        <button class="searched-user-name button" data-username="${user.username}" type="button">${user.username}</button>
        <ul class="searched-user-plants hidden" data-username="${user.username}"></ul>
      </li>`
  );
};

function searchedUserPlants(username) {
  // Populates plants of a searched user or all users
  console.log(username);
  fetch(`/plants/searchedUserPlants/${username}`, {
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
    throw new Error(response.statusText)
  })
  .then(responseJson => {
    displaySearchedUserPlants(responseJson, username);
  })
  .catch(error => {
    console.log(error.message)
  })
};

function displaySearchedUserPlants(searchedPlants, username) {
  // Displays plants of searched users
  console.log(searchedPlants);
  $('.searched-user-plants').empty();
  for (let i = 0; i < searchedPlants.length; i++) {
    $(`.searched-user-plants[data-username='${username}']`).append(
      `<li>
        <button class="plant-name button" type="button">
          <img src="plant-icons/${searchedPlants[i].icon}.png" alt="${searchedPlants[i].icon}" class="icon">
        </button>
        <div class="plant-info hidden">
          <p>Plant Species/Name: ${searchedPlants[i].name}</p>
          <p>Watering Requirements: ${searchedPlants[i].wateringRequirements}</p>
          <p>Sunlight Requirements: ${searchedPlants[i].sunlightRequirements}</p>
          <p>Notes: ${searchedPlants[i].notes}</p>
        </div>
      </li>`
    )
  };
};

function messageUsers(message) {
  // Sends messages to other users
  fetch('../users/messages', {
    method: 'POST',
    body: JSON.stringify(message),
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
    console.log(`Message sent to ${message.recipient}`);
    showDashboard();
    // $('#plants-list').empty();
    // getPlants();
  })
  .catch(error => {
    console.log(error.message);
  });
};

function getMessages() {
  // Retrieves user messages
  const username = localStorage.getItem('username');
  fetch('../users/messages/' + username, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    console.log(responseJson);
    displayUserMessages(responseJson)
  })
  .catch(error => {
    console.log(error.message);
  })
  setTimeout(getMessages, 300000);
};

function displayUserMessages(messages) {
  // Displays user messages
  $('#message-list').empty();
  for (let i = 0; i < messages.length; i++) {
    $('#message-list').append(
      `<li>
        <p>${messages[i].username}: ${messages[i].message}</p>
      </li>`
    )
  };
};

// Event handlers ------------------------------------------------------------------

function handleMenu() {
  $('#menu-button').on('click', function() {
    $(this).siblings('button').toggle();
  });
};

function handleNewPlantSubmit() {
  // Handles new plant submission
  $('#new-plant').on('click', function(event) {
    event.preventDefault();
    showNewPlantPost();
  });
  $('#new-plant-form').on('submit', function(event) {
    event.preventDefault();
    const icon = $(this).find('input[name=plant-icon]:checked').attr('id');
    const name = $(this).find('#plant-name').val();
    const wateringRequirements = $(this).find('#plant-water').val();
    const sunlightRequirements = $(this).find('#plant-sunlight').val();
    const notes = $(this).find('#plant-notes').val();
    const plantInfo = {
      icon, name, wateringRequirements, sunlightRequirements, notes
    };
    postNewPlant(plantInfo);
    // getPlants();
  });
};

function handleViewPlant() {
  // Handles viewing individual plant
  $('#plants-list').on('click', '.plant-name', function() {
    // console.log(this);
    $(this).siblings('.plant-info').toggle();
  })
};

function handleBackButton() {
  // Handles 'back' button click
  $(document).on('click', '.back-button', function() {
    showDashboard();
  })
}

function handlePlantInfoBack() {
  $(document).on('click', '.plant-info-back', function() {
    $(this).parents('.plant-info').toggle();
  })
}

function handleEditPlantSubmit() {
  // Handles plant edit submission
  $('#plants-list').on('click', '.edit-plant', function() {
    const id = $(this).attr('data-id');
    getEditPlant(id);
    $('#selected-plant').val(id);
  });
  $('#edit-plant-form').on('submit', function(event) {
    event.preventDefault();
    const icon = $(this).find('input[name=edit-plant-icon]:checked').attr('id');
    const name = $(this).find('#edit-plant-name').val();
    const wateringRequirements = $(this).find('#edit-plant-water').val();
    const sunlightRequirements = $(this).find('#edit-plant-sunlight').val();
    const notes = $(this).find('#edit-plant-notes').val();
    const plantInfo = {
      icon, name, wateringRequirements, sunlightRequirements, notes
    };
    const id = $('#selected-plant').val();
    editPlant(plantInfo, id);
  });
};

function handleDeletePlant() {
  // Handles deleting a plant
  $('#plants-list').on('click', '.delete-plant', function() {
    const id = $(this).siblings('.edit-plant').attr('data-id');
    deletePlant(id);
  })
};

function handleUserList() {
  // Handles user list view
  $('#user-list-button').on('click', function(event) {
    event.preventDefault();
    allUsersList();
  })
};

function handleUserSearchSubmit() {
  // Handles user search submission
  $('#user-search-button').on('click', function(event) {
    event.preventDefault();
    showUserSearch();
  });
  $('#search-submit').on('click', function(event) {
    event.preventDefault();
    const username = $('#user-search').val();
    searchUsers(username);
  });
};

function handleViewUserPlants() {
  // Handles searched user plants
  $('#users-list').on('click', '.searched-user-name', function() {
    searchedUserPlants($(this).data('username'));
    $(this).siblings('.searched-user-plants').toggle();
  });
  $('.searched-user-plants').on('click', '.plant-name', function() {
    $(this).siblings('.plant-info').toggle();
  });
};

function handleMessageSubmit() {
  // Handles message submission
  $('#message-button').on('click', function(event) {
    event.preventDefault();
    showMessaging();
  });
  $('#user-message-form').on('submit', function(event) {
    event.preventDefault();
    const recipient = $('#recipient').val();
    const messageBody = $('#message').val();
    const message = {messageBody, recipient};
    messageUsers(message);
  })
};

function handleLogout() {
  // Handles log out
  $('#logout-button').on('click', function() {
    localStorage.removeItem('authToken', 'username');
    hideDashboard();
    window.location.href = '/index.html'
  });
};

// Dashboard begin -----------------------------------------------------------------

$(function() {
  console.log('Welcome to your dashboard');
  showDashboard();
  handleMenu();
  getMessages();
  handleBackButton();
  handlePlantInfoBack();
  handleNewPlantSubmit();
  handleViewPlant();
  handleEditPlantSubmit();
  handleDeletePlant();
  handleUserList();
  handleUserSearchSubmit();
  handleViewUserPlants();
  handleMessageSubmit();
  handleLogout();
});