import WorldGenMath from "./WorldGenMath";
import WorldGeneratorFoundation from "./WorldGeneratorFoundation";
import WorldDimensions from "./data/WorldDimensions";
import { ILayer } from "./interfaces/ILayer";
import IDictionary from './utils/IDictionary';
import { NodeValueCalculator } from "./utils/LayerValueCalculator";

export default class WorldGenerator extends WorldGeneratorFoundation {
    private _layers: ILayer[];
    private _prevNodeValueCalculators: NodeValueCalculator[] = [];

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
        super(worldDimensions);
        this._layers = ILayers;
    }

    override generateValuesMap(globalX: number, globalY: number, width: number, height: number, spread: number): Promise<IDictionary<number>[][]> {
        // Terminate previous workers
        // this._prevNodeValueCalculators.forEach((calculator) => {
        //     calculator.terminateWorker();
        // });

        // * What exactly does this do?
        // For each layer, a map of values are calculated based on the layer properties.
        // calculateMap calculates the map of values on a separate thread, promising that
        // the values will be resolved.
        // Once the values for each layer are resolved, the values are stored in a dictionary
        // with the layer id as the key.
        return new Promise((resolve, reject) => {
            const indexToLayerId: IDictionary<number> = {};
            const promises: Promise<number[][]>[] = this._layers.map((layer: ILayer, index: number) => {
                indexToLayerId[index] = layer.id;
                const calculator = new NodeValueCalculator(layer.beginningNode);
                this._prevNodeValueCalculators.push(calculator);
                return calculator.calculateMap(width, height, globalX, globalY, spread);
            });

            const values: IDictionary<number>[][] = [];

            // Wait for the values of each layer to be resolved
            Promise.all(promises).then((layerValuesArr) => {
                layerValuesArr.forEach((layerValues, index) => {
                    for (let y = 0; y < layerValues.length; y++) {
                        // Initialize the values array for the x index if it doesn't exist
                        if (!values[y]) {
                            values[y] = [];
                        }

                        for (let x = 0; x < layerValues[y].length; x++) {
                            // Initialize an object for the values at the x, y index if it doesn't exist
                            if (!values[y][x]) {
                                values[y][x] = {};
                            }

                            // Apply falloff
                            const scaledXDistFromCenter = Math.abs(globalX + (x * spread)) / this._halfWorldWidth;
                            let xFadeOffMultiplier = WorldGenMath.invLerp(1, this.xFadeOffEndRange, scaledXDistFromCenter);
                            if (this.xFadeOffEndRange == 1) {
                                xFadeOffMultiplier = 1;
                            }

                            const scaledYDistFromCenter = Math.abs(globalY + (y * spread)) / this._halfWorldHeight;
                            let yFadeOffMultiplier = WorldGenMath.invLerp(1, this.yFadeOffEndRange, scaledYDistFromCenter);
                            if (this.yFadeOffEndRange == 1) {
                                yFadeOffMultiplier = 1;
                            }

                            const combinedFadeOffMultiplier = Math.sqrt(xFadeOffMultiplier * yFadeOffMultiplier);

                            let value = layerValues[y][x] * combinedFadeOffMultiplier;
                            value = Math.min(1, Math.max(0, value));
                            values[y][x][indexToLayerId[index]] = value;
                        }
                    }
                });

                resolve(values);
            }).catch((error) => {
                reject(error);
            })
        });
    }
}