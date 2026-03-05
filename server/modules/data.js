import env from './env.js';
import * as db from './db.js'
import * as fs from "node:fs/promises";

const DATABASE_NAME = "project-1";
const ADVISORY_COLLECTION = "raw_advisories";
const ISO_COUNTRIES_COLLECTION = "iso_countries";
const ALERTS_COLLECTION = "alerts";
const SAVED_COLLECTION = "saved";

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

// const savedCountries = (isoCountries) => {
//     let saved = isoCountries.map(isoCountry => {
//         const code = isoCountry['alpha-2']; 
//         let bookmark = false;
//         return { country_code: code, bookmarked: bookmark };
//     });
//     return saved;
// }

const refreshDatabase = async () => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        // Retrieve advisory data with an API web reques 
        let response = await fetch(env.ADVISORIES_URL);
        let rawAdvisories = await response.json();
        let timestamp = rawAdvisories.metadata.generated.date;

        // Drop then re-create the database
        let result = await db.deleteDatabase(context, DATABASE_NAME);
        console.log(`Database ${DATABASE_NAME} dropped.`);
        result = await db.insertDocument(context, DATABASE_NAME, ADVISORY_COLLECTION, rawAdvisories);
        console.log(`Advisories from ${timestamp} loaded into ${ADVISORY_COLLECTION}`);

        // Read a file from the iso-countries.json file from the OS
        let isoFile = await fs.readFile(env.ISO_FILE_PATH);
        let isoText = await isoFile.toString();
        let isoCountries = await JSON.parse(isoText);
         

        // Write to the database
        result = await db.insertDocuments(context, DATABASE_NAME, ISO_COUNTRIES_COLLECTION, isoCountries);
        console.log(`${result.insertedCount} country codes loaded into ${ISO_COUNTRIES_COLLECTION}`);


        // Alert data processing
        let mergedData = mergeData(isoCountries, rawAdvisories);
        result = await db.insertDocuments(context, DATABASE_NAME, ALERTS_COLLECTION, mergedData);
        console.log(`${result.insertedCount} alerts loaded into ${ALERTS_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}

const save = async (code) => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        await db.insertDocument(context, DATABASE_NAME, SAVED_COLLECTION, 
        { country_code: code });
        }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}

const unsave = async (code) => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        await db.deleteDocument(context, DATABASE_NAME, SAVED_COLLECTION, 
        { country_code: code })
        }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}

const retrieveSaved = async () => {
    let saved = [];
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);

        const projection = {
            _id: 0,
            country_code: 1,
        }

        saved = await db.findDocuments(context, DATABASE_NAME, SAVED_COLLECTION, {}, projection); 
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return saved;
}

const retrieveAlerts = async () => {
    let alerts = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        const projection = {
            _id: 0,
            country_code: 1,
            country_name: 1
        }

        alerts = await db.findDocuments(context, DATABASE_NAME, ALERTS_COLLECTION, {}, projection);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return alerts;
}

const retrieveAlert = async (CC) => {
    let alert = {};

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        const projection = {
            _id: 0,
            country_code: 1,
            country_name: 1,
            sub_region: 1,
            advisory: 1,
            date: 1
        }

        alert = await db.findDocuments(context, DATABASE_NAME, ALERTS_COLLECTION, {country_code: CC}, projection);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return alert;
}

export {
    refreshDatabase,
    retrieveAlerts,
    retrieveAlert,
    retrieveSaved,
    save,
    unsave,
    DATABASE_NAME,
    ADVISORY_COLLECTION,
    ISO_COUNTRIES_COLLECTION,
    ALERTS_COLLECTION,
    SAVED_COLLECTION
};