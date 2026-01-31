import dotenv from 'dotenv';
dotenv.config();

import { initDatabase, deleteDatabase, insertDocument } from './modules/db.js';

let db = undefined;
try {
    // Initialize the database
    db = await initDatabase(process.env.DB_URI);

    // Retrieve advisory data with an API web request
    let response = await fetch(process.env.ADVISORIES_URL);
    let data = await response.json();

    // Drop then re-create thea database
    let result = await deleteDatabase(db, "project-1");
    console.log("deleteDatabase result: ", result);
    result = await insertDocument(db, "project-1", 'raw_advisories', data);
    console.log("insertDocument result: ", result);
}
catch (e) {
    console.error(e);
}
finally {
    db?.close();
}