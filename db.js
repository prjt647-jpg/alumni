// Tiny JSON-file data store (no native modules, works on any host).
// Collections: users, connections, events, rsvps, mentoring, jobs, applications
const fs = require('fs');
const path = require('path');

const FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');
const COLLECTIONS = ['users', 'connections', 'events', 'rsvps', 'mentoring', 'jobs', 'applications'];

let data;

function load() {
  try {
    data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    data = {};
  }
  data._seq = data._seq || {};
  COLLECTIONS.forEach((c) => {
    data[c] = data[c] || [];
  });
}

function save() {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, FILE);
}

load();

module.exports = {
  all: (col) => data[col].slice(),
  get: (col, id) => data[col].find((r) => r.id === Number(id)),
  find: (col, fn) => data[col].filter(fn),
  findOne: (col, fn) => data[col].find(fn),
  insert(col, obj) {
    data._seq[col] = (data._seq[col] || 0) + 1;
    const row = { id: data._seq[col], ...obj, createdAt: new Date().toISOString() };
    data[col].push(row);
    save();
    return row;
  },
  update(col, id, patch) {
    const row = data[col].find((r) => r.id === Number(id));
    if (!row) return null;
    Object.assign(row, patch);
    save();
    return row;
  },
  remove(col, id) {
    const i = data[col].findIndex((r) => r.id === Number(id));
    if (i === -1) return false;
    data[col].splice(i, 1);
    save();
    return true;
  },
  removeWhere(col, fn) {
    const before = data[col].length;
    data[col] = data[col].filter((r) => !fn(r));
    if (data[col].length !== before) save();
    return before - data[col].length;
  },
};
