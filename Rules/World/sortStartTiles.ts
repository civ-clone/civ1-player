import { parentPort, workerData } from 'worker_threads';

declare type TileScore = {
  x: number;
  y: number;
  score: number;
};

const {
  numberOfRequiredTiles,
  tiles,
}: {
  numberOfRequiredTiles: number;
  tiles: TileScore[];
} = workerData;

const startTiles = tiles
  .sort(
    ({ score: aScore }: TileScore, { score: bScore }: TileScore) =>
      bScore - aScore
  )
  .slice(0, numberOfRequiredTiles);

parentPort?.postMessage(startTiles);
