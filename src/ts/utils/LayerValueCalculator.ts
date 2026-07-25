import { INode } from "../interfaces/INode"

export class NodeValueCalculator {
    private node: INode;
    private worker: Worker | null;
    private rejectPending: ((reason?: unknown) => void) | null;

    constructor(node: INode) {
        this.node = node;
        this.worker = null;
        this.rejectPending = null;
    }

    /**
     * Calculate the map of values for the given node.
     * Does this work on a separate thread.
     * @param width width of the map
     * @param height height of the map
     * @returns a map of values for the given node
     */
    calculateMap(width: number, height: number, x: number = 0, y: number = 0, spread: number = 1): Promise<number[][]> {
        if (this.worker) {
            this.terminateWorker();
        }

        const worker = new Worker(new URL('../workers/layerCombinerWorker.ts', import.meta.url), { type: 'module' });
        this.worker = worker;

        const promise = new Promise<number[][]>((resolve, reject) => {
            this.rejectPending = reject;

            worker.onmessage = (event) => {
                this.finishWorker(worker);
                resolve(event.data);
            };

            worker.onerror = (error) => {
                this.finishWorker(worker);
                reject(error);
            };
        });

        worker.postMessage({ node: this.node, width, height, x, y, spread });

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
