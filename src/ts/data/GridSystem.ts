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
        console.log('quadNode', bounds);
        // Split the displaying quads once the quads are larger than the screen.
        iterativelySplitQuad(this._quadTreeNode, bounds);

        function iterativelySplitQuad(quadNode: QuadTreeNode<T>, bounds: Bounds) {
            if (GridSystem.shouldSplitQuad<T>(quadNode, bounds)) {
                console.log('quadNode', quadNode);

                if (!quadNode.hasChildren()) quadNode.split(4);

                quadNode.getChildrenFlat().forEach((child) =>
                    iterativelySplitQuad(child, bounds)
                );
            } else {
                console.log('quadNode', quadNode);
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

    private static distributeInverseShares(
        shares: number[],
        totalValue: number
    ): number[] {
        const totalShares = shares.reduce((acc, share) => acc + share, 0);
        let remainingValue = totalValue;
        const inverseShares = shares.map((share) => totalShares - share); // Calculate inverse shares
        const totalInverseShares = inverseShares.reduce(
            (acc, share) => acc + share,
            0
        );

        return shares.map((share, index) => {
            if (index === shares.length - 1) {
                return remainingValue; // Assign remaining value to the last item
            } else {
                const value =
                    Math.round(
                        ((totalShares - share) / totalInverseShares) *
                            totalValue *
                            100
                    ) / 100;
                remainingValue -= value;
                return value;
            }
        });
    }

    public getQuadTreeNode(): QuadTreeNode<T> {
        return this._quadTreeNode!;
    }
}
