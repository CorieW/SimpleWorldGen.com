import { VisualizationConditionalOperatorEnum } from "../../enums/VisualizationConditionalOperatorEnum";

export interface IVisualizationCondition {
    layerId: number,
    condOperator: VisualizationConditionalOperatorEnum | null,
    min: number,
    minInclusive: boolean,
    max: number,
    maxInclusive: boolean
}