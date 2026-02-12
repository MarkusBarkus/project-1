import express from "express";
import cors from "cors";

// The Express application object
const app = express();

// Configure Express APIs Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Handle CORS headers

// Endpoint Definitions
app.get('/about', (_request, response) => {
    response.sendFile("package.json", { root: '.' });
});

const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
};

console.log('Completed API setup.');

export {
    startServer
}