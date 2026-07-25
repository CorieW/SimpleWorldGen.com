
export class Drawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    /**
     * Pixel data to draw on the canvas
     * Each value should be between 0 and 255
     */
    private pixelData: number[];

    constructor(canvas: HTMLCanvasElement, pixelData: number[]) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.pixelData = pixelData;
    }

    drawNode(): void {
        // If the canvas context is not available, return
        if (!this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);

        // Create an ImageData object directly with the pixel data length
        const imageData = new ImageData(new Uint8ClampedArray(this.pixelData), width, height);

        // Draw the ImageData onto the canvas
        this.ctx.putImageData(imageData, 0, 0);
    }
}