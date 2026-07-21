import WorldGeneratorFoundation from "./WorldGeneratorFoundation";
import WorldDimensions from "./data/WorldDimensions";
import { ILayer } from "./interfaces/ILayer";
import { INode } from "./interfaces/INode";
import IDictionary from './utils/IDictionary';
import WorldValuesCalculator from "./utils/WorldValuesCalculator";

export default class WorldGenerator extends WorldGeneratorFoundation {
    private _layers: ILayer[];
    private _activeWorldValueCalculators: Set<WorldValuesCalculator> = new Set();

    /**
     * The range of the fade off effect. The fade off effect is a gradient that
     * fades off the edges of the world.
     *
     * For example, if the fade off range is 0.5, then the fade off effect will
     * end half way between the center of the world and the edge of the world.
     */
    public xFadeOffEndRange: number = 0.5;
    public yFadeOffEndRange: number = 0.5;

    constructor(worldDimensions: WorldDimensions, ILayers: ILayer[]) {
        super(worldDimensions, getMaxConcurrentChunks(ILayers));
        this._layers = ILayers;
    }

    override async generateValuesMap(globalX: number, globalY: number, width: number, height: number, spread: number): Promise<IDictionary<number>[][]> {
        const calculator = new WorldValuesCalculator(this._layers);
        this._activeWorldValueCalculators.add(calculator);

        try {
            return await calculator.calculateMap(
                width,
                height,
                globalX,
                globalY,
                spread,
                this._halfWorldWidth,
                this._halfWorldHeight,
                this.xFadeOffEndRange,
                this.yFadeOffEndRange
            );
        } finally {
            calculator.terminateWorker();
            this._activeWorldValueCalculators.delete(calculator);
        }
    }

    cancelPendingGeneration() {
        this._activeWorldValueCalculators.forEach((calculator) => calculator.terminateWorker());
        this._activeWorldValueCalculators.clear();
    }
}

function getMaxConcurrentChunks(layers: ILayer[]): number {
    let calculationsPerChunk = 0;

    layers.forEach((layer) => {
        let currentNode: INode | null = layer.beginningNode;
        while (currentNode) {
            calculationsPerChunk++;
            currentNode = currentNode.nextNode;
        }
    });

    const availableThreads = typeof navigator === 'undefined'
        ? 4
        : navigator.hardwareConcurrency || 4;

    return Math.min(
        8,
        Math.max(1, Math.ceil(availableThreads / Math.max(1, calculationsPerChunk)))
    );
}
