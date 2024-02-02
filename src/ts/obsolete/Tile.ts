import TileData from './TileData';
import Bounds from '../data/Bounds';

/**
 * A tile is a positioned square area that can be split into smaller tiles.
 * Any number of splits can be performed on a tile. Additionally, a tile can be merged back into a larger tile.
 * Each tile can have a TileData object associated with it, representing the data that is contained within the tile.
 */
export default class Tile<T> {
    private _x: number;
    private _y: number;
    private _size: number;

    private _splits: number = 0;
    private _children: Tile<T>[][] = [];
    private _tileData?: TileData<T>;

    constructor(x: number, y: number, size: number) {
        this._x = x;
        this._y = y;
        this._size = size;
    }

    addTileData(tileData: TileData<T>) {
        this._tileData = tileData;
    }

    /**
     * Called to split the tile into smaller tiles.
     * @note Can only split if the tile has no children.
     */
    split(splits: number) {
        if (this._children.length > 0)
            throw new Error('Cannot split a tile that already has children.');

        this._splits = splits;
        let childSize = this._size / splits;

        for (let x = 0; x < splits; x++) {
            this._children.push([]);

            for (let y = 0; y < splits; y++) {
                let child = new Tile<T>(
                    this._x + x * childSize,
                    this._y + y * childSize,
                    childSize
                );
                this._children[x].push(child);
            }
        }
    }

    /**
     * Called to merge the tile into a larger tile.
     * @note Can only merge if the tile has children.
     */
    merge() {
        if (this._children.length == 0)
            throw new Error('Cannot merge a tile that has no children.');

        this._splits = 0;
        this._children = [];
    }

    getX(): number {
        return this._x;
    }

    getY(): number {
        return this._y;
    }

    getSize(): number {
        return this._size;
    }

    getSplits(): number {
        return this._splits;
    }

    hasChildren(): boolean {
        return this._children.length > 0;
    }

    getChildren(): Tile<T>[][] {
        return this._children;
    }

    getChildrenFlat(): Tile<T>[] {
        let children: Tile<T>[] = [];

        for (let x = 0; x < this.getSplits(); x++) {
            for (let y = 0; y < this.getSplits(); y++) {
                children.push(this.getTileAt(x, y));
            }
        }

        return children;
    }

    getTileAt(x: number, y: number): Tile<T> {
        return this._children[x][y];
    }

    getTileData(): TileData<T> {
        if (!this._tileData) throw new Error('Tile has no data.');

        return this._tileData;
    }

    getFurthestTileDescendants(): Tile<T>[] {
        let descendants: Tile<T>[] = [];

        if (this.hasChildren()) {
            for (let x = 0; x < this.getSplits(); x++) {
                for (let y = 0; y < this.getSplits(); y++) {
                    let child = this.getTileAt(x, y);

                    if (child.hasChildren()) {
                        let childDescendants =
                            child.getFurthestTileDescendants();
                        descendants = descendants.concat(childDescendants);
                    } else {
                        descendants.push(child);
                    }
                }
            }
        } else {
            descendants.push(this);
        }

        return descendants;
    }

    getBounds(): Bounds {
        return new Bounds(this._x, this._y, this._size, this._size);
    }
}
