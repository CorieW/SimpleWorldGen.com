import { INode } from './INode';
import { NoiseTypeEnum } from '../../enums/NoiseTypeEnum';

export interface INoiseNode extends INode {
    noiseType: NoiseTypeEnum,
    seed: number,
    multiplier: number,
}