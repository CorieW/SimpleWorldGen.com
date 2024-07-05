import WorldDimensions from './data/WorldDimensions';
import Vector2 from './utils/Vector2';
import Bounds from './data/Bounds';
import GridSystem from './data/GridSystem';
import ChunkData from './data/ChunkData';
import QuadTreeNode from './data/QuadTreeNode';
import WorldGenMath from './WorldGenMath';

export default class WorldGenerator {
    private _worldDimensions: WorldDimensions;
    private _halfWorldWidth: number;
    private _halfWorldHeight: number;

    private generateNoiseValueFunc: (globalX: number, globalY: number) => number;
    private _gridSystem: GridSystem<ChunkData>;
    private _maxDisplayableTiles: number = 5000;
    private _sizeSignificance: number = 2;

    private _previousDistributedShares: number[] = [];

    /**
     * The range of the fade off effect. The fade off effect is a gradient that
     * fades off the edges of the world.
     *
     * For example, if the fade off range is 0.5, then the fade off effect will
     * start half way between the center of the world and the edge of the world.
     */
    public xFadeOffRange: number = 0.5;
    public yFadeOffRange: number = 0.5;

    constructor(worldDimensions: WorldDimensions, generateNoiseValueFunc: (globalX: number, globalY: number) => number) {
        this._worldDimensions = worldDimensions;
        this._halfWorldWidth = worldDimensions.xKM / 2;
        this._halfWorldHeight = worldDimensions.yKM / 2;

        this.generateNoiseValueFunc = generateNoiseValueFunc;

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

        let distributedShares: number[] = this.distributeInverseShares(shares, this._maxDisplayableTiles);

        return this._previousDistributedShares.length !== distributedShares.length || !distributedShares.every((share, index) => share === this._previousDistributedShares[index]);
    }

    update(bounds: Bounds, drawChunkData: (chunkData: ChunkData) => void) {
        let leafs: QuadTreeNode<ChunkData>[] = [];
        let shares: number[] = [];

        this._gridSystem.update(bounds, (quadNode) => {
            leafs.push(quadNode);
            shares.push(quadNode.getSize() ^ this._sizeSignificance);
        });

        let distributedShares: number[] = this.distributeInverseShares(shares, this._maxDisplayableTiles);
        distributedShares.forEach((share, index) => {
            let bounds = leafs[index].getBounds();
            let newChunkData = new ChunkData(bounds.x, bounds.y, bounds.width);
            newChunkData.addData(this.generateChunkData(bounds, share));
            drawChunkData(newChunkData);
        });

        this._previousDistributedShares = distributedShares;
    }

    generateChunkData(bounds: Bounds, detail: number): number[][] {
        detail = Math.round(Math.sqrt(detail));
        let halfWorldWidth = this._worldDimensions.xKM / 2;
        let halfWorldHeight = this._worldDimensions.yKM / 2;
        let sizePerTile = bounds.width / detail;
        // let sizePerTile = 1;

        let points: number[][] = [];
        for (let x = 0; x <= detail; x++) {
            let totalX = (bounds.x + (x * sizePerTile)) - halfWorldWidth;
            points.push([]);

            for (let y = 0; y <= detail; y++) {
                let totalY = (bounds.y + (y * sizePerTile)) - halfWorldHeight;
                let worldPos = new Vector2(totalX, totalY);

                let noiseVal = this.generateNoiseValue(worldPos.x, worldPos.y);
                points[x].push(noiseVal);
            }
        }

        return points;
    }

    generateNoiseValue(globalX: number, globalY: number): number {
        let val = this.generateNoiseValueFunc(globalX, globalY);

        let scaledXDistFromCenter = Math.abs(globalX) / this._halfWorldWidth;
        let xFadeOffMultiplier = WorldGenMath.invLerp(1, this.xFadeOffRange, scaledXDistFromCenter);
        if (this.xFadeOffRange == 1) {
            xFadeOffMultiplier = 1;
        }

        let scaledYDistFromCenter = Math.abs(globalY) / this._halfWorldHeight;
        let yFadeOffMultiplier = WorldGenMath.invLerp(1, this.yFadeOffRange, scaledYDistFromCenter);
        if (this.yFadeOffRange == 1) {
            yFadeOffMultiplier = 1;
        }

        let combinedFadeOffMultiplier = (xFadeOffMultiplier + yFadeOffMultiplier) / 2;

        return val * combinedFadeOffMultiplier;
    }

    private distributeInverseShares(shares: number[], totalValue: number): number[] {
        const totalShares = shares.reduce((acc, share) => acc + share, 0);
        let remainingValue = totalValue;
        const inverseShares = shares.map(share => totalShares - share); // Calculate inverse shares
        const totalInverseShares = inverseShares.reduce((acc, share) => acc + share, 0);

        return shares.map((share, index) => {
            if (index === shares.length - 1) {
                return remainingValue; // Assign remaining value to the last item
            } else {
                const value = Math.round((totalShares - share) / totalInverseShares * totalValue * 100) / 100;
                remainingValue -= value;
                return value;
            }
        });
    }
}
