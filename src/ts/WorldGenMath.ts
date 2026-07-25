import noise from '../libs/noise';

export default class WorldGenMath {
    static clamp(min: number, max: number, val: number): number {
        return Math.max(min, Math.min(val, max));
    }

    static clamp01(val: number): number {
        if (Number.isNaN(val)) return 0;
        return this.clamp(0, 1, val);
    }

    static lerp(min: number, max: number, perc: number): number {
        return (1 - perc) * min + max * perc;
    }

    static invLerp(min: number, max: number, val: number): number {
        if (min === max) return val >= max ? 1 : 0;
        return this.clamp01((val - min) / (max - min));
    }

    static invLerpWithoutMin(min: number, max: number, val: number): number {
        if (min === max) return val >= max ? 1 : 0;
        return (val - min) / (max - min);
    }

    static advNoise(settings: {
        seed: number;
        width: number;
        height: number;
        scale: number;
        octaves: number;
        multiplier: number;
        persistence: number;
        lacunarity: number;
        offset?: { x: number; y: number };
        normalizeMode: string;
    }): number[][] {
        const {
            seed,
            width,
            height,
            scale: configuredScale,
            octaves,
            multiplier,
            persistence,
            lacunarity,
            offset = { x: 0, y: 0 },
            normalizeMode: configuredNormalizeMode,
        } = settings;

        let scale = configuredScale;
        let normalizeMode = configuredNormalizeMode;

        noise.seed(seed);

        if (scale <= 0) scale = 0.0001;

        if (normalizeMode !== 'global' && normalizeMode !== 'local')
            normalizeMode = 'local';

        const configuredOctaveCount = Math.floor(Number(octaves));
        const octaveCount = Number.isFinite(configuredOctaveCount) && configuredOctaveCount >= 1
            ? configuredOctaveCount
            : 1;
        const octaveOffsets = new Array(octaveCount);

        let maxVal = 0;
        let amplitude = 1;

        for (let i = 0; i < octaveCount; i++) {
            const offsetX = offset.x;
            const offsetY = offset.y;
            octaveOffsets[i] = { x: offsetX, y: offsetY };

            maxVal += Math.abs(amplitude);
            amplitude *= persistence;
        }

        const noiseMap: number[][] = Array.from(
            { length: height },
            () => new Array<number>(width)
        );

        let minLocalVal = 9999999;
        let maxLocalVal = -9999999;

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let noiseHeight = 0;
                let frequency = 1;
                amplitude = 1;

                for (let i = 0; i < octaveCount; i++) {
                    const sampleX =
                        ((x - halfWidth + octaveOffsets[i].x) / scale) *
                        frequency;
                    const sampleY =
                        ((y - halfHeight + octaveOffsets[i].y) / scale) *
                        frequency;

                    const pNoise = noise.simplex2(sampleX, sampleY);
                    noiseHeight += pNoise * amplitude;

                    amplitude *= persistence;
                    frequency *= lacunarity;
                }

                noiseMap[y][x] = noiseHeight;

                if (minLocalVal > noiseMap[y][x]) minLocalVal = noiseMap[y][x];
                if (maxLocalVal < noiseMap[y][x]) maxLocalVal = noiseMap[y][x];
            }
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (normalizeMode === 'local')
                    noiseMap[y][x] = this.invLerp(
                        minLocalVal,
                        maxLocalVal,
                        noiseMap[y][x]
                    );
                else
                    noiseMap[y][x] =
                        (noiseMap[y][x] + maxVal) / (2 * maxVal);

                noiseMap[y][x] = this.clamp01(noiseMap[y][x] * multiplier);
            }
        }

        return noiseMap;
    }

    // Returns a value between A and B.
    static mergeValues(a: number, b: number): number {
        return (a + b) / 2;
    }

    static distance(a: { x: number; y: number }, b: { x: number; y: number }) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
}
