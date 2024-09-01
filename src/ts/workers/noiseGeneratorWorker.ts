// Import the specific function from the module
import { makeNoise2D } from 'open-simplex-noise';

self.onmessage = function(event) {
    const data = event.data;
    const { width, height, seed, octaves, persistence, lacunarity, frequency, offset } = data;

    const noise = makeNoise2D(seed);

    const noiseData: number[][] = [];
    for (let y = 0; y < height; y++) {
        noiseData[y] = [];
        for (let x = 0; x < width; x++) {
            noiseData[y][x] = generateOctaveNoise(x, y);
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
            const offsetX = offset.x * currentFrequency;
            const offsetY = offset.y * currentFrequency;

            noiseValue +=
                noise(
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
};