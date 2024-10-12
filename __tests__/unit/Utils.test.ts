/**
 * Tests the functions in the Utils file by checking the output of the functions is as expected.
 */

import Utils from "../../src/ts/utils/Utils";

describe('Utils class', () => {
    test('clamp() should return the value if it is within the range', () => {
        expect(Utils.clamp(5, 0, 10)).toBe(5);
        expect(Utils.clamp(0, 0, 10)).toBe(0);
        expect(Utils.clamp(10, 0, 10)).toBe(10);
        expect(Utils.clamp(-5, 0, 10)).toBe(0);
        expect(Utils.clamp(15, 0, 10)).toBe(10);
    })

    test('lerp() should return the correct value', () => {
        expect(Utils.lerp(0, 10, 0.5)).toBe(5);
        expect(Utils.lerp(0, 10, 0)).toBe(0);
        expect(Utils.lerp(0, 10, 1)).toBe(10);
        expect(Utils.lerp(0, 10, 0.75)).toBe(7.5);
        expect(Utils.lerp(0, 10, 0.25)).toBe(2.5);
    })

    test('getLerpedColor() should return the correct color object', () => {
        const minColor = { r: 0, g: 0, b: 0 };
        const maxColor = { r: 255, g: 255, b: 255 };
        expect(Utils.getLerpedColor(0, 10, 5, minColor, maxColor)).toStrictEqual({ r: 127.5, g: 127.5, b: 127.5, a: 255 });
        expect(Utils.getLerpedColor(0, 10, 0, minColor, maxColor)).toStrictEqual({ r: 0, g: 0, b: 0, a: 255 });
        expect(Utils.getLerpedColor(0, 10, 10, minColor, maxColor)).toStrictEqual({ r: 255, g: 255, b: 255, a: 255 });
        expect(Utils.getLerpedColor(0, 10, 7.5, minColor, maxColor)).toStrictEqual({ r: 191.25, g: 191.25, b: 191.25, a: 255 });
        expect(Utils.getLerpedColor(0, 10, 2.5, minColor, maxColor)).toStrictEqual({ r: 63.75, g: 63.75, b: 63.75, a: 255 });
    })

    test('setPixel() should set the correct pixel value', () => {
        const id = { height: 10, width: 10, data: new Uint8ClampedArray(10 * 10 * 4) } as ImageData;
        const colorObj = { r: 243, g: 211, b: 46, a: 75 };
        Utils.setPixel(id, 5, 5, colorObj);
        const pixels = id.data;
        const off = 4 * (5 + 5 * id.width);
        expect(pixels[off]).toBe(243);
        expect(pixels[off + 1]).toBe(211);
        expect(pixels[off + 2]).toBe(46);
        expect(pixels[off + 3]).toBe(75);
    })
})