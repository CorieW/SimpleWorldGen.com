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
            let bounds = quadNode.getBounds();
            let newChunkData = new ChunkData(bounds.x, bounds.y, bounds.width);
            drawChunkData(newChunkData);
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
}
