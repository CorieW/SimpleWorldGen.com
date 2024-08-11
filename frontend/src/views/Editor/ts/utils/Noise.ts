import { makeNoise2D } from 'open-simplex-noise';

export default class Noise {
    private _seed: number;
    private _noise2D: any;

    constructor(seed: number) {
        this._seed = seed;
        this._noise2D = makeNoise2D(this._seed);
    }

    generateNoise(x: number, y: number): number {
        return this._noise2D(x, y);
    }

    generateOctaveNoise(
        x: number,
        y: number,
        octaves: number,
        persistence: number,
        lacunarity: number,
        frequency: number,
        offset: { x: number; y: number } = { x: 0, y: 0 }
    ): number {
        let noiseValue = 0;
        let amplitude = 1;
        let totalAmplitude = 0;

        for (let i = 0; i < octaves; i++) {
            const currentFrequency = frequency * Math.pow(lacunarity, i);
            const offsetX = offset.x * currentFrequency;
            const offsetY = offset.y * currentFrequency;

            noiseValue +=
                this.generateNoise(
                    (x + offsetX) * currentFrequency,
                    (y + offsetY) * currentFrequency
                ) * amplitude;

            totalAmplitude += amplitude;
            amplitude *= persistence;
        }

        // Normalize the result
        noiseValue = (noiseValue + totalAmplitude) / (2 * totalAmplitude);

        return noiseValue;
    }
}
