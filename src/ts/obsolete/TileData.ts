export default class TileData<T> {
    private _size: number; // If the size is 200, then the tile is 200x200.
    private _data: T[][];

    constructor(detail: number) {
        this._size = detail;
        this._data = [];
    }

    addData(data: T[][]) {
        this._data = data;
    }

    getSize(): number {
        return this._size;
    }

    getData(): T[][] {
        return this._data;
    }
}
