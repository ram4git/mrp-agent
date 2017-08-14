
const usersMap = {
  adish: {
    user: 'adish',
    pass: 'welcome'
  },
  ramesh: {
    user: 'ramesh',
    pass: 'ramesh'
  }
};


export function auth(username, password) {
  const response = {
    authenticated: false,
    msg: ''
  };
  if (usersMap[username]) {
    if (usersMap[username].pass === password) {
      response.authenticated = true;
    } else {
      response.msg = 'Incorrect Password ❌';
    }
  } else {
    response.msg = 'USERNAME doesn\'t exist ❗️';
  }

  return response;
}
