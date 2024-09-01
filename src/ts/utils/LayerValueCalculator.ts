import { INode } from "../interfaces/INode"

export class NodeValueCalculator {
    private node: INode;

    constructor(node: INode) {
        this.node = node;
    }

    /**
     * Calculate the map of values for the given node.
     * Does this work on a separate thread.
     * @param width width of the map
     * @param height height of the map
     * @returns a map of values for the given node
     */
    calculateMap(width: number, height: number): Promise<number[][]> {
        const worker = new Worker('/src/ts/workers/layerCombinerWorker.ts', { type: 'module' });

        const promise = new Promise<number[][]>((resolve, reject) => {
            worker.onmessage = (event) => {
                resolve(event.data);
            };

            worker.onerror = (error) => {
                reject(error);
            }
        });

        worker.postMessage({ node: this.node, width, height });

        return promise;
    }
}