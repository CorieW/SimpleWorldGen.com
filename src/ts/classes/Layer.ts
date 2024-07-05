import { ILayer } from '../interfaces/ILayer';
import { INode } from '../interfaces/INode';

export class Layer implements ILayer {
    id: number;
    name: string;
    beginningNode: INode;

    constructor(id: number, name: string, beginningNode: INode) {
        this.id = id;
        this.name = name;
        this.beginningNode = beginningNode;
    }
}