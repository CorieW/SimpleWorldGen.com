import { NodeEffectEnum } from "../../enums/NodeEffectEnum";
import { NodeTypeEnum } from "../../enums/NodeTypeEnum";

export interface INode {
    id: number,
    type: NodeTypeEnum,
    effect: NodeEffectEnum | null,
    nextNode: INode | null
}