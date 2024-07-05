
export class Drawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private valueFunc: (globalX: number, globalY: number) => number;

    constructor(canvas: HTMLCanvasElement, valueFunc: (globalX: number, globalY: number) => number) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.valueFunc = valueFunc;
    }

    drawNode(): void {
        // If the canvas context is not available, return
        if (!this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);

        // Get the draw data for the node
        const pixelData = this.getPixelData();

        if (pixelData.length === 0) return;

        const imageData = this.ctx.createImageData(width, height);
        for (let i = 0; i < pixelData.length; i++) {
            imageData.data[i] = pixelData[i];
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    private getPixelData(): number[] {
        const pixelData: number[] = [];

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                const value = this.valueFunc(x, y);
                pixelData.push(value * 255, value * 255, value * 255, 255);
            }
        }

        return pixelData;
    }
}