import WorldDimensions from '../data/WorldDimensions';
import Vector2 from '../utils/Vector2';
import Noise from '../utils/Noise';

export default class WorldGenerator {
    private _worldDimensions: WorldDimensions;
    private _halfWorldWidth: number;
    private _halfWorldHeight: number;
    private _seed: number;

    private _noise: Noise;

    constructor(worldDimensions: WorldDimensions, seed: number) {
        this._worldDimensions = worldDimensions;
        this._halfWorldWidth = worldDimensions.xKM / 2;
        this._halfWorldHeight = worldDimensions.yKM / 2;
        this._seed = seed;

        this._noise = new Noise(this._seed);
    }

    /**
     * @note Must be called after init().
     * @param zoom The zoom level. Should be in the range of 0 to 1.
     */
    update(viewSize: Vector2, pos: Vector2, zoom: number): number[][] {
        let width = viewSize.x;
        let height = viewSize.y;
        let halfWidth = width / 2;
        let halfHeight = height / 2;

        let halfWorldWidth = this._worldDimensions.xKM / 2;
        let halfWorldHeight = this._worldDimensions.yKM / 2;

        let points: number[][] = [];
        for (let x = 0; x < width; x++) {
            let totalX = x - halfWidth + pos.x * zoom;
            points.push([]);

            for (let y = 0; y < height; y++) {
                let totalY = y - halfHeight + pos.y * zoom;
                let worldPos = this.getWorldPos(
                    new Vector2(totalX, totalY),
                    zoom
                );
                let point = new Vector2(totalX, totalY);

                if (
                    worldPos.x < -halfWorldWidth ||
                    worldPos.x > halfWorldWidth ||
                    worldPos.y < -halfWorldHeight ||
                    worldPos.y > halfWorldHeight
                ) {
                    points[x].push(0);
                    continue;
                }

                // Scale the point
                point = new Vector2(worldPos.x, worldPos.y);
                let noise = this.generateNoiseValue(point.x, point.y, zoom);
                let val = (noise + 1) / 2;
                points[x].push(val);
            }
        }

        return points;
    }

    generateNoiseValue(globalX: number, globalY: number, zoom: number): number {
        let val = this._noise.generateOctaveNoise(
            globalX / 15,
            globalY / 15,
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
    }

    getWorldDimensions(): WorldDimensions {
        return this._worldDimensions;
    }

    getWorldPos(offset: Vector2, zoom: number): Vector2 {
        return new Vector2(offset.x / zoom, offset.y / zoom);
    }
}
