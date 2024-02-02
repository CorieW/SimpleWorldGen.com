import { makeNoise2D } from 'open-simplex-noise';

export default class Noise {
    private _seed: number;
    private _noise2D: any;

    constructor(seed: number) {
        this._seed = seed;
        this._noise2D = makeNoise2D(this._seed);
    }

    generateOctaveNoise(
        x: number,
        y: number,
        octaves: number,
        persistence: number,
        frequency: number
    ): number {
        let noiseValue = 0;
        let amplitude = 1;
        let totalAmplitude = 0;

        for (let i = 0; i < octaves; i++) {
            noiseValue +=
                this._noise2D(
                    x * frequency * Math.pow(2, i),
                    y * frequency * Math.pow(2, i)
                ) * amplitude;

            totalAmplitude += amplitude;
            amplitude *= persistence;
        }

        // Normalize the result
        return noiseValue / totalAmplitude;
    }
}
