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
    private _maxConcurrentChunks: number;

    // State for determining if the world should be updated
    private _previousGenerationSignature: string = '';

    constructor(worldDimensions: WorldDimensions, maxConcurrentChunks: number = 4) {
        this._halfWorldWidth = worldDimensions.xKM / 2;
        this._halfWorldHeight = worldDimensions.yKM / 2;
        this._maxConcurrentChunks = Math.max(1, Math.floor(maxConcurrentChunks));

        const largestDimension = Math.max(worldDimensions.xKM, worldDimensions.yKM);
        this._gridSystem = new GridSystem(largestDimension);
    }

    shouldUpdate(bounds: Bounds): boolean {
        const { signature } = this.createGenerationPlan(bounds);
        return signature !== this._previousGenerationSignature;
    }

    async update(
        bounds: Bounds,
        onChunkGenerated: (chunkData: ChunkData, index: number, total: number) => void
    ): Promise<void> {
        const { chunks, signature } = this.createGenerationPlan(bounds);
        this._previousGenerationSignature = signature;

        try {
            let nextChunkIndex = 0;
            const generateChunks = async () => {
                while (nextChunkIndex < chunks.length) {
                    const index = nextChunkIndex++;
                    const { bounds: chunkBounds, detail } = chunks[index];
                    const chunkData = await this.generateChunkData(chunkBounds, detail);
                    onChunkGenerated(chunkData, index, chunks.length);
                }
            };

            await Promise.all(
                Array.from(
                    { length: Math.min(this._maxConcurrentChunks, chunks.length) },
                    () => generateChunks()
                )
            );
        } catch (error) {
            if (this._previousGenerationSignature === signature) {
                this._previousGenerationSignature = '';
            }
            throw error;
        }
    }

    private createGenerationPlan(bounds: Bounds): {
        chunks: { bounds: Bounds; detail: number }[];
        signature: string;
    } {
        const leafs: QuadTreeNode<ChunkData>[] = [];
        const shares: number[] = [];

        this._gridSystem.update(bounds, (quadNode) => {
            leafs.push(quadNode);
            shares.push(quadNode.getSize() ** this._sizeSignificance);
        });

        const distributedShares: number[] = Utils.distributeInverseShares(shares, this._maxDisplayableTiles);
        const chunks = distributedShares.map((share, index) => {
            const chunkBounds = leafs[index].getBounds();
            return {
                bounds: chunkBounds,
                detail: Math.max(1, Math.round(Math.sqrt(share))),
            };
        });

        const signature = chunks
            .map(({ bounds: chunkBounds, detail }) =>
                `${chunkBounds.x},${chunkBounds.y},${chunkBounds.width},${chunkBounds.height},${detail}`
            )
            .join('|');

        return { chunks, signature };
    }

    async generateChunkData(bounds: Bounds, detail: number): Promise<ChunkData> {
        const sizePerTile = bounds.width / detail;
        const pos = new Vector2(bounds.x - this._halfWorldWidth, bounds.y - this._halfWorldHeight);

        const newChunkData = new ChunkData(bounds.x, bounds.y, bounds.width);
        const pointsPerAxis = detail + 1;
        const values = await this.generateValuesMap(pos.x, pos.y, pointsPerAxis, pointsPerAxis, sizePerTile);
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
