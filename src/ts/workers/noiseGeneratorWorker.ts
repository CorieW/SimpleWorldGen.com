// Import the specific function from the module
import { makeNoise2D } from 'open-simplex-noise';

self.onmessage = function(event) {
    const data = event.data;
    const {
        width,
        height,
        seed,
        multiplier,
        octaves,
        persistence,
        lacunarity,
        frequency,
        spread,
        offset
    } = data;

    const noise = makeNoise2D(seed);
    const noiseData: number[][] = [];
    for (let y = 0; y < height; y++) {
        noiseData[y] = [];
        for (let x = 0; x < width; x++) {
            noiseData[y][x] = generateOctaveNoise(x, y) * multiplier;
        }
    }

    self.postMessage(noiseData);

    function generateOctaveNoise(
        x: number,
        y: number,
    ): number {
        let noiseValue = 0;
        let amplitude = 1;
        let totalAmplitude = 0;

        for (let i = 0; i < octaves; i++) {
            const currentFrequency = frequency * Math.pow(lacunarity, i);

            noiseValue +=
                noise(
                    (offset.x + x * spread) * currentFrequency,
                    (offset.y + y * spread) * currentFrequency
                ) * amplitude;

            totalAmplitude += amplitude;
            amplitude *= persistence;
        }

        // Normalize the result
        noiseValue = (noiseValue + totalAmplitude) / (2 * totalAmplitude);

        return noiseValue;
    }
};