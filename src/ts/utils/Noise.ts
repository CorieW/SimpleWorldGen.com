export default class Noise {
    private _seed: number;
    private _multiplier: number;
    private _octaves: number;
    private _persistence: number;
    private _lacunarity: number;
    private _frequency: number;
    private _spread: number;

    constructor(seed: number, multiplier: number = 1, octaves: number = 1, persistence: number = 0.5, lacunarity: number = 2, frequency: number = 1, spread: number = 1) {
        this._seed = seed;
        this._multiplier = multiplier;
        this._octaves = octaves;
        this._persistence = persistence;
        this._lacunarity = lacunarity;
        this._frequency = frequency;
        this._spread = spread;
    }

    /**
     * Generate a noise map on a separate thread
     * @param width width of the noise map
     * @param height height of the noise map
     * @param offset offset of the noise map
     * @param onGenerated callback function when the noise map is generated
     */
    generateNoiseMap(width: number, height: number, offset: { x: number; y: number } = { x: 0, y: 0 }): Promise<number[][]> {
        const worker = new Worker('/src/ts/workers/noiseGeneratorWorker.ts', { type: 'module' });

        const promise = new Promise<number[][]>((resolve, reject) => {
            worker.onmessage = (event) => {
                resolve(event.data);
            };

            worker.onerror = (error) => {
                reject(error);
            }
        });

        worker.postMessage({
            width,
            height,
            seed: this._seed,
            multiplier: this._multiplier,
            octaves: this._octaves,
            persistence: this._persistence,
            lacunarity: this._lacunarity,
            frequency: this._frequency,
            spread: this._spread,
            offset
        });

        return promise;
    }
}
