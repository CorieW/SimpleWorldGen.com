import { INoiseNode } from "./INoiseNode";

export interface ISimplexNoiseNode extends INoiseNode {
    octaves: number,
    persistence: number,
    lacunarity: number,
    frequency: number,
    offsetX: number,
    offsetY: number
}