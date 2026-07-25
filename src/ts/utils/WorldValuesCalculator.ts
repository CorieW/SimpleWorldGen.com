import { ILayer } from '../interfaces/ILayer';
import IDictionary from './IDictionary';

export default class WorldValuesCalculator {
    private layers: ILayer[];
    private worker: Worker | null = null;
    private rejectPending: ((reason?: unknown) => void) | null = null;

    constructor(layers: ILayer[]) {
        this.layers = layers;
    }

    calculateMap(
        width: number,
        height: number,
        x: number,
        y: number,
        spread: number,
        halfWorldWidth: number,
        halfWorldHeight: number,
        xFadeOffEndRange: number,
        yFadeOffEndRange: number
    ): Promise<IDictionary<number>[][]> {
        this.terminateWorker();

        const worker = new Worker(new URL('../workers/worldValuesWorker.ts', import.meta.url), { type: 'module' });
        this.worker = worker;

        const promise = new Promise<IDictionary<number>[][]>((resolve, reject) => {
            this.rejectPending = reject;

            worker.onmessage = (event: MessageEvent<IDictionary<number>[][]>) => {
                this.finishWorker(worker);
                resolve(event.data);
            };

            worker.onerror = (error) => {
                this.finishWorker(worker);
                reject(error);
            };
        });

        worker.postMessage({
            layers: this.layers,
            width,
            height,
            x,
            y,
            spread,
            halfWorldWidth,
            halfWorldHeight,
            xFadeOffEndRange,
            yFadeOffEndRange,
        });

        return promise;
    }

    terminateWorker() {
        if (!this.worker) return;

        const reject = this.rejectPending;
        this.finishWorker(this.worker);
        reject?.(new DOMException('World generation was cancelled.', 'AbortError'));
    }

    private finishWorker(worker: Worker) {
        worker.onmessage = null;
        worker.onerror = null;
        worker.terminate();

        if (this.worker === worker) {
            this.worker = null;
            this.rejectPending = null;
        }
    }
}
