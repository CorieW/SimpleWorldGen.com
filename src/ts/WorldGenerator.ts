import WorldDimensions from './data/WorldDimensions';
import Vector2 from './utils/Vector2';
import Noise from './utils/Noise';
import Tile from './obsolete/Tile';
import Bounds from './data/Bounds';
import GridSystem from './data/GridSystem';
import ChunkData from './data/ChunkData';
import QuadTreeNode from './data/QuadTreeNode';

export default class WorldGenerator {
    private _worldDimensions: WorldDimensions;
    private _halfWorldWidth: number;
    private _halfWorldHeight: number;
    private _seed: number;

    private _noise: Noise;
    private _gridSystem: GridSystem<ChunkData>;
    private _maxDisplayableTiles: number = 1000;

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
        let leafs: QuadTreeNode<ChunkData>[] = [];
        let shares: number[] = [];

        this._gridSystem.update(bounds, (quadNode) => {
            leafs.push(quadNode);
            shares.push(quadNode.getSize());
        });

        let distributedShares: number[] = this.distributeInverseShares(shares, this._maxDisplayableTiles);

        distributedShares.forEach((share, index) => {
            let bounds = leafs[index].getBounds();
            let newChunkData = new ChunkData(bounds.x, bounds.y, bounds.width);
            newChunkData.addData(this.generateChunkData(bounds, share));
            drawChunkData(newChunkData);
        });
    }

    generateChunkData(bounds: Bounds, detail: number): number[][] {
        detail = Math.round(Math.sqrt(detail));
        console.log('detail', detail);
        let halfDetail = detail / 2;
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

                // if (
                //     worldPos.x < -halfWorldWidth ||
                //     worldPos.x > halfWorldWidth ||
                //     worldPos.y < -halfWorldHeight ||
                //     worldPos.y > halfWorldHeight
                // ) {
                //     points[x].push(0);
                //     continue;
                // }

                // Scale the point
                let noise = this.generateNoiseValue(worldPos.x, worldPos.y);
                let val = (noise + 1) / 2;
                points[x].push(val);
            }
        }

        return points;
    }

    generateNoiseValue(globalX: number, globalY: number): number {
        let val = this._noise.generateOctaveNoise(
            globalX / 150,
            globalY / 150,
            4,
            0.5,
            1
        );

        // let x2 = x * zoom
        // let y2 = y * zoom

        let xDistFromCenter = Math.abs(globalX) / this._halfWorldWidth;
        let yDistFromCenter = Math.abs(globalY) / this._halfWorldHeight;
        let totalDistFromCenter = Math.sqrt(
            Math.pow(xDistFromCenter, 6) + Math.pow(yDistFromCenter, 6)
        );

        return val - totalDistFromCenter;
        // return val;
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
