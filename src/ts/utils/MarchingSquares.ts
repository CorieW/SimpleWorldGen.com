import Point from '../data/Point';

class MarchingSquares {
    private rows: number;
    private cols: number;
    private evaluationFunction: (x: number, y: number) => boolean;
    private valueFunction: (x: number, y: number) => number;
    private differenceFunction: (aVal: number, bVal: number) => number;

    constructor(rows: number, cols: number, evaluationFunction: (x: number, y: number) => boolean, valueFunction: (x: number, y: number) => number, differenceFunction: (aVal: number, bVal: number) => number) {
        this.rows = rows;
        this.cols = cols;
        this.evaluationFunction = evaluationFunction;
        this.valueFunction = valueFunction;
        this.differenceFunction = differenceFunction;
    }

    private getCellState(x: number, y: number): number {
        let state = 0;
        if (this.evaluationFunction(x, y)) state |= 1;
        if (this.evaluationFunction(x + 1, y)) state |= 2;
        if (this.evaluationFunction(x + 1, y + 1)) state |= 4;
        if (this.evaluationFunction(x, y + 1)) state |= 8;
        return state;
    }

    private interpolate(a: Point, b: Point, aVal: number, bVal: number): Point {
        // const t = (this.threshold - aVal) / (bVal - aVal);
        const t = this.differenceFunction(aVal, bVal);
        return new Point(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y));
        // const valDiff = (bVal - aVal);
        // return new Point((valDiff * (b.x - a.x)) + a.x, (valDiff * (b.y - a.y)) + a.y);
    }

    private valueAt(x: number, y: number): number {
        // Assuming x and y are integer coordinates
        // and within the bounds of the map array
        return this.valueFunction(x, y);
    }

    private getPointsForState(x: number, y: number, state: number): Point[] {
        const bottomLeft = new Point(x, y);
        const bottomRight = new Point(x + 1, y);
        const topLeft = new Point(x, y + 1);
        const topRight = new Point(x + 1, y + 1);

        const lbFromLT = this.interpolate(
            bottomLeft,
            topLeft,
            this.valueAt(x, y),
            this.valueAt(x, y + 1)
        );
        const ltFromLB = this.interpolate(
            topLeft,
            bottomLeft,
            this.valueAt(x, y + 1),
            this.valueAt(x, y)
        );

        const lbFromRB = this.interpolate(
            bottomLeft,
            bottomRight,
            this.valueAt(x, y),
            this.valueAt(x + 1, y)
        );
        const rbFromLB = this.interpolate(
            bottomRight,
            bottomLeft,
            this.valueAt(x + 1, y),
            this.valueAt(x, y)
        );

        const rtFromRB = this.interpolate(
            topRight,
            bottomRight,
            this.valueAt(x + 1, y + 1),
            this.valueAt(x + 1, y)
        );
        const rbFromRT = this.interpolate(
            bottomRight,
            topRight,
            this.valueAt(x + 1, y),
            this.valueAt(x + 1, y + 1)
        );

        const ltFromRT = this.interpolate(
            topLeft,
            topRight,
            this.valueAt(x, y + 1),
            this.valueAt(x + 1, y + 1)
        );
        const rtFromLT = this.interpolate(
            topRight,
            topLeft,
            this.valueAt(x + 1, y + 1),
            this.valueAt(x, y + 1)
        );

        switch (state) {
            case 1:
                return [lbFromLT, lbFromRB];
            case 2:
                return [rbFromLB, rbFromRT];
            case 3:
                return [lbFromLT, rbFromRT];
            case 4:
                return [rtFromLT, rtFromRB];
            case 5:
                return [lbFromLT, rtFromLT, lbFromRB, rtFromRB];
            case 6:
                return [rtFromLT, rbFromLB];
            case 7:
                return [rtFromLT, lbFromLT];
            case 8:
                return [ltFromRT, ltFromLB];
            case 9:
                return [ltFromRT, lbFromRB];
            case 10:
                return [ltFromLB, rbFromLB, ltFromRT, rbFromRT];
            case 11:
                return [ltFromRT, rbFromRT];
            case 12:
                return [ltFromLB, rtFromRB];
            case 13:
                return [lbFromRB, rtFromRB];
            case 14:
                return [ltFromLB, rbFromLB];
            case 15:
                return []; // Completely filled, no edges
            default:
                return []; // Completely empty, no edges
        }
    }

    private getPointsForState2(x: number, y: number, state: number): Point[] {
        const bottomLeft = new Point(x, y);
        const bottomRight = new Point(x + 1, y);
        const topLeft = new Point(x, y + 1);
        const topRight = new Point(x + 1, y + 1);

        const lbFromLT = this.interpolate(
            bottomLeft,
            topLeft,
            this.valueAt(x, y),
            this.valueAt(x, y + 1)
        );
        const ltFromLB = this.interpolate(
            topLeft,
            bottomLeft,
            this.valueAt(x, y + 1),
            this.valueAt(x, y)
        );

        const lbFromRB = this.interpolate(
            bottomLeft,
            bottomRight,
            this.valueAt(x, y),
            this.valueAt(x + 1, y)
        );
        const rbFromLB = this.interpolate(
            bottomRight,
            bottomLeft,
            this.valueAt(x + 1, y),
            this.valueAt(x, y)
        );

        const rtFromRB = this.interpolate(
            topRight,
            bottomRight,
            this.valueAt(x + 1, y + 1),
            this.valueAt(x + 1, y)
        );
        const rbFromRT = this.interpolate(
            bottomRight,
            topRight,
            this.valueAt(x + 1, y),
            this.valueAt(x + 1, y + 1)
        );

        const ltFromRT = this.interpolate(
            topLeft,
            topRight,
            this.valueAt(x, y + 1),
            this.valueAt(x + 1, y + 1)
        );
        const rtFromLT = this.interpolate(
            topRight,
            topLeft,
            this.valueAt(x + 1, y + 1),
            this.valueAt(x, y + 1)
        );

        switch (state) {
            case 1:
                return [lbFromLT, lbFromRB, bottomLeft];
            case 2:
                return [rbFromLB, rbFromRT, bottomRight];
            case 3:
                return [bottomLeft, lbFromLT, rbFromRT, bottomRight];
            case 4:
                return [rtFromLT, rtFromRB, topRight];
            case 5:
                return [bottomLeft, lbFromLT, rtFromLT, topRight, rtFromRB, lbFromRB];
            case 6:
                return [rtFromLT, rbFromLB, bottomRight, topRight];
            case 7:
                return [rtFromLT, lbFromLT, bottomLeft, bottomRight, topRight];
            case 8:
                return [ltFromRT, ltFromLB, topLeft];
            case 9:
                return [ltFromRT, lbFromRB, bottomLeft, topLeft];
            case 10:
                return [topLeft, ltFromLB, rbFromLB, bottomRight, rbFromRT, ltFromRT];
            case 11:
                return [ltFromRT, rbFromRT, bottomRight, bottomLeft, topLeft];
            case 12:
                return [ltFromLB, rtFromRB, topRight, topLeft];
            case 13:
                return [lbFromRB, rtFromRB, topRight, topLeft, bottomLeft];
            case 14:
                return [ltFromLB, rbFromLB, bottomRight, topRight, topLeft];
            case 15:
                return [bottomLeft, bottomRight, topRight, topLeft]; // Completely filled, no edges
            default:
                return []; // Completely empty, no edges
        }
    }

    public getContours(): Point[][] {
        const contours: Point[][] = [];

        for (let y = 0; y < this.rows - 1; y++) {
            for (let x = 0; x < this.cols - 1; x++) {
                const cellState = this.getCellState(x, y);
                if (cellState === 0 || cellState === 15) continue;
                const points = this.getPointsForState(x, y, cellState);
                if (cellState === 5 || cellState === 10) {
                    contours.push(points.slice(0, 2), points.slice(2, 4));
                } else {
                    contours.push(points);
                }
            }
        }

        return contours;
    }

    public getShapes(): Point[][] {
        const shapes: Point[][] = [];

        for (let y = 0; y < this.rows - 1; y++) {
            for (let x = 0; x < this.cols - 1; x++) {
                const cellState = this.getCellState(x, y);
                if (cellState === 0) continue;
                const points = this.getPointsForState2(x, y, cellState);
                if (cellState === 5 || cellState === 10) {
                    shapes.push(
                        [points[0], points[1], points[5]],
                        [points[3], points[4], points[2]]
                    );
                } else {
                    shapes.push(points);
                }
            }
        }

        return shapes;
    }
}

export default MarchingSquares;
