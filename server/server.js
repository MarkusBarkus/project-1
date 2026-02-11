import dotenv from 'dotenv';
dotenv.config();

import { initDatabase, deleteDatabase, insertDocument, insertDocuments } from './modules/db.js';
import * as fs from "node:fs/promises";

import env from './modules/env.js';

import { refreshDatabase } from './modules/data.js';

await refreshDatabase();

const mergeData = (isoCountries, rawAdvisories) => {

    const advisories = rawAdvisories.data;
    let countries = isoCountries.map(isoCountry => {

        const { name, region } = isoCountry;
        const code = isoCountry['alpha-2'];
        const sub_region = isoCountry['sub-region'];

        let advisoryEntry = advisories[code]; // Check for a match for the "left-join"
        const date = advisoryEntry ? advisories[code]['date-published']['date'] : '';
        const advisory = advisoryEntry ? advisories[code]['eng']['advisory-text'] : '';

        return { country_name: name, country_code: code, region, sub_region, advisory, date }; // return of map, not of processData
    });

    return countries;
}

let db = undefined;
try {
    // Initialize the database
    db = await initDatabase(env.DB_URI);

    // Retrieve advisory data with an API web request
    let response = await fetch(env.ADVISORIES_URL);
    let rawAdvisories = await response.json();

    // Drop then re-create thea database
    let result = await deleteDatabase(db, "project-1");
    console.log("deleteDatabase result: ", result);
    result = await insertDocument(db, "project-1", "raw_advisories", rawAdvisories);
    console.log("insertDocument result: ", result);

    // Read a file from the iso-countries.json file from the OS
    let isoFile = await fs.readFile(env.ISO_FILE_PATH);
    let isoText = await isoFile.toString();
    let isoCountries = await JSON.parse(isoText);

    // Write to the database
    result = await insertDocuments(db, "project-1", "iso_countries", isoCountries);
    console.log(result.insertedCount, "country codes loaded");

	// Alert data processing
    let mergedData = mergeData(isoCountries, rawAdvisories);
    result = await  insertDocuments(db, "project-1", "alerts", mergedData);
    console.log(result.insertedCount, "alerts loaded");
}
catch (e) {
    console.error(e);
}
finally {
    db?.close();
}