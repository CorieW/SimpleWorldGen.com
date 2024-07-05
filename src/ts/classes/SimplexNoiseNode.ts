import { NodeTypeEnum } from "../enums/NodeTypeEnum";
import { NodeEffectEnum } from "../enums/NodeEffectEnum";
import { INode } from "../interfaces/INode";
import { NoiseTypeEnum } from "../enums/NoiseTypeEnum";
import { ISimplexNoiseNode } from "../interfaces/ISimplexNoiseNode";
import Noise from '../utils/Noise';

export class SimplexNoiseNode implements ISimplexNoiseNode {
    id: number;
    type: NodeTypeEnum;
    effect: NodeEffectEnum | null;
    nextNode: INode | null;
    seed: number;
    noiseType: NoiseTypeEnum;
    octaves: number;
    persistence: number;
    lacunarity: number;
    frequency: number;
    offsetX: number;
    offsetY: number;

    public constructor(
        id: number,
        effect: NodeEffectEnum | null,
        nextNode: INode | null,
        seed: number,
        octaves: number,
        persistence: number,
        lacunarity: number,
        frequency: number,
        offsetX: number,
        offsetY: number,
    ) {
        this.id = id;
        this.type = NodeTypeEnum.Noise
        this.effect = effect;
        this.nextNode = nextNode;
        this.seed = seed;
        this.noiseType = NoiseTypeEnum.Simplex;
        this.octaves = octaves;
        this.persistence = persistence;
        this.lacunarity = lacunarity;
        this.frequency = frequency;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    getDrawData(width: number, height: number): number[] {
        const { seed, octaves, persistence, lacunarity, frequency, offsetX, offsetY } = this as ISimplexNoiseNode;

        const noise = new Noise(seed);
        const pixelData = []

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let noiseValue = noise.generateOctaveNoise(
                    x,
                    y,
                    octaves,
                    persistence,
                    lacunarity,
                    frequency,
                    { x: offsetX, y: offsetY }
                );

                let index = (x + y * width) * 4;
                pixelData[index] = noiseValue * 255;
                pixelData[index + 1] = noiseValue * 255;
                pixelData[index + 2] = noiseValue * 255;
                pixelData[index + 3] = 255;
            }
        }

        return pixelData;
    }

}