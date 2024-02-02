import WorldGenMath from './WorldGenMath';

interface ClimateSettings {
    width: number;
    height: number;
    eqY: number;
    eqSize: number;
    tempMultiplier: number;
    tempDropRate: number;
    tempHeightDropRate: number;
}

export default class Climate {
    width: number;
    height: number;
    eqY: number;
    eqSize: number;
    tempMultiplier: number;
    tempDropRate: number;
    tempHeightDropRate: number;

    constructor(settings: ClimateSettings) {
        this.width = settings.width;
        this.height = settings.height;
        this.eqY = settings.eqY;
        this.eqSize = settings.eqSize;
        this.tempMultiplier = settings.tempMultiplier;
        this.tempDropRate = settings.tempDropRate;
        this.tempHeightDropRate = settings.tempHeightDropRate;
    }

    generateClimateMap(): number[][] {
        let climateMap: number[][] = new Array(this.width);

        for (let x = 0; x < this.width; x++) {
            climateMap[x] = new Array(this.height);

            for (let y = 0; y < this.height; y++) {
                climateMap[x][y] = this.getClimate1D(y);
            }
        }

        return climateMap;
    }

    getClimate1D(y: number): number {
        let yDist = Math.abs(y - WorldGenMath.lerp(0, this.height, this.eqY));

        let eqSize = WorldGenMath.lerp(0, this.height, this.eqSize);

        let temp = WorldGenMath.invLerp(eqSize / 2, this.height / 2, yDist);
        temp = temp * this.tempDropRate;
        temp = 1 - WorldGenMath.clamp01(temp);
        temp = temp * this.tempMultiplier;

        return WorldGenMath.clamp01(temp);
    }

    getAltitudeTemp(height: number, climate: number): number {
        return WorldGenMath.clamp01(climate - height * this.tempHeightDropRate);
    }
}
