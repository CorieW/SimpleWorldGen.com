import WorldDimensions from '../data/WorldDimensions';
import TilingSettings from './TilingSettings';
import NoiseSettings from '../data/NoiseSettings';
import Vector2 from '../utils/Vector2';
import Tile from './Tile';
import TileData from './TileData';
import Bounds from '../data/Bounds';
import { makeNoise2D } from 'open-simplex-noise';

export default class WorldGenerator {
    private _worldDimensions: WorldDimensions;
    private _tilingSettings: TilingSettings;
    private _noiseSettings: NoiseSettings;

    private _tile?: Tile<number>;

    constructor(
        worldDimensions: WorldDimensions,
        tilingSettings: TilingSettings,
        noiseSettings: NoiseSettings
    ) {
        this._worldDimensions = worldDimensions;
        this._tilingSettings = tilingSettings;
        this._noiseSettings = noiseSettings;
    }

    init() {
        let initialSplits = this._tilingSettings.initialScreenSplits;
        let worldWidth = this._worldDimensions.xKM;
        let worldHeight = this._worldDimensions.yKM;

        let halfWorldWidth = worldWidth / 2;
        let halfWorldHeight = worldHeight / 2;

        // Get largest dimension.
        // Used to determine the size of the initial tiles.
        let largestDimension = Math.max(worldWidth, worldHeight);
        let halfLargestDimension = largestDimension / 2;

        let tile = new Tile<number>(
            -halfWorldWidth,
            -halfWorldHeight,
            halfLargestDimension
        );
        tile.split(initialSplits);

        this._tile = tile;
    }

    /**
     * @note Must be called after init().
     * @param zoom The zoom level. Should be in the range of 0 to 1.
     */
    update(zoom: number, bounds: Bounds) {
        if (!this._tile)
            throw new Error('Call init() before calling update().');

        let splits = this.getSplits(zoom) - 1;
        let tilesPerSplit = this._tilingSettings.zoomTileSplits;

        let currentTile = this._tile;

        // Split the tile into smaller tiles.
        // This is done recursively.
        if (splits > 0) recursivelySplitChildren(currentTile, splits - 1);

        // Update each tile.
        this._tile.getFurthestTileDescendants().forEach((tile) => {
            this.generateTile(tile, zoom);
        });

        console.log('done');

        function recursivelySplitChildren(
            tile: Tile<number>,
            recursionsRemaining: number
        ) {
            for (let x = 0; x < tile.getSplits(); x++) {
                for (let y = 0; y < tile.getSplits(); y++) {
                    let child = tile.getTileAt(x, y);
                    let inBounds = bounds.intersects(child.getBounds());

                    if (!child.hasChildren() && inBounds)
                        child.split(tilesPerSplit);
                    else if (child.hasChildren() && !inBounds) child.merge();

                    if (recursionsRemaining > 0)
                        recursivelySplitChildren(
                            child,
                            recursionsRemaining - 1
                        );
                    else if (child.hasChildren()) child.merge();
                }
            }
        }
    }

    private generateTile(tile: Tile<number>, zoom: number) {
        const {
            seed,
            noiseScale,
            noiseOctaves,
            noisePersistence,
            noiseLacunarity,
            noiseOffset,
            noiseMultiplier,
        } = this._noiseSettings;

        let pos = new Vector2(tile.getX(), tile.getY());
        let detail = this.getDetail(this.getQuality(zoom));
        let dataSize = tile.getSize() / detail;

        let noise2D = makeNoise2D(this._noiseSettings.seed);

        let points: number[][] = [];
        for (let x = 0; x < detail; x++) {
            let totalX = pos.x + x * dataSize;
            // Outside of world bounds.
            if (
                totalX < -this._worldDimensions.xKM / 2 ||
                totalX > this._worldDimensions.xKM / 2
            )
                continue;

            points.push([]);
            for (let y = 0; y < detail; y++) {
                let totalY = pos.y + y * dataSize;
                // Outside of world bounds.
                if (
                    totalY < -this._worldDimensions.yKM / 2 ||
                    totalY > this._worldDimensions.yKM / 2
                )
                    continue;

                let point = new Vector2(totalX, totalY);
                // Scale the point
                point = new Vector2(point.x / noiseScale, point.y / noiseScale);
                let noise = noise2D(point.x, point.y);
                let val = (noise + 1) / 2;
                points[x].push(val);
            }
        }

        let tileData = new TileData<number>(detail);
        tileData.addData(points);
        tile.addTileData(tileData);
    }

    getTile(): Tile<number> {
        return this._tile!;
    }

    getSplits(zoom: number, considerWorldSize: boolean = true): number {
        if (zoom < 0 || zoom > 1)
            throw new Error('Zoom must be in the range of 0 to 1.');

        // The number of splits is essentially determined by the distance from the next split.
        // The closer to the next split, the higher the number of splits.
        let splitNum = Math.ceil(
            Math.log(this._tilingSettings.splitRate) / Math.log(zoom)
        );

        return considerWorldSize
            ? Math.min(splitNum, this.getMaxSplits())
            : splitNum;
    }

    getMaxSplits(): number {
        let maxWorldDimension = Math.max(
            this._worldDimensions.xKM,
            this._worldDimensions.yKM
        );
        let maxDetail = this._tilingSettings.detail;
        let zoomSplits = this._tilingSettings.zoomTileSplits;

        // Determines how many times the tile can be split based on how many the detail can fit into the world dimensions.
        return Math.floor(
            Math.log(maxWorldDimension / maxDetail) / Math.log(zoomSplits)
        );
    }

    /**
     * @note Generally as zoom increases, the quality increases.
     * @param zoom Should be in the range of 0 to 1.
     * @returns The quality in the range of 0 to 1.
     */
    getQuality(zoom: number): number {
        if (zoom < 0 || zoom > 1)
            throw new Error('Zoom must be in the range of 0 to 1.');

        let zoomOpposite = 1 - zoom;

        // The quality of the tile is essentially determined by the distance from the next split.
        // The closer to the next split, the higher the quality.
        let splitNum = this.getSplits(zoom);
        let nextSplitZoom =
            1 / Math.pow(1 / this._tilingSettings.splitRate, splitNum + 1);
        let distanceFromNextSplit = zoomOpposite - nextSplitZoom;
        if (this.getMaxSplits() === splitNum) distanceFromNextSplit = 1 - zoom;
        let qualitySplits = Math.floor(
            Math.log(0.5) / Math.log(1 - distanceFromNextSplit)
        );
        let quality = 1 - Math.pow(0.5, qualitySplits);
        return quality;
    }

    /**
     * @param quality Should be in the range of 0 to 1.
     * @returns The detail, which is the number of points on a single axis in the tile.
     */
    getDetail(quality: number): number {
        if (quality < 0 || quality > 1)
            throw new Error('Quality must be in the range of 0 to 1.');
        let detail = Math.max(
            this._tilingSettings.detail * quality,
            this._tilingSettings.lowestDetail
        );
        return detail;
    }
}
