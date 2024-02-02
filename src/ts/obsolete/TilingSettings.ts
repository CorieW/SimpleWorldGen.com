export default class TilingSettings {
    detail: number;
    lowestDetail: number;
    initialScreenSplits: number;
    zoomTileSplits: number;
    splitRate: number;

    constructor(
        detail: number,
        lowestDetail: number,
        initialScreenSplits: number,
        zoomTileSplits: number,
        splitRate: number
    ) {
        this.detail = detail;
        this.lowestDetail = lowestDetail;
        this.initialScreenSplits = initialScreenSplits;
        this.zoomTileSplits = zoomTileSplits;
        this.splitRate = splitRate;
    }
}
