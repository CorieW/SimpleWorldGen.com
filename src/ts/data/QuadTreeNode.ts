import Bounds from './Bounds';

export default class QuadTreeNode<T> {
    private _x: number;
    private _y: number;
    private _size: number;

    private _splits: number = 0;
    private _children: QuadTreeNode<T>[][] = [];
    private _data?: T;

    constructor(x: number, y: number, size: number) {
        this._x = x;
        this._y = y;
        this._size = size;
    }

    addData(data: T) {
        this._data = data;
    }

    /**
     * Called to split the quad into smaller quads.
     * @note Can only split if the node has no children.
     */
    split(splits: number) {
        if (this._children.length > 0)
            throw new Error('Cannot split a node that already has children.');

        this._splits = splits;
        let childSize = this._size / splits;

        for (let x = 0; x < splits; x++) {
            this._children.push([]);

            for (let y = 0; y < splits; y++) {
                let child = new QuadTreeNode<T>(
                    this._x + x * childSize,
                    this._y + y * childSize,
                    childSize
                );
                this._children[x].push(child);
            }
        }
    }

    /**
     * Called to merge the children quads into a larger quad.
     * @note Can only merge if the node has children.
     */
    merge() {
        if (this._children.length == 0)
            throw new Error('Cannot merge a node that has no children.');

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

    getChildren(): QuadTreeNode<T>[][] {
        return this._children;
    }

    getChildrenFlat(): QuadTreeNode<T>[] {
        let children: QuadTreeNode<T>[] = [];

        for (let x = 0; x < this.getSplits(); x++) {
            for (let y = 0; y < this.getSplits(); y++) {
                children.push(this.getNodeAt(x, y));
            }
        }

        return children;
    }

    getNodeAt(x: number, y: number): QuadTreeNode<T> {
        return this._children[x][y];
    }

    getData(): T {
        if (!this._data) throw new Error('Node has no data.');

        return this._data;
    }

    getLeafNodes(): QuadTreeNode<T>[] {
        let descendants: QuadTreeNode<T>[] = [];

        if (this.hasChildren()) {
            for (let x = 0; x < this.getSplits(); x++) {
                for (let y = 0; y < this.getSplits(); y++) {
                    let child = this.getNodeAt(x, y);

                    if (child.hasChildren()) {
                        let childDescendants =
                            child.getLeafNodes();
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
