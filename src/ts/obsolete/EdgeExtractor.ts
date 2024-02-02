import Point from '../data/Point';

/**
 * Represents an EdgeExtractor that extracts edges from a set of body points.
 */
class EdgeExtractor {
    private body: Set<string>;

    /**
     * Constructs a new EdgeExtractor object.
     * @param bodyPoints - The array of body points.
     */
    constructor(bodyPoints: Point[]) {
        this.body = new Set(bodyPoints.map((p) => `${p.x},${p.y}`));
    }

    /**
     * Checks if the given point is an edge.
     * @param x - The x-coordinate of the point.
     * @param y - The y-coordinate of the point.
     * @returns True if the point is an edge, false otherwise.
     */
    private isEdge(x: number, y: number): boolean {
        if (!this.body.has(`${x},${y}`)) {
            return false;
        }

        // Directions: up, down, left, right, and diagonals
        const dx = [-1, -1, -1, 0, 1, 1, 1, 0];
        const dy = [-1, 0, 1, 1, 1, 0, -1, -1];

        for (let i = 0; i < 8; i++) {
            const newX = x + dx[i];
            const newY = y + dy[i];
            if (!this.body.has(`${newX},${newY}`)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Extracts the edges from the body points.
     * @returns An array of points representing the edges.
     */
    public extractEdges(): Point[] {
        const edges: Point[] = [];
        this.body.forEach((point) => {
            const [x, y] = point.split(',').map(Number);
            if (this.isEdge(x, y)) {
                edges.push(new Point(x, y));
            }
        });
        return edges;
    }
}

export default EdgeExtractor;