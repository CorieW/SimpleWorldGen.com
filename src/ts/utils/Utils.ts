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

    /**
     * Distributes a total value based on the inverse of given shares.
     *
     * This function weights each share by its reciprocal and distributes a given total value according
     * to those weights. The last share receives any floating-point remainder so the total is preserved.
     *
     * @param shares - An array of numbers representing the original shares.
     * @param totalValue - The total value that needs to be split based on the inverse of the shares.
     * @returns An array of numbers showing how much of the total value each share gets, based on their inverses.
     */
    static distributeInverseShares(shares: number[], totalValue: number): number[] {
        if (shares.length === 0) return [];

        const inverseShares = shares.map((share) => {
            if (!Number.isFinite(share) || share <= 0) {
                throw new RangeError('Shares must be finite, positive numbers.');
            }
            return 1 / share;
        });
        const totalInverseShares = inverseShares.reduce((acc, share) => acc + share, 0);
        let remainingValue = totalValue;

        return inverseShares.map((inverseShare, index) => {
            if (index === shares.length - 1) {
                return remainingValue;
            }

            const value = inverseShare / totalInverseShares * totalValue;
            remainingValue -= value;
            return value;
        });
    }
}
