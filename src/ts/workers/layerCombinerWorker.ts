import { NodeEffectEnum } from "../enums/NodeEffectEnum";
import { NodeTypeEnum } from "../enums/NodeTypeEnum";
import { NoiseTypeEnum } from "../enums/NoiseTypeEnum";
import { INode } from "../interfaces/INode";
import { INoiseNode } from "../interfaces/INoiseNode";
import { ISimplexNoiseNode } from "../interfaces/ISimplexNoiseNode";
import Noise from "../utils/Noise";

self.onmessage = function(event) {
    const data = event.data;
    const { node, width, height } = data;

    if (!node) self.postMessage([]);

    const eachNodeNoiseValuesDict: { [key: string]: number[][] } = {};
    const promises: Promise<void>[] = [];

    let currentNode: INode | null = node;
    let totalNodes = 0;
    do {
        totalNodes++;

        switch (node.type) {
            case NodeTypeEnum.Noise:
                const noiseNode = node as INoiseNode;

                switch (noiseNode.noiseType) {
                    case NoiseTypeEnum.Simplex:
                        const simplexNoiseNode = noiseNode as ISimplexNoiseNode;
                        const { seed, octaves, persistence, lacunarity, frequency, offsetX, offsetY } = simplexNoiseNode;
                        const promise = new Noise(seed, octaves, persistence, lacunarity, frequency).generateNoiseMap(width, height, { x: offsetX, y: offsetY }).then(noiseMap => {
                            eachNodeNoiseValuesDict[node.id] = noiseMap;
                        }).catch(error => {
                            console.error(error);
                            eachNodeNoiseValuesDict[node.id] = generateEmptyMap(width, height);
                        });
                        promises.push(promise);
                        break;
                    default:
                        console.error('Invalid noise type');
                        eachNodeNoiseValuesDict[node.id] = generateEmptyMap(width, height);
                }
                break;
            default:
                console.error('Invalid node type');
                eachNodeNoiseValuesDict[node.id] = generateEmptyMap(width, height);
        }
        currentNode = currentNode!.nextNode;
    } while (currentNode);

    // Wait until all noise maps are generated
    Promise.all(promises).then(() => {
        // Calculate the combined noise values
        currentNode = node;
        let effect: NodeEffectEnum | null = null;
        let noiseVals: number[][] = eachNodeNoiseValuesDict[currentNode!.id];
        while (currentNode!.nextNode) {
            currentNode = currentNode!.nextNode;
            effect = currentNode.effect;
            let currentNoiseVals: number[][] = eachNodeNoiseValuesDict[currentNode.id];
            if (effect) noiseVals = performArithmeticOnMaps(noiseVals, currentNoiseVals, effect);
        }

        // Return the combined noise values clamped between 0 and 1
        self.postMessage(clampMap(noiseVals));
    }).catch(error => {
        console.error(error);
    });

    // TODO: Could utilize the GPU for this operation, since it's a parallel operation
    // TODO: Could perform on more than 2 noise maps if I were to utilize the GPU
    function performArithmeticOnMaps(map1: number[][], map2: number[][], effect: NodeEffectEnum): number[][] {
        switch (effect) {
            case NodeEffectEnum.Add:
                return addMaps(map1, map2);
            case NodeEffectEnum.Subtract:
                return subtractMaps(map1, map2);
            case NodeEffectEnum.Multiply:
                return multiplyMaps(map1, map2);
            case NodeEffectEnum.Divide:
                return divideMaps(map1, map2);
            default:
                return map1;
        }

        function addMaps(map1: number[][], map2: number[][]): number[][] {
            return map1.map((row, y) => row.map((val, x) => val + map2[y][x]));
        }

        function subtractMaps(map1: number[][], map2: number[][]): number[][] {
            return map1.map((row, y) => row.map((val, x) => val - map2[y][x]));
        }

        function multiplyMaps(map1: number[][], map2: number[][]): number[][] {
            return map1.map((row, y) => row.map((val, x) => val * map2[y][x]));
        }

        function divideMaps(map1: number[][], map2: number[][]): number[][] {
            return map1.map((row, y) => row.map((val, x) => val / map2[y][x]));
        }
    }

    // ? Could this be generated on the GPU?
    function clampMap(map: number[][]): number[][] {
        return map.map(row => row.map(val => Math.min(1, Math.max(0, val))));
    }

    // ? Could this be generated on the GPU?
    function generateEmptyMap(width: number, height: number): number[][] {
        return Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
    }
};