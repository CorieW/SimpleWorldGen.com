export default class NoiseSettings {
    seed: number;
    noiseScale: number;
    noiseOctaves: number;
    noisePersistence: number;
    noiseLacunarity: number;
    noiseOffset: number;
    noiseMultiplier: number;

    constructor(
        seed: number,
        noiseScale: number,
        noiseOctaves: number,
        noisePersistence: number,
        noiseLacunarity: number,
        noiseOffset: number,
        noiseMultiplier: number
    ) {
        this.seed = seed;
        this.noiseScale = noiseScale;
        this.noiseOctaves = noiseOctaves;
        this.noisePersistence = noisePersistence;
        this.noiseLacunarity = noiseLacunarity;
        this.noiseOffset = noiseOffset;
        this.noiseMultiplier = noiseMultiplier;
    }
}
