export default class ChunkData {
    private _size: number; // If the size is 200, then the tile is 200x200.
    private _data: number[][];

    constructor(detail: number) {
        this._size = detail;
        this._data = [];
    }

    addData(data: number[][]) {
        this._data = data;
    }

    getSize(): number {
        return this._size;
    }

    getData(): number[][] {
        return this._data;
    }
}
