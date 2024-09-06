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
     * This function takes an array of shares, calculates their inverse values (how far each share is 
     * from the total sum of shares), and then distributes a given total value according to these 
     * inverse values. The last share receives any leftover value to ensure the total is fully distributed.
     *
     * @param shares - An array of numbers representing the original shares.
     * @param totalValue - The total value that needs to be split based on the inverse of the shares.
     * @returns An array of numbers showing how much of the total value each share gets, based on their inverses.
     */
    static distributeInverseShares(shares: number[], totalValue: number): number[] {
        const totalShares = shares.reduce((acc, share) => acc + share, 0);
        let remainingValue = totalValue;
        const inverseShares = shares.map(share => totalShares - share); // Calculate inverse shares
        const totalInverseShares = inverseShares.reduce((acc, share) => acc + share, 0);

        return shares.map((share, index) => {
            if (index === shares.length - 1) {
                return remainingValue; // Assign remaining value to the last item
            } else {
                const value = Math.round((totalShares - share) / totalInverseShares * totalValue * 100) / 100;
                remainingValue -= value;
                return value;
            }
        });
    }
}
