"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const xml2js_1 = __importDefault(require("xml2js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT ?? 3000;
app.get('/', (req, res) => {
    (0, node_fetch_1.default)('https://assignments.reaktor.com/birdnest/drones')
        .then(async (response) => {
        return await response.text();
    })
        .then((data) => {
        xml2js_1.default.parseString(data, (_err, result) => {
            console.log(result);
            res.send(JSON.stringify(result));
        });
    })
        .catch((err) => {
        console.log(err);
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
