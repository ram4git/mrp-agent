import Storage from 'electron-json-storage-sync';
import { getUser } from '../int/Masters';



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
  return getUser(username);
}
