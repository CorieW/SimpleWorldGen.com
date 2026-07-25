import { useRef, useEffect, useState } from 'react';
import './Editor.scss';
import paper from 'paper';
import WorldDimensions from '../../ts/data/WorldDimensions';
import MarchingSquares from '../../ts/utils/MarchingSquares';
import Bounds from '../../ts/data/Bounds';
import ChunkData from '../../ts/data/ChunkData';
import EditorOverlay from './components/EditorOverlay/EditorOverlay';
import useStore from './editorStore';
import { IVisualizationCondition } from '../../ts/interfaces/visualization/IVisualizationCondition';
import { IVisualizationSetting } from '../../ts/interfaces/visualization/IVisualizationSetting';
import IDictionary from '../../ts/utils/IDictionary';
import WorldGenMath from '../../ts/WorldGenMath';
import { VisualizationTypeEnum } from '../../ts/enums/VisualizationTypeEnum';
import { ScalingTypeEnum } from '../../ts/enums/ScalingTypeEnum';
import Utils from '../../ts/utils/Utils';
import WorldGenerator from '../../ts/WorldGenerator';

function Editor() {
    const { worldSettings, visualizationSettings, layers } = useStore();

    const { worldWidth, worldHeight, fadeOff, xFadeOffPercentage, yFadeOffPercentage } = worldSettings;

    const [isGenerating, setIsGenerating] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const positionRef = useRef<paper.Point>(new paper.Point(worldWidth / 2, worldHeight / 2));
    const zoomRef = useRef<number>(1);
    const dragStartRef = useRef<paper.Point | null>(null);
    const worldRef = useRef<WorldGenerator | null>(null);
    const renderedLayerRef = useRef<paper.Layer | null>(null);
    const generationRequestRef = useRef<number>(0);
    const zoomGenerationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const maxZoom = 1000;
    const minZoom = 0.01;

    useEffect(() => {
        paper.setup(canvasRef.current!);
        paper.view.viewSize.width = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;
        paper.view.center = positionRef.current;
        paper.view.zoom = zoomRef.current;
        renderedLayerRef.current = paper.project.activeLayer;

        return () => {
            if (zoomGenerationTimeoutRef.current !== null) {
                clearTimeout(zoomGenerationTimeoutRef.current);
            }
            invalidateGeneration(generationRequestRef);
            worldRef.current?.cancelPendingGeneration();
            renderedLayerRef.current = null;
        };
    }, []);

    useEffect(() => {
        const worldDimensions = new WorldDimensions(
            worldWidth,
            worldHeight
        );
        const worldGenerator = new WorldGenerator(worldDimensions, layers);
        worldGenerator.xFadeOffEndRange = fadeOff ? Utils.clamp(xFadeOffPercentage, 0, 1) : 1;
        worldGenerator.yFadeOffEndRange = fadeOff ? Utils.clamp(yFadeOffPercentage, 0, 1) : 1;
        worldRef.current = worldGenerator;

        canvasRef.current!.style.backgroundColor = worldSettings.backgroundColor;
        dragStartRef.current = null;
        void updateWorld(true, true);

        return () => {
            invalidateGeneration(generationRequestRef);
            worldGenerator.cancelPendingGeneration();
        };
    }, [worldSettings, layers, visualizationSettings]);

    useEffect(() => {
        function onResize() {
            // Resize the canvas to fill browser window dynamically
            paper.view.viewSize.width = window.innerWidth;
            paper.view.viewSize.height = window.innerHeight;
            void updateWorld();
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

            const view = paper.view;

            const oldZoom = zoomRef.current;
            const mousePosition = new paper.Point(event.offsetX, event.offsetY);
            const viewPosition = view.viewToProject(mousePosition);
            const newZoom = oldZoom * Math.exp(event.deltaY * -0.001);
            setZoom(newZoom, false);
            const zoom = zoomRef.current;
            if (zoom === oldZoom) return;

            const beta = oldZoom / zoom;
            let move = viewPosition.subtract(positionRef.current);
            move = move.multiply(1 - beta);
            const newCenter = positionRef.current.add(move);

            setPosition(newCenter, false);
            cancelPendingGeneration();
            scheduleWorldUpdate();
        }

        window.addEventListener('resize', onResize);
        window.addEventListener('wheel', zoom);

        paper.view.onMouseDown = onMouseDown;
        paper.view.onMouseDrag = onDrag;

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('wheel', zoom);

            if (zoomGenerationTimeoutRef.current !== null) {
                clearTimeout(zoomGenerationTimeoutRef.current);
                zoomGenerationTimeoutRef.current = null;
            }

            paper.view.onMouseDown = null;
            paper.view.onMouseDrag = null;
        };
    });

    async function updateWorld(force: boolean = false, showLoading: boolean = false) {
        const worldGenerator = worldRef.current;
        if (!worldGenerator) return;

        const bounds = paper.view.bounds;
        const boundsData = new Bounds(bounds.x, bounds.y, bounds.width, bounds.height);

        if (!force && !worldGenerator.shouldUpdate(boundsData)) return;

        const requestId = ++generationRequestRef.current;
        worldGenerator.cancelPendingGeneration();
        if (showLoading) setIsGenerating(true);

        const previousLayer = renderedLayerRef.current;
        const nextLayer = new paper.Layer();
        nextLayer.visible = false;

        try {
            await worldGenerator.update(boundsData, (chunkData) => {
                if (requestId !== generationRequestRef.current || worldGenerator !== worldRef.current) {
                    return;
                }

                nextLayer.activate();
                draw(chunkData);
            });

            if (requestId !== generationRequestRef.current || worldGenerator !== worldRef.current) {
                nextLayer.remove();
                return;
            }

            previousLayer?.remove();
            nextLayer.visible = true;
            nextLayer.activate();
            renderedLayerRef.current = nextLayer;
            paper.view.update();
        } catch (error) {
            nextLayer.remove();
            if (requestId !== generationRequestRef.current) return;

            worldGenerator.cancelPendingGeneration();
            previousLayer?.activate();
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                console.error('Failed to generate world:', error);
            }
        } finally {
            if (requestId === generationRequestRef.current) {
                setIsGenerating(false);
            }
        }
    }

    function cancelPendingGeneration() {
        invalidateGeneration(generationRequestRef);
        worldRef.current?.cancelPendingGeneration();
    }

    function scheduleWorldUpdate() {
        if (zoomGenerationTimeoutRef.current !== null) {
            clearTimeout(zoomGenerationTimeoutRef.current);
        }

        zoomGenerationTimeoutRef.current = setTimeout(() => {
            zoomGenerationTimeoutRef.current = null;
            void updateWorld();
        }, 120);
    }

    function setZoom(zoom: number, regenerate: boolean = true) {
        zoom = Math.max(minZoom, Math.min(zoom, maxZoom));
        zoomRef.current = zoom;
        paper.view.zoom = zoom;
        if (regenerate) void updateWorld();
    }

    function setPosition(point: paper.Point, regenerate: boolean = true) {
        positionRef.current = point;
        paper.view.center = point;
        if (regenerate) void updateWorld();
    }

    function zoomIn() {
        setZoom(zoomRef.current * 1.1);
    }

    function zoomOut() {
        setZoom(zoomRef.current * 0.9);
    }

    function resetView() {
        setZoom(1, false);
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
                    drawShapes(setting, 'Square', setting.scalingType);
                    break;
                case VisualizationTypeEnum.Circle:
                    drawShapes(setting, 'Circle', setting.scalingType);
                    break;
                case VisualizationTypeEnum.Triangle:
                    drawShapes(setting, 'Triangle', setting.scalingType);
                    break;
            }
        });

        function drawPolygons(setting: IVisualizationSetting) {
            const shapes = new MarchingSquares(chunkData.getData().length, chunkData.getData().length,
                (x, y) => {
                    const values = chunkData.getData()[y][x];
                    return evaluationFunction(setting, values);
                },
                (x, y) => {
                    let outputValue = Number.NEGATIVE_INFINITY;
                    setting.conditions.forEach((condition: IVisualizationCondition) => {
                        const center = (condition.min + condition.max) / 2;
                        const border = Math.abs(condition.max - condition.min) / 2;
                        const value = chunkData.getData()[y][x][condition.layerId];
                        const signedDistance = border === 0
                            ? Math.abs(center - value)
                            : Math.abs(center - value) / border - 1;

                        outputValue = Math.max(outputValue, signedDistance);
                    });
                    return Number.isFinite(outputValue) ? outputValue : 0;
                },
                (aVal, bVal) => {
                    if (aVal === bVal) return 0.5;
                    return Utils.clamp(-aVal / (bVal - aVal), 0, 1);
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
                applyFill(path, setting.color, true);
                path.closed = true;
            });
        }

        function drawShapes(setting: IVisualizationSetting, shape: 'Square' | 'Circle' | 'Triangle' = 'Square', scalingType: ScalingTypeEnum = ScalingTypeEnum.NONE) {
            for (let y = 0; y < chunkData.getData().length - 1; y++) {
                for (let x = 0; x < chunkData.getData()[y].length - 1; x++) {
                    const values = chunkData.getData()[y][x];
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
                            point.y += tileSize / 2;

                            rect = new paper.Path.RegularPolygon(
                                point,
                                3,
                                tileSize / 2
                            );
                        }

                        if (rect === null) return;

                        const maxScale = setting.maxScale ?? 1;
                        const minScale = setting.minScale ?? 0;
                        let valueScale = 1;
                        if (scalingType === ScalingTypeEnum.VALUE || scalingType === ScalingTypeEnum.BOTH) {
                            const normalizedValues = setting.conditions.map((condition) =>
                                WorldGenMath.invLerp(
                                    condition.min,
                                    condition.max,
                                    values[condition.layerId]
                                )
                            );
                            valueScale = normalizedValues.length === 0
                                ? 1
                                : normalizedValues.reduce((sum, value) => sum + value, 0) / normalizedValues.length;
                        }

                        let zoomScale = 1;
                        if (scalingType === ScalingTypeEnum.ZOOM || scalingType === ScalingTypeEnum.BOTH) {
                            zoomScale = WorldGenMath.invLerp(
                                Math.log(minZoom),
                                Math.log(maxZoom),
                                Math.log(zoomRef.current)
                            );
                        }
                        const scale = Math.max(valueScale, zoomScale);

                        rect.scale(Utils.clamp(scale, minScale, maxScale));
                        applyFill(rect, setting.color, shape === 'Square');
                    }
                }
            }
        }

        function applyFill(path: paper.Path, color: string, coverSeams: boolean) {
            const fillColor = new paper.Color(color);
            path.fillColor = fillColor;
            path.strokeColor = coverSeams ? fillColor : null;
            path.strokeWidth = coverSeams ? 2 / zoomRef.current : 0;
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
            <div
                className={`loading-container-a ${isGenerating ? '' : 'hidden'}`}
                role='status'
                aria-label='Regenerating map'
                aria-hidden={!isGenerating}
            >
                <i className='fa-solid fa-spinner fa-spin'></i>
            </div>
            <EditorOverlay zoomIn={zoomIn} zoomOut={zoomOut} resetView={resetView} />
        </div>
    );
}

function invalidateGeneration(requestRef: { current: number }) {
    requestRef.current++;
}

export default Editor;
