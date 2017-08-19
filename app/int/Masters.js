const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join('/tmp', 'masters.db'));

export function getMasters(masterType) {

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM MASTERS', (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  });
}

export function addMasterValue(masterKey, masterValue) {
  const goodMasterKey = masterValue.split(' ').join('_');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const stmt = 'INSERT INTO MASTERS (name, key, value) VALUES (?,?,?)';
      console.log('STMT=' + stmt);
      db.run(stmt, [masterKey, goodMasterKey, masterValue], (err) => {
        if (!err) {
          resolve({ success: true });
        } else {
          reject(err);
        }
      });
    });
  });
}


export const lorryToRusumMap = {
  lorry_6_tyres: 100,
  lorry_10_tyres: 200,
  lorry_12_tyres: 250,
  lorry_14_tyres: 300,
  lorry_16_tyres: 350
};

export const lorry2JattuMap = {
  lorry_6_tyres: 250,
  lorry_10_tyres: 450,
  lorry_12_tyres: 550,
  lorry_14_tyres: 650
};

export const chargesMap = {
  loading: {
    rice: {
      local: 35,
      outside: 35
    },
    paddy: {
      local: 35,
      outside: 35
    },
    broken: {
      local: 35,
      outside: 35
    },
  },
  unloading: {
    rice: {
      local: 35,
      outside: 40,
      extra: {
        local: 300,
        outside: 300
      }
    },
    paddy: {
      local: 35,
      outside: 40,
      extra: {
        local: 0,
        outside: 100
      }
    },
    broken: {
      local: 35,
      outside: 40,
      extra: {
        local: 300,
        outside: 300
      }
    }
  }
};
