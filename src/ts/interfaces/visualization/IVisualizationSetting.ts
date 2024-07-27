import { VisualizationTypeEnum } from "../../enums/VisualizationTypeEnum";
import { VisualizationColorTypeEnum } from "../../enums/VisualizationColorTypeEnum";
import { IVisualizationCondition } from "./IVisualizationCondition";

export interface IVisualizationSetting {
    type: VisualizationTypeEnum,
    colorType: VisualizationColorTypeEnum,
    color: string,
    conditions: IVisualizationCondition[]
}