import WorldDimensions from './data/WorldDimensions';
import Vector2 from './utils/Vector2';
import Noise from './utils/Noise';
import Tile from './obsolete/Tile';
import Bounds from './data/Bounds';
import GridSystem from './data/GridSystem';
import ChunkData from './data/ChunkData';

export default class WorldGenerator {
    private _worldDimensions: WorldDimensions;
    private _halfWorldWidth: number;
    private _halfWorldHeight: number;
    private _seed: number;

    private _noise: Noise;
    private _gridSystem: GridSystem<ChunkData>;

    constructor(worldDimensions: WorldDimensions, seed: number) {
        this._worldDimensions = worldDimensions;
        this._halfWorldWidth = worldDimensions.xKM / 2;
        this._halfWorldHeight = worldDimensions.yKM / 2;
        this._seed = seed;

        this._noise = new Noise(this._seed);

        let largestDimension = Math.max(worldDimensions.xKM, worldDimensions.yKM);
        this._gridSystem = new GridSystem(largestDimension);
    }

    update(bounds: Bounds, drawChunkData: (chunkData: ChunkData) => void) {
        this._gridSystem.update(bounds, (quadNode) => {
            drawChunkData(quadNode.getData());
        });
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

    // /**
    //  * @param quality Should be in the range of 0 to 1.
    //  * @returns The detail, which is the number of points on a single axis in the tile.
    //  */
    // private getDetail(quality: number): number {
    //     if (quality < 0 || quality > 1)
    //         throw new Error('Quality must be in the range of 0 to 1.');
    //     let detail = Math.max(
    //         this._tilingSettings.detail * quality,
    //         this._tilingSettings.lowestDetail
    //     );
    //     return detail;
    // }
}
