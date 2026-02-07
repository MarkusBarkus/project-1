import dotenv from 'dotenv';
dotenv.config();

import { initDatabase, deleteDatabase, insertDocument, insertDocuments } from './modules/db.js';
import * as fs from "node:fs/promises";

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

let isoFile = await fs.readFile(process.env.ISO_FILE_PATH);
    let isoText = await isoFile.toString();
    let isoCountries = await JSON.parse(isoText);

    // Write to the database
    result = await insertDocuments(db, "project-1", "iso_countries", isoCountries);
    console.log(result.insertedCount, "country codes loaded");


}
catch (e) {
    console.error(e);
}
finally {
    db?.close();
}