import env from './env.js';
import * as db from './db.js'
import * as fs from "node:fs/promises";

const DATABASE_NAME = "project-1";
const ADVISORY_COLLECTION = "raw_advisories";
const ISO_COUNTRIES_COLLECTION = "iso_countries";
const ALERTS_COLLECTION = "alerts";

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

const refreshDatabase = async () => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        // Retrieve advisory data with an API web request
        let response = await fetch(env.ADVISORIES_URL);
        let rawAdvisories = await response.json();
        let timestamp = rawAdvisories.metadata.generated.date;

        // Drop then re-create thea database
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

export {
    refreshDatabase,
    DATABASE_NAME,
    ADVISORY_COLLECTION,
    ISO_COUNTRIES_COLLECTION,
    ALERTS_COLLECTION
};