import { VisualizationTypeEnum } from "../../enums/VisualizationTypeEnum";
import { IVisualizationCondition } from "./IVisualizationCondition";

export interface IVisualizationSetting {
    type: VisualizationTypeEnum,
    color: string,
    conditions: IVisualizationCondition[]
}