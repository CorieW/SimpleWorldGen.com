import IDictionary from '../utils/IDictionary';

export default class ChunkData {
    private _x: number;
    private _y: number;
    private _size: number;
    private _data: IDictionary<number>[][];

    constructor(x: number, y: number, size: number) {
        this._x = x;
        this._y = y;
        this._size = size;
        this._data = []
    }

    addData(data: IDictionary<number>[][]) {
        this._data = data;
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

    getData(): IDictionary<number>[][] {
        return this._data;
    }
}
