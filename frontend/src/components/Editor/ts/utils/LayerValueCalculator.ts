import { NodeEffectEnum } from "../../../../ts/enums/NodeEffectEnum";
import { NodeTypeEnum } from "../../../../ts/enums/NodeTypeEnum";
import { NoiseTypeEnum } from "../../../../ts/enums/NoiseTypeEnum";
import { INode } from "../../../../ts/interfaces/generation/INode"
import { INoiseNode } from "../../../../ts/interfaces/generation/INoiseNode";
import { ISimplexNoiseNode } from "../../../../ts/interfaces/generation/ISimplexNoiseNode";
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