import { INode } from "../interfaces/INode"

export class NodeValueCalculator {
    private node: INode;
    private worker: Worker | null;

    constructor(node: INode) {
        this.node = node;
        this.worker = null;
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

        this.worker = new Worker('/src/ts/workers/layerCombinerWorker.ts', { type: 'module' });

        const promise = new Promise<number[][]>((resolve, reject) => {
            this.worker!.onmessage = (event) => {
                resolve(event.data);
            };

            this.worker!.onerror = (error) => {
                reject(error);
            }
        });

        this.worker.postMessage({ node: this.node, width, height, x, y, spread });

        return promise;
    }

    terminateWorker() {
        this.worker?.terminate();
    }
}