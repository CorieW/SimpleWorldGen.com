import { NodeEffectEnum } from '../enums/NodeEffectEnum';
import { NodeTypeEnum } from '../enums/NodeTypeEnum';
import { NoiseTypeEnum } from '../enums/NoiseTypeEnum';
import { ScalingTypeEnum } from '../enums/ScalingTypeEnum';
import { VisualizationColorTypeEnum } from '../enums/VisualizationColorTypeEnum';
import { VisualizationConditionalOperatorEnum } from '../enums/VisualizationConditionalOperatorEnum';
import { VisualizationTypeEnum } from '../enums/VisualizationTypeEnum';
import { ILayer } from '../interfaces/ILayer';
import { INode } from '../interfaces/INode';
import { ISimplexNoiseNode } from '../interfaces/ISimplexNoiseNode';
import { IWorldSettings } from '../interfaces/IWorldSettings';
import { IVisualizationCondition } from '../interfaces/visualization/IVisualizationCondition';
import { IVisualizationSetting } from '../interfaces/visualization/IVisualizationSetting';

export type WorldSaveData = {
    worldSettings: IWorldSettings;
    layers: ILayer[];
    visualizationSettings: IVisualizationSetting[];
};

export function parseWorldSaveData(value: unknown): WorldSaveData {
    const data = recordValue(value);
    return {
        worldSettings: parseWorldSettings(data.worldSettings),
        layers: arrayValue(data.layers).map(parseLayer),
        visualizationSettings: arrayValue(data.visualizationSettings).map(parseVisualizationSetting),
    };
}

function parseWorldSettings(value: unknown): IWorldSettings {
    const settings = recordValue(value);
    return {
        worldWidth: numberValue(settings.worldWidth),
        worldHeight: numberValue(settings.worldHeight),
        backgroundColor: stringValue(settings.backgroundColor),
        fadeOff: booleanValue(settings.fadeOff),
        xFadeOffPercentage: numberValue(settings.xFadeOffPercentage),
        yFadeOffPercentage: numberValue(settings.yFadeOffPercentage),
    };
}

function parseLayer(value: unknown): ILayer {
    const layer = recordValue(value);
    return {
        id: numberValue(layer.id),
        name: stringValue(layer.name),
        beginningNode: parseNode(layer.beginningNode),
    };
}

function parseNode(value: unknown): INode {
    const node = recordValue(value);
    const type = enumValue(node.type, NodeTypeEnum);
    const nextNode = node.nextNode === null ? null : parseNode(node.nextNode);
    const effect = node.effect === null ? null : enumValue(node.effect, NodeEffectEnum);

    if (type === NodeTypeEnum.Noise) {
        const noiseType = enumValue(node.noiseType, NoiseTypeEnum);
        if (noiseType === NoiseTypeEnum.Simplex) {
            const simplexNode: ISimplexNoiseNode = {
                id: numberValue(node.id),
                type,
                effect,
                nextNode,
                noiseType,
                seed: numberValue(node.seed),
                multiplier: numberValue(node.multiplier),
                octaves: numberValue(node.octaves),
                persistence: numberValue(node.persistence),
                lacunarity: numberValue(node.lacunarity),
                frequency: numberValue(node.frequency),
                offsetX: numberValue(node.offsetX),
                offsetY: numberValue(node.offsetY),
            };
            return simplexNode;
        }
    }

    throw new Error('Invalid node');
}

function parseVisualizationSetting(value: unknown): IVisualizationSetting {
    const setting = recordValue(value);
    const parsed: IVisualizationSetting = {
        type: enumValue(setting.type, VisualizationTypeEnum),
        colorType: enumValue(setting.colorType, VisualizationColorTypeEnum),
        color: stringValue(setting.color),
        conditions: arrayValue(setting.conditions).map(parseVisualizationCondition),
    };

    if (setting.minScale !== undefined) parsed.minScale = numberValue(setting.minScale);
    if (setting.maxScale !== undefined) parsed.maxScale = numberValue(setting.maxScale);
    if (setting.scalingType !== undefined) parsed.scalingType = enumValue(setting.scalingType, ScalingTypeEnum);
    return parsed;
}

function parseVisualizationCondition(value: unknown): IVisualizationCondition {
    const condition = recordValue(value);
    return {
        layerId: numberValue(condition.layerId),
        condOperator: condition.condOperator === null
            ? null
            : enumValue(condition.condOperator, VisualizationConditionalOperatorEnum),
        min: numberValue(condition.min),
        minInclusive: booleanValue(condition.minInclusive),
        max: numberValue(condition.max),
        maxInclusive: booleanValue(condition.maxInclusive),
    };
}

function recordValue(value: unknown): Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Expected object');
    return value as Record<string, unknown>;
}

function arrayValue(value: unknown): unknown[] {
    if (!Array.isArray(value)) throw new Error('Expected array');
    return value;
}

function stringValue(value: unknown): string {
    if (typeof value !== 'string') throw new Error('Expected string');
    return value;
}

function booleanValue(value: unknown): boolean {
    if (typeof value !== 'boolean') throw new Error('Expected boolean');
    return value;
}

function numberValue(value: unknown): number {
    if ((typeof value !== 'number' && typeof value !== 'string') || value === '') throw new Error('Expected number');
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new Error('Expected finite number');
    return parsed;
}

function enumValue<T extends string>(value: unknown, values: Record<string, T>): T {
    if (typeof value !== 'string' || !Object.values(values).includes(value as T)) throw new Error('Invalid enum value');
    return value as T;
}
