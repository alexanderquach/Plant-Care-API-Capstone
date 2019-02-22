'use strict';

console.log('Homepage');

// Display/hide pages and forms ---------------------------------------------------

function showHomepage() {
  // Displays homepage
  $('#homepage-welcome').show();
  $('#user-buttons').show();
  $('#new-user-form').hide();
  $('#login-form').hide();
};

function showLogin() {
  // Displays login page
  $('#homepage-welcome').hide();
  $('#user-buttons').hide();
  $('#new-user-form').hide();
  $('#login-form').show();
};

function showNewUser() {
  // Displays new user form
  $('#homepage-welcome').hide();
  $('#user-buttons').hide();
  $('#new-user-form').show();
  $('#login-form').hide();
};

function hideHome() {
  // Hides homepage for dashboard loading
  $('#homepage-welcome').hide();
  $('#user-buttons').hide();
  $('#new-user-form').hide();
  $('#login-form').hide();
};

// User signup and login ----------------------------------------------------------

function createNewUser(username, password) {
  // Creates a new user
  // console.log(username, password);
  const userInput = {
    username, password
  };
  fetch('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userInput),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    // console.log(responseJson);
    userLogin(username, password);
  })
  .catch(error => {
    console.log(error.message);
  })
};

function populateStorage(authToken) {
  // Saves JWT to localStorage
  localStorage.setItem('authToken', authToken)
};

function userLogin(username, password) {
  // Logs in the user
  // console.log(username, password);
  const userInput = {
    username, password
  };
  fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(userInput),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    console.log(responseJson);
    populateStorage(responseJson.authToken);
    hideHome();
    window.location.href = '/dashboard.html'
  })
  .catch(error => {
    console.log(error.message);
  })
};

// Event handlers ------------------------------------------------------------------

function handleNewUser() {
  $('#new-user-button').on('click', function(event) {
    event.preventDefault();
    showNewUser();
  });
};

function handleNewSubmit() {
  $('#new-user-submit').on('click', function(event) {
    event.preventDefault();
    const username = $(this).find('#username-new').val();
    const password = $(this).find('#password-new').val();
    createNewUser(username, password);
  });
};

function handleLogin() {
  $('#login-button').on('click', function(event) {
    event.preventDefault();
    showLogin();
  });
};

function handleLoginSubmit() {
  $('#login-submit').on('click', function(event) {
    event.preventDefault();
    const username = $(this).find('#username-login').val();
    const password = $(this).find('#password-login').val();
    userLogin(username, password);
  });
};

// Begin app -----------------------------------------------------------------------

$(function() {
  console.log('App started');
  showHomepage();
  handleNewUser();
  handleNewSubmit();
  handleLogin();
  handleLoginSubmit();
});