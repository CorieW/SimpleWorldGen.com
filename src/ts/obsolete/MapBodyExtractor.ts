import Point from '../data/Point';

/**
 * Represents a utility class for extracting bodies from a 2D map.
 * @template T The type of elements in the map.
 */
class MapBodyExtractor<T> {
    private map: T[][];
    private validationFunc: (val: T) => boolean;
    private visited: boolean[][];
    private rows: number;
    private cols: number;

    /**
     * Constructs a new instance of the MapBodyExtractor class.
     * @param map The 2D array representing the map.
     * @param validationFunc The function used to validate each element in the map.
     */
    constructor(map: T[][], validationFunc: (val: T) => boolean) {
        this.map = map;
        this.validationFunc = validationFunc;
        this.rows = map.length;
        this.cols = map[0].length;
        this.visited = Array.from({ length: this.rows }, () =>
            Array(this.cols).fill(false)
        );
    }

    private isValid(x: number, y: number): boolean {
        return (
            x >= 0 &&
            x < this.rows &&
            y >= 0 &&
            y < this.cols &&
            this.validationFunc(this.map[x][y]) &&
            !this.visited[x][y]
        );
    }

    /**
     * Performs a depth-first search starting from the specified coordinates (x, y) and updates the current body.
     *
     * @param x - The x-coordinate to start the search from.
     * @param y - The y-coordinate to start the search from.
     * @param currentBody - The current body to update with the visited points.
     */
    private dfs(x: number, y: number, currentBody: Point[]): void {
        // Directions: up, down, left, right
        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];

        this.visited[x][y] = true;
        currentBody.push(new Point(x, y));

        for (let i = 0; i < 4; i++) {
            const newX = x + dx[i];
            const newY = y + dy[i];

            if (this.isValid(newX, newY)) {
                this.dfs(newX, newY, currentBody);
            }
        }
    }

    /**
     * Extracts bodies from the map.
     *
     * @returns
     * An array of arrays of points representing the extracted bodies.
     * Simply put, each array of points represents a body.
     */
    public extractBodies(): Point[][] {
        const bodies: Point[][] = [];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (
                    this.validationFunc(this.map[i][j]) &&
                    !this.visited[i][j]
                ) {
                    const currentBody: Point[] = [];
                    this.dfs(i, j, currentBody);
                    bodies.push(currentBody);
                }
            }
        }

        return bodies;
    }
}

export default MapBodyExtractor;
