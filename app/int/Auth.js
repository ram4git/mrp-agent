import Storage from 'electron-json-storage-sync';



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


export function logout() {
  Storage.clear('session');
}

export function auth(username, password) {
  const response = {
    authenticated: false,
    msg: ''
  };

  const { status, data, error } = Storage.get('session');
  if (status) {
    if(data.user === username && data.status === 'LOGGED-IN') {
      response.authenticated = true;
      return response;
    }
  }

  if (usersMap[username]) {
    if (usersMap[username].pass === password) {
      response.authenticated = true;
      const result = Storage.set('session', {
        user: username,
        status: 'LOGGED-IN'
      });

      if(result.status) {
        console.log('Successfully persisted session');
      } else {
        console.warn('Unable to save session ', status.error);
      }
    } else {
      response.msg = 'Incorrect Password ❌';
      Storage.clear();
    }
  } else {
    response.msg = 'USERNAME doesn\'t exist ❗️';
    Storage.clear();
  }

  return response;
}
