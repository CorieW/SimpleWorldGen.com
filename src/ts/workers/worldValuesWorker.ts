import { makeNoise2D } from 'open-simplex-noise';
import { NodeEffectEnum } from '../enums/NodeEffectEnum';
import { NodeTypeEnum } from '../enums/NodeTypeEnum';
import { NoiseTypeEnum } from '../enums/NoiseTypeEnum';
import { ILayer } from '../interfaces/ILayer';
import { INode } from '../interfaces/INode';
import { INoiseNode } from '../interfaces/INoiseNode';
import { ISimplexNoiseNode } from '../interfaces/ISimplexNoiseNode';
import IDictionary from '../utils/IDictionary';

type WorldValuesRequest = {
    layers: ILayer[];
    width: number;
    height: number;
    x: number;
    y: number;
    spread: number;
    halfWorldWidth: number;
    halfWorldHeight: number;
    xFadeOffEndRange: number;
    yFadeOffEndRange: number;
};

self.onmessage = function(event: MessageEvent<WorldValuesRequest>) {
    const {
        layers,
        width,
        height,
        x,
        y,
        spread,
        halfWorldWidth,
        halfWorldHeight,
        xFadeOffEndRange,
        yFadeOffEndRange,
    } = event.data;

    const valueCount = width * height;
    const fadeMultipliers = generateFadeMultipliers();
    const values: IDictionary<number>[][] = Array.from(
        { length: height },
        () => Array.from({ length: width }, () => ({}))
    );

    layers.forEach((layer) => {
        const layerValues = generateLayer(layer);

        for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {
            const valueX = valueIndex % width;
            const valueY = Math.floor(valueIndex / width);
            const value = clamp01(layerValues[valueIndex] * fadeMultipliers[valueIndex]);
            values[valueY][valueX][layer.id] = value;
        }
    });

    self.postMessage(values);

    function generateLayer(layer: ILayer): Float64Array {
        let currentNode: INode | null = layer.beginningNode;
        const combinedValues = generateNode(currentNode);

        while (currentNode.nextNode) {
            currentNode = currentNode.nextNode;
            combineValues(combinedValues, generateNode(currentNode), currentNode.effect);
        }

        return combinedValues;
    }

    function generateNode(node: INode): Float64Array {
        if (node.type !== NodeTypeEnum.Noise) {
            return new Float64Array(valueCount);
        }

        const noiseNode = node as INoiseNode;
        if (noiseNode.noiseType !== NoiseTypeEnum.Simplex) {
            return new Float64Array(valueCount);
        }

        return generateSimplexNoise(noiseNode as ISimplexNoiseNode);
    }

    function generateSimplexNoise(node: ISimplexNoiseNode): Float64Array {
        const noise = makeNoise2D(Number(node.seed));
        const multiplier = Number(node.multiplier);
        const configuredOctaves = Math.floor(Number(node.octaves));
        const octaves = Number.isFinite(configuredOctaves) && configuredOctaves >= 1
            ? configuredOctaves
            : 1;
        const persistence = Number(node.persistence);
        const lacunarity = Number(node.lacunarity);
        const frequency = Number(node.frequency);
        const offsetX = Number(node.offsetX) + x;
        const offsetY = Number(node.offsetY) + y;
        const noiseValues = new Float64Array(valueCount);

        for (let valueY = 0; valueY < height; valueY++) {
            for (let valueX = 0; valueX < width; valueX++) {
                let noiseValue = 0;
                let amplitude = 1;
                let totalAmplitude = 0;

                for (let octave = 0; octave < octaves; octave++) {
                    const currentFrequency = frequency * Math.pow(lacunarity, octave);
                    noiseValue += noise(
                        (offsetX + valueX * spread) * currentFrequency,
                        (offsetY + valueY * spread) * currentFrequency
                    ) * amplitude;
                    totalAmplitude += Math.abs(amplitude);
                    amplitude *= persistence;
                }

                const normalizedValue = (noiseValue + totalAmplitude) / (2 * totalAmplitude);
                noiseValues[valueY * width + valueX] = normalizedValue * multiplier;
            }
        }

        return noiseValues;
    }

    function combineValues(target: Float64Array, source: Float64Array, effect: NodeEffectEnum | null) {
        for (let index = 0; index < target.length; index++) {
            switch (effect) {
                case NodeEffectEnum.Add:
                    target[index] += source[index];
                    break;
                case NodeEffectEnum.Subtract:
                    target[index] -= source[index];
                    break;
                case NodeEffectEnum.Multiply:
                    target[index] *= source[index];
                    break;
                case NodeEffectEnum.Divide:
                    target[index] /= source[index];
                    break;
            }
        }
    }

    function generateFadeMultipliers(): Float64Array {
        const multipliers = new Float64Array(valueCount);

        for (let valueY = 0; valueY < height; valueY++) {
            for (let valueX = 0; valueX < width; valueX++) {
                const scaledXDistance = Math.abs(x + valueX * spread) / halfWorldWidth;
                const xMultiplier = xFadeOffEndRange === 1
                    ? 1
                    : inverseLerp(1, xFadeOffEndRange, scaledXDistance);

                const scaledYDistance = Math.abs(y + valueY * spread) / halfWorldHeight;
                const yMultiplier = yFadeOffEndRange === 1
                    ? 1
                    : inverseLerp(1, yFadeOffEndRange, scaledYDistance);

                multipliers[valueY * width + valueX] = Math.sqrt(xMultiplier * yMultiplier);
            }
        }

        return multipliers;
    }
};

function inverseLerp(min: number, max: number, value: number): number {
    if (min === max) return value >= max ? 1 : 0;
    return clamp01((value - min) / (max - min));
}

function clamp01(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.min(1, Math.max(0, value));
}
