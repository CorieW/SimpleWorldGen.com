import { useRef, useEffect } from 'react';
import './Editor.scss';
import paper from 'paper';
import WorldGenerator from './ts/WorldGenerator';
import WorldDimensions from './ts/data/WorldDimensions';
import MarchingSquares from './ts/utils/MarchingSquares';
import Bounds from './ts/data/Bounds';
import ChunkData from './ts/data/ChunkData';
import useStore from './editorStore';
import { NodeValueCalculator } from './ts/utils/LayerValueCalculator';
import { IVisualizationCondition } from '../../ts/interfaces/visualization/IVisualizationCondition';
import { IVisualizationSetting } from '../../ts/interfaces/visualization/IVisualizationSetting';
import IDictionary from './ts/utils/IDictionary';
import WorldGenMath from './ts/WorldGenMath';
import { ILayer } from '../../ts/interfaces/generation/ILayer';
import { VisualizationTypeEnum } from '../../ts/enums/VisualizationTypeEnum';
import { ScalingTypeEnum } from '../../ts/enums/ScalingTypeEnum';
import Utils from './ts/utils/Utils';

function Editor() {
    const { setZoomIn, setZoomOut, setResetView, worldSettings, visualizationSettings, layers } = useStore();

    const { worldWidth, worldHeight, fadeOff, xFadeOffPercentage, yFadeOffPercentage } = worldSettings;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const positionRef = useRef<paper.Point>(new paper.Point(worldWidth / 2, worldHeight / 2));
    const zoomRef = useRef<number>(1);
    const dragStartRef = useRef<paper.Point | null>(null);
    const worldRef = useRef<WorldGenerator | null>(null);

    const maxZoom = 1000;
    const minZoom = 0.01;

    useEffect(() => {
        setZoomIn(() => zoomIn());
        setZoomOut(() => zoomOut());
        setResetView(() => resetView());
    }, []);

    useEffect(() => {
        console.log('Editor mounted');
        const worldDimensions = new WorldDimensions(
            worldWidth,
            worldHeight
        );
        const worldGenerator = new WorldGenerator(worldDimensions, generateNoiseValueFunc);
        worldGenerator.xFadeOffEndRange = fadeOff ? WorldGenMath.lerp(-1, 1, xFadeOffPercentage) : 1;
        worldGenerator.yFadeOffEndRange = fadeOff ? WorldGenMath.lerp(-1, 1, yFadeOffPercentage) : 1;
        worldRef.current = worldGenerator;

        // Attach Paper.js to the canvas and setup
        paper.setup(canvasRef.current!);
        paper.view.viewSize.width = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;
        paper.view.center = positionRef.current;
        paper.view.zoom = zoomRef.current;

        // Set background color
        canvasRef.current!.style.backgroundColor = worldSettings.backgroundColor;

        dragStartRef.current = null;

        updateWorld();

        function generateNoiseValueFunc(globalX: number, globalY: number): IDictionary<number> {
            const values: IDictionary<number> = {};

            layers.forEach((layer: ILayer) => {
                const calculator = new NodeValueCalculator(layer.beginningNode)
                values[layer.id] = calculator.calculateValue(globalX, globalY);
            });

            return values;
        }
    }, [worldSettings, layers]);

    useEffect(() => {
        function onResize() {
            // Resize the canvas to fill browser window dynamically
            paper.view.viewSize.width = window.innerWidth;
            paper.view.viewSize.height = window.innerHeight;
        }

        function onMouseDown(event: paper.MouseEvent) {
            dragStartRef.current = event.point;
        }

        function onDrag(event: paper.MouseEvent) {
            if (dragStartRef.current) {
                const delta = event.point.subtract(dragStartRef.current);
                setPosition(positionRef.current.subtract(delta));
            }
        }

        function zoom(event: WheelEvent) {
            // If not over the canvas, do nothing
            if (event.target !== canvasRef.current) {
                return;
            }

            // clear the canvas
            const view = paper.view;

            const oldZoom = zoomRef.current;
            let newZoom = oldZoom * (1 + event.deltaY * -0.001);
            // Limit zoom to reasonable values
            newZoom = Math.max(minZoom, Math.min(newZoom, maxZoom));

            const beta = oldZoom / newZoom;

            const mousePosition = new paper.Point(event.offsetX, event.offsetY);
            const viewPosition = view.viewToProject(mousePosition);
            let move = viewPosition.subtract(positionRef.current);
            move = move.multiply(1 - beta);
            const newCenter = positionRef.current.add(move);

            setZoom(newZoom);
            setPosition(newCenter);
        }

        window.addEventListener('resize', onResize);
        window.addEventListener('wheel', zoom);

        paper.view.onMouseDown = onMouseDown;
        paper.view.onMouseDrag = onDrag;

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('wheel', zoom);

            paper.view.onMouseDown = null;
            paper.view.onMouseDrag = null;
        };
    });

    function updateWorld() {
        let bounds = paper.view.bounds;
        let boundsData = new Bounds(bounds.x, bounds.y, bounds.width, bounds.height);

        if (!worldRef.current!.shouldUpdate(boundsData)) return;

        paper.project.activeLayer.removeChildren();

        worldRef.current!.update(
            boundsData,
            (chunkData: ChunkData) => {
                draw(chunkData);
            }
        );
    }

    function setZoom(zoom: number) {
        zoomRef.current = zoom;
        paper.view.zoom = zoom;
        updateWorld();
    }

    function setPosition(point: paper.Point) {
        positionRef.current = point;
        paper.view.center = point;
        updateWorld();
    }

    function zoomIn() {
        setZoom(zoomRef.current * 1.1);
    }

    function zoomOut() {
        setZoom(zoomRef.current * 0.9);
    }

    function resetView() {
        setZoom(1);
        setPosition(new paper.Point(worldWidth / 2, worldHeight / 2));
    }

    function draw(chunkData: ChunkData) {
        const tileSize = (chunkData.getSize()) / (chunkData.getData().length - 1);

        visualizationSettings.forEach((setting: IVisualizationSetting) => {
            switch (setting.type) {
                case VisualizationTypeEnum.Poly:
                    drawPolygons(setting);
                    break;
                case VisualizationTypeEnum.Square:
                    drawSquares(setting, 'Square', setting.scalingType);
                    break;
                case VisualizationTypeEnum.Circle:
                    drawSquares(setting, 'Circle', setting.scalingType);
                    break;
                case VisualizationTypeEnum.Triangle:
                    drawSquares(setting, 'Triangle', setting.scalingType);
                    break;
            }
        });

        function drawPolygons(setting: IVisualizationSetting) {
            let avgCenter = 0;
            setting.conditions.forEach((condition: IVisualizationCondition) => {
                avgCenter += (condition.min + condition.max) / 2;
            });
            avgCenter = 0;

            const shapes = new MarchingSquares(chunkData.getData().length, chunkData.getData().length,
                (x, y) => {
                    const values = chunkData.getData()[x][y];
                    return evaluationFunction(setting, values);
                },
                (x, y) => {
                    let closestValue = Number.MAX_VALUE;
                    let outputValue = 0;
                    setting.conditions.forEach((condition: IVisualizationCondition) => {
                        let center = (condition.min + condition.max) / 2;
                        let border = Math.abs(condition.max - condition.min) / 2;
                        let value = chunkData.getData()[x][y][condition.layerId];

                        let dist = Math.abs(center - value) / border;
                        let distRev = dist - 1;

                        if (dist < closestValue) {
                            closestValue = dist;
                            outputValue = distRev;
                        }
                    });
                    return outputValue;
                },
                (aVal, bVal) => {
                    let val = (avgCenter - aVal) / (bVal - aVal);
                    val = Math.max(0, val);
                    val = Math.min(1, val);
                    return val;
                }
            ).getShapes();

            shapes.forEach((shape) => {
                const points = shape.map((point) => {
                    return new paper.Point(
                        chunkData.getX() + point.x * tileSize,
                        chunkData.getY() + point.y * tileSize
                    );
                });

                const path = new paper.Path(points);
                path.strokeWidth = 0;
                path.fillColor = new paper.Color(setting.color);
                path.closed = true;
            });
        }

        function drawSquares(setting: IVisualizationSetting, shape: 'Square' | 'Circle' | 'Triangle' = 'Square', scalingType: ScalingTypeEnum = ScalingTypeEnum.NONE) {
            let avgMin = 0;
            let avgMax = 0;
            setting.conditions.forEach((condition: IVisualizationCondition) => {
                avgMin += condition.min;
                avgMax += condition.max;
            });
            avgMin /= setting.conditions.length;
            avgMax /= setting.conditions.length;

            for (let x = 0; x < chunkData.getData().length; x++) {
                for (let y = 0; y < chunkData.getData().length; y++) {
                    const values = chunkData.getData()[x][y];
                    if (evaluationFunction(setting, values)) {
                        const point = new paper.Point(
                            chunkData.getX() + x * tileSize,
                            chunkData.getY() + y * tileSize
                        );

                        let rect: paper.Path | null = null;
                        if (shape === 'Square') {
                            rect = new paper.Path.Rectangle(
                                point,
                                new paper.Size(tileSize, tileSize)
                            );
                        } else if (shape === 'Circle') {
                            point.x += tileSize / 2;
                            point.y += tileSize / 2;

                            rect = new paper.Path.Circle(
                                point,
                                tileSize / 2
                            );
                        } else if (shape === 'Triangle') {
                            point.x += tileSize / 2;
                            point.y += tileSize / 1.6;

                            rect = new paper.Path.RegularPolygon(
                                point,
                                3,
                                tileSize / 2
                            );
                        }

                        if (rect === null) return;

                        let maxScale = setting.maxScale || 1;
                        let minScale = setting.minScale || 0;
                        let valueScale = 1;
                        if (scalingType === ScalingTypeEnum.VALUE || scalingType === ScalingTypeEnum.BOTH) {
                            let avg = 0;
                            setting.conditions.forEach((condition: IVisualizationCondition) => {
                                avg += values[condition.layerId];
                            });
                            avg /= setting.conditions.length;
                            valueScale = WorldGenMath.invLerp(avgMin, avgMax, avg);
                        }

                        let zoomScale = 1;
                        if (scalingType === ScalingTypeEnum.ZOOM || scalingType === ScalingTypeEnum.BOTH) {
                            zoomScale = WorldGenMath.invLerp(minZoom, maxZoom, zoomRef.current);
                        }
                        let scale = Math.max(valueScale, zoomScale);

                        rect.strokeWidth = 0;
                        rect.fillColor = new paper.Color(setting.color);
                        rect.scale(Utils.clamp(scale, minScale, maxScale));
                    }
                }
            }
        }
    }

    function evaluationFunction(setting: IVisualizationSetting, values: IDictionary<number>): boolean {
        const conditions = setting.conditions;

        let meetsConditions = true;
        conditions.forEach((condition: IVisualizationCondition) => {
            const value = values[condition.layerId];

            if (!meetsCondition(condition, value)) {
                meetsConditions = false;
                return;
            }
        });

        return meetsConditions;
    }

    function meetsCondition(condition: IVisualizationCondition, value: number): boolean {
        const { min, minInclusive, max, maxInclusive } = condition;
        return (
            (minInclusive ? value >= min : value > min) &&
            (maxInclusive ? value <= max : value < max)
        );
    }


    return (
        <div id='editor'>
            <canvas id='worldCanvas' ref={canvasRef} />
        </div>
    );
}

export default Editor;
