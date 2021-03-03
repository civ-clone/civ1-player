"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const { numberOfRequiredTiles, tiles, } = worker_threads_1.workerData;
const startTiles = tiles
    .sort(({ score: aScore }, { score: bScore }) => bScore - aScore)
    .slice(0, numberOfRequiredTiles);
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(startTiles);
//# sourceMappingURL=sortStartTiles.js.map