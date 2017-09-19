const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const { app } = require('electron').remote;
const dbPath = path.resolve(app.getPath('userData'), 'dieseldata.db');
//C:\Users\IEUser\AppData\Roaming\mrp-waybridge-billing
const db = new sqlite3.Database(dbPath);

export function addBill(bill) {
  let valuesArray = [];
  valuesArray.push(bill.sno);// #2 sno
  valuesArray.push(bill.date);// #1 date
  valuesArray.push(bill.action);// #2 action
  valuesArray.push(bill.product);// #3 product
  valuesArray.push(bill.region);// #4 region
  valuesArray.push(bill.lorryType);// #5 lorryType
  valuesArray.push(bill.totalWeightInTons);// #6 totalWeightInTons
  valuesArray.push(bill.activityRows);// #7 activityRows
  valuesArray.push(bill.totalAmount);// #8  totalAmout
  valuesArray.push(bill.jattuAmount); //#9 jattuAmount
  valuesArray.push(bill.balanceAmount); //#10 balanceAmount
  valuesArray.push(bill.chargePerTon); //#11 chargePerTon
  valuesArray.push(bill.otherCharges); //#12 otherCharges
  valuesArray.push(bill.lorryNo); //#13 lorryNo

  return new Promise((resolve, reject) => {
    const stmt = 'INSERT INTO BILLS (sno, date, action, product, region,' +
    ' lorryType, totalWeightInTons, activityRows, totalAmount, jattuAmount,' +
    ' balanceAmount, chargePerTon, otherCharges, lorryNo) ' +
    'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.run(stmt, valuesArray, (err) => {
      if (!err) {
        resolve({ success: true, id: bill.sno });
      } else {
        reject(err);
      }
    });
  });
}

export function getBills() {

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM BILLS ORDER BY sno DESC LIMIT 100', (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  });
}

export function getBillsForShift(start, end) {

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM BILLS WHERE date >= ? AND date < ? ORDER BY sno DESC LIMIT 100', [start, end], (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  });
}


export function getBill(billNo) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM BILLS where sno = ?', billNo, (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  });
}


export function getMasters() {

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


export function getUser(name) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all('SELECT * FROM USERS where name = ?', name, (err, rows) => {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  });
}

export function addUser(name, pass) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const stmt = 'INSERT INTO USERS (name, pass) VALUES (?,?)';
      db.run(stmt, [name, pass], (err) => {
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
  lorry_6_tyres: 150,
  lorry_10_tyres: 200,
  lorry_12_tyres: 250,
  lorry_14_tyres: 300,
  lorry_16_tyres: 350
};

export const lorry2JattuMap = {
  lorry_6_tyres: 250,
  lorry_10_tyres: 450,
  lorry_12_tyres: 550,
  lorry_14_tyres: 650,
  lorry_16_tyres: 750
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
        local: 0,
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
        local: 0,
        outside: 300
      }
    }
  }
};
