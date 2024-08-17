import WorldGenMath from '../WorldGenMath';

export default class Utils {
    static setPixel(
        id: ImageData,
        x: number,
        y: number,
        colorObj: { r: number; g: number; b: number; a: number }
    ): void {
        const pixels = id.data;
        const off = 4 * (x + y * id.width);
        pixels[off] = colorObj.r;
        pixels[off + 1] = colorObj.g;
        pixels[off + 2] = colorObj.b;
        pixels[off + 3] = colorObj.a;
    }

    static getLerpedColor(
        minVal: number,
        maxVal: number,
        val: number,
        minColor: { r: number; g: number; b: number },
        maxColor: { r: number; g: number; b: number }
    ): { r: number; g: number; b: number; a: number } {
        const lerpVal = WorldGenMath.invLerp(minVal, maxVal, val);

        return {
            r: WorldGenMath.lerp(minColor.r, maxColor.r, lerpVal),
            g: WorldGenMath.lerp(minColor.g, maxColor.g, lerpVal),
            b: WorldGenMath.lerp(minColor.b, maxColor.b, lerpVal),
            a: 255,
        };
    }

    static lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    static clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }
}
