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
  $('#username-new').val('');
  $('#password-new').val('');
  const userInput = {
    username, password
  };
  if (userInput.username === '') {
    alert('Please enter a username');
  }
  else if (userInput.password === '') {
    alert('Please enter a password');
  }
  else if (userInput.password.length < 10) {
    alert('Password must be at least 10 characters in length')
  }
  else {
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
      console.log(response);
      throw new Error(response.data.message);
    })
    .then(responseJson => {
      userLogin(username, password);
    })
    .catch(error => {
      alert(error.message);
    })
  }
};

function populateStorage(authToken, username) {
  // Saves JWT to localStorage
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('username', username);
};

function userLogin(username, password) {
  // Logs in the user
  $('#username-login').val('');
  $('#password-login').val('');
  const userInput = {
    username, password
  };
  // fetch(`/users/${userInput.username}`, {
  //   method: 'GET',
  //   headers: new Headers({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${authToken}`
  //   })
  // })
  // .then(response => {
  //   if (response.length > 0) {
  //     console.log(response);
  //   }
  //   else {
  //     alert(`No user found with the name ${userInput.username}, please try again`)
  //   }
  // });
  if (userInput.username === '') {
    alert('Please enter a username');
  }
  else if (userInput.password === '') {
    alert('Please enter a password');
  }
  else if (userInput.password.length < 10) {
    alert('Password must be at least 10 characters in length')
  }
  else {
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
      populateStorage(responseJson.authToken, username);
      hideHome();
      window.location.href = '/dashboard.html'
    })
    .catch(error => {
      console.log(error.message);
      alert('There was an error logging in, please enter a valid username and password to try again')
    })
  }
};

function userRefresh() {
  // Refreshes user web token
  const authToken = localStorage.getItem('authToken');
  fetch('/auth/refresh', {
    method: 'POST',
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
    populateStorage(responseJson.authToken);
  })
  .catch(error => {
    console.log(error.message)
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
  $('#new-user-form').on('submit', function(event) {
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
  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    const username = $(this).find('#username-login').val();
    const password = $(this).find('#password-login').val();
    userLogin(username, password);
  });
};

function handleBackButton() {
  $(document).on('click', '.back-button', function() {
    showHomepage();
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
  handleBackButton();
});