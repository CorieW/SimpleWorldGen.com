export default class Bounds {
    public readonly x: number;
    public readonly y: number;
    public readonly width: number;
    public readonly height: number;

    public constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public contains(x: number, y: number): boolean {
        return (
            x >= this.x &&
            x < this.x + this.width &&
            y >= this.y &&
            y < this.y + this.height
        );
    }

    public intersects(bounds: Bounds): boolean {
        return (
            this.x < bounds.x + bounds.width &&
            this.x + this.width > bounds.x &&
            this.y < bounds.y + bounds.height &&
            this.y + this.height > bounds.y
        );
    }

    public static fromPaperRect(rect: paper.Rectangle): Bounds {
        return new Bounds(rect.x, rect.y, rect.width, rect.height);
    }
}
