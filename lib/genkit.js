"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.ai = (0, genkit_1.genkit)({
    plugins: [(0, googleai_1.googleAI)({ apiKey: process.env.GEMINI_API_KEY })],
});
