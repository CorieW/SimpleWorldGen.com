import { VisualizationTypeEnum } from "../../enums/VisualizationTypeEnum";

export default interface IShape {
    visualizationType: VisualizationTypeEnum;
    canScale: boolean;
}