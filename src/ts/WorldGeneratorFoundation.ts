import WorldDimensions from './data/WorldDimensions';
import Vector2 from './utils/Vector2';
import Bounds from './data/Bounds';
import GridSystem from './data/GridSystem';
import ChunkData from './data/ChunkData';
import QuadTreeNode from './data/QuadTreeNode';
import IDictionary from './utils/IDictionary';
import Utils from './utils/Utils';

// TODO: A function for computing the difference between previous and current tiles
// TODO: Only load in tiles which have been changed
// TODO: A way of identifying tiles which have been changed
export default abstract class WorldGeneratorFoundation {
    protected _halfWorldWidth: number;
    protected _halfWorldHeight: number;

    private _gridSystem: GridSystem<ChunkData>;
    private _maxDisplayableTiles: number = 5000;
    private _sizeSignificance: number = 2;

    // State for determining if the world should be updated
    private _previousDistributedShares: number[] = [];

    constructor(worldDimensions: WorldDimensions) {
        this._halfWorldWidth = worldDimensions.xKM / 2;
        this._halfWorldHeight = worldDimensions.yKM / 2;

        let largestDimension = Math.max(worldDimensions.xKM, worldDimensions.yKM);
        this._gridSystem = new GridSystem(largestDimension);
    }

    shouldUpdate(bounds: Bounds): boolean {
        let leafs: QuadTreeNode<ChunkData>[] = [];
        let shares: number[] = [];

        this._gridSystem.update(bounds, (quadNode) => {
            leafs.push(quadNode);
            shares.push(quadNode.getSize() ^ this._sizeSignificance);
        });

        let distributedShares: number[] = Utils.distributeInverseShares(shares, this._maxDisplayableTiles);

        return this._previousDistributedShares.length !== distributedShares.length || !distributedShares.every((share, index) => share === this._previousDistributedShares[index]);
    }

    update(bounds: Bounds, onGenerated: (chunkData: ChunkData) => void) {
        let leafs: QuadTreeNode<ChunkData>[] = [];
        let shares: number[] = [];

        this._gridSystem.update(bounds, (quadNode) => {
            leafs.push(quadNode);
            shares.push(quadNode.getSize() ^ this._sizeSignificance);
        });

        let distributedShares: number[] = Utils.distributeInverseShares(shares, this._maxDisplayableTiles);
        distributedShares.forEach((share, index) => {
            const bounds = leafs[index].getBounds();
            const detail = Math.round(Math.sqrt(share));
            this.generateChunkData(bounds, detail).then((data) => {
                onGenerated(data);
            })
        });

        this._previousDistributedShares = distributedShares;
    }

    async generateChunkData(bounds: Bounds, detail: number): Promise<ChunkData> {
        const sizePerTile = bounds.width / detail;
        const pos = new Vector2(bounds.x - this._halfWorldWidth, bounds.y - this._halfWorldHeight);

        const newChunkData = new ChunkData(bounds.x, bounds.y, bounds.width);
        const values = await this.generateValuesMap(pos.x, pos.y, detail, detail, sizePerTile);
        newChunkData.addData(values);

        return newChunkData;
    }

    /**
     * The function to be used for generating the values for each point in the world.
     * Each value in the dictionary represents a different value, perhaps from a different
     * layer of.
     */
    abstract generateValuesMap(globalX: number, globalY: number, width: number, height: number, spread: number): Promise<IDictionary<number>[][]>;
}
