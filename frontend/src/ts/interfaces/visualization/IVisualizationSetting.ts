import { VisualizationTypeEnum } from "../../enums/VisualizationTypeEnum";
import { VisualizationColorTypeEnum } from "../../enums/VisualizationColorTypeEnum";
import { IVisualizationCondition } from "./IVisualizationCondition";
import { ScalingTypeEnum } from "../../enums/ScalingTypeEnum";

export interface IVisualizationSetting {
    type: VisualizationTypeEnum,
    minScale?: number,
    maxScale?: number,
    scalingType?: ScalingTypeEnum,
    colorType: VisualizationColorTypeEnum,
    color: string,
    conditions: IVisualizationCondition[]
}