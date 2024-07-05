import { NodeEffectEnum } from "../enums/NodeEffectEnum";
import { NodeTypeEnum } from "../enums/NodeTypeEnum";
import { NoiseTypeEnum } from "../enums/NoiseTypeEnum";
import { INode } from "../interfaces/INode"
import { INoiseNode } from "../interfaces/INoiseNode";
import { ISimplexNoiseNode } from "../interfaces/ISimplexNoiseNode";
import Noise from "./Noise";

export class NodeValueCalculator {
    private node: INode;

    constructor(node: INode) {
        this.node = node;
    }

    calculateValue(x: number, y: number): number {
        let currentNode: INode | null = this.node;
        let noiseVal = 0;

        if (!currentNode) return noiseVal;

        let effect: NodeEffectEnum | null = null;

        do {
            let currentNoiseVal = this.calculateNodeValue(currentNode, x, y);

            switch (effect) {
                case NodeEffectEnum.Add:
                    noiseVal += currentNoiseVal;
                    break;
                case NodeEffectEnum.Subtract:
                    noiseVal -= currentNoiseVal;
                    break;
                case NodeEffectEnum.Multiply:
                    noiseVal *= currentNoiseVal;
                    break;
                case NodeEffectEnum.Divide:
                    noiseVal /= currentNoiseVal;
                    break;
                default:
                    noiseVal = currentNoiseVal;
                    break;
            }

            currentNode = currentNode.nextNode;
            effect = currentNode && currentNode.effect;
        } while (currentNode);

        return Math.min(1, Math.max(0, noiseVal));
    }

    private calculateNodeValue(node: INode, x: number, y: number): number {
        switch (node.type) {
            case NodeTypeEnum.Noise:
                const noiseNode = node as INoiseNode;

                switch (noiseNode.noiseType) {
                    case NoiseTypeEnum.Simplex:
                        const simplexNoiseNode = noiseNode as ISimplexNoiseNode;
                        const { octaves, persistence, lacunarity, frequency, offsetX, offsetY } = simplexNoiseNode;
                        return new Noise(noiseNode.seed).generateOctaveNoise(x, y, octaves, persistence, lacunarity, frequency, { x: offsetX, y: offsetY }) * noiseNode.multiplier;
                    default:
                        return 0;
                }
            default:
                return 0;
        }
    }
}