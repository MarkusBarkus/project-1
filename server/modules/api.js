import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";

// The Express application object
const app = express();

// Configure Express APIs Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Handle CORS headers

app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.warn(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('query:', req.query);
    console.log('body:', req.body);
    next();
});

// Endpoint Definitions
app.get('/about', (_request, response) => {
    response.sendFile("package.json", { root: '.' });
});

app.get('/about/:what', async (request, response) => {
    // Read the route params
    const field_key = request.params.what;

    let responseJson = {};
    try {
        // Read the package.json file, then convert into a JSON object to read a single field
        let pjFile = await readFile("package.json");
        let pjText = await pjFile.toString();
        let pjObject = await JSON.parse(pjText);

        // Extract the field of :what
        let value = pjObject[field_key];

        // Create a JSON object to responde with
        responseJson[field_key] = value;
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }

    response.json(responseJson);
});

const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
};

console.log('Completed API setup.');

export {
    startServer
}