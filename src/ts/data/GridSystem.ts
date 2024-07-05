import Bounds from './Bounds';
import QuadTreeNode from './QuadTreeNode';

export default class GridSystem<T> {
    private _quadTreeNode: QuadTreeNode<T>;

    constructor(largestSize: number) {
        this._quadTreeNode = new QuadTreeNode<T>(0, 0, largestSize);
    }

    /**
     * Updates the grid system.
     * @param bounds
     * @param leafCallback Called for each leaf.
     */
    public update(
        bounds: Bounds,
        leafCallback: (quadNode: QuadTreeNode<T>) => void
    ) {
        // Split the displaying quads once the quads are larger than the screen.
        iterativelySplitQuad(this._quadTreeNode, bounds);

        function iterativelySplitQuad(quadNode: QuadTreeNode<T>, bounds: Bounds) {
            if (GridSystem.shouldSplitQuad<T>(quadNode, bounds)) {
                if (!quadNode.hasChildren()) quadNode.split(4);

                quadNode.getChildrenFlat().forEach((child) =>
                    iterativelySplitQuad(child, bounds)
                );
            } else {
                leafCallback(quadNode);
            }
        }
    }

    private static shouldSplitQuad<T>(
        quadNode: QuadTreeNode<T>,
        bounds: Bounds
    ): boolean {
        let x = quadNode.getX();
        let y = quadNode.getY();
        let size = quadNode.getSize();

        let isOverlappingBounds = bounds.intersects(
            new Bounds(x, y, size, size)
        );

        return (
            isOverlappingBounds &&
            (bounds.width < size || bounds.height < size)
        );
    }

    public getQuadTreeNode(): QuadTreeNode<T> {
        return this._quadTreeNode!;
    }
}
