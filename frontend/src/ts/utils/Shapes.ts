import { VisualizationTypeEnum } from "../enums/VisualizationTypeEnum";
import IShape from "../interfaces/IShape";

export default class Shapes {
    static shapes: IShape[] = [
        {
            visualizationType: VisualizationTypeEnum.Square,
            canScale: true
        },
        {
            visualizationType: VisualizationTypeEnum.Circle,
            canScale: true
        },
        {
            visualizationType: VisualizationTypeEnum.Triangle,
            canScale: true
        },
        {
            visualizationType: VisualizationTypeEnum.Poly,
            canScale: false
        }
    ];

    public static getShape(visualizationType: VisualizationTypeEnum): IShape {
        return this.shapes.find(shape => shape.visualizationType === visualizationType) || this.shapes[0];
    }
}