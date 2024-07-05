import { useRef, useEffect } from 'react';
import './Editor.scss';
import paper from 'paper';
import WorldGenerator from '../../ts/WorldGenerator';
import WorldDimensions from '../../ts/data/WorldDimensions';
import MarchingSquares from '../../ts/utils/MarchingSquares';
import Bounds from '../../ts/data/Bounds';
import ChunkData from '../../ts/data/ChunkData';
import EditorOverlay from './components/EditorOverlay/EditorOverlay';
import useStore from './editorStore';
import { NodeValueCalculator } from '../../ts/utils/LayerValueCalculator';
import { ILayer } from '../../ts/interfaces/ILayer';
import { VisualizationConditionalOperatorEnum } from '../../ts/enums/VisualizationConditionalOperatorEnum';
import { IVisualizationCondition } from '../../ts/interfaces/visualization/IVisualizationCondition';
import { IVisualizationSetting } from '../../ts/interfaces/visualization/IVisualizationSetting';

function Editor() {
    const { worldSettings, visualizationSettings, layers } = useStore();

    const { worldWidth, worldHeight, fadeOff, xFadeOffPercentage, yFadeOffPercentage } = worldSettings;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const positionRef = useRef<paper.Point>(new paper.Point(worldWidth / 2, worldHeight / 2));
    const zoomRef = useRef<number>(1);
    const dragStartRef = useRef<paper.Point | null>(null);
    const worldRef = useRef<WorldGenerator | null>(null);

    const maxZoom = 1000;
    const minZoom = 0.01;

    useEffect(() => {
        console.log('Initializing editor');
        const worldDimensions = new WorldDimensions(
            worldWidth,
            worldHeight
        );
        const worldGenerator = new WorldGenerator(worldDimensions, generateNoiseValueFunc);
        worldGenerator.xFadeOffRange = fadeOff ? xFadeOffPercentage : 1;
        worldGenerator.yFadeOffRange = fadeOff ? yFadeOffPercentage : 1;
        worldRef.current = worldGenerator;

        // Attach Paper.js to the canvas and setup
        paper.setup(canvasRef.current!);
        paper.view.viewSize.width = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;
        paper.view.center = positionRef.current;
        paper.view.zoom = zoomRef.current;

        dragStartRef.current = null;

        updateWorld();

        function generateNoiseValueFunc(globalX: number, globalY: number) {
            return new NodeValueCalculator(layers[0].beginningNode).calculateValue(globalX, globalY);
        }
    }, [worldSettings, layers.map((layer) => layer.beginningNode)]);

    useEffect(() => {
        function onResize(event: Event) {
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

            updateWorld();
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

            updateWorld();
        }

        function setPosition(point: paper.Point) {
            positionRef.current = point;
            paper.view.center = point;
        }

        function setZoom(zoom: number) {
            zoomRef.current = zoom;
            paper.view.zoom = zoom;
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

        // Draw background
        const deepSeaColor = new paper.Color('#2b8cb3');
        // Use world dimensions to draw the background
        const background = new paper.Path.Rectangle(
            new paper.Point(0, 0),
            new paper.Point(worldWidth, worldHeight)
        );
        background.fillColor = deepSeaColor;

        worldRef.current!.update(
            boundsData,
            (chunkData: ChunkData) => {
                draw(chunkData);
            }
        );
    }

    function draw(chunkData: ChunkData) {
        const tileSize = chunkData.getSize() / (chunkData.getData().length - 1);

        // visualizationSettings.forEach((setting) => {
        //     const shapes = new MarchingSquares(chunkData.getData(), (values) => evaluationFunction(setting, values)).getShapes();
        //     shapes.forEach((shape) => {
        //         const points = shape.map((point) => {
        //             return new paper.Point(
        //                 chunkData.getX() + point.x * tileSize,
        //                 chunkData.getY() + point.y * tileSize
        //             );
        //         });

        //         const path = new paper.Path(points);
        //         path.strokeWidth = 0;
        //         path.fillColor = new paper.Color(setting.color);
        //         path.closed = true;
        //     });
        // }

        const seaColor = new paper.Color('#4dbedf');
        const grassColor = new paper.Color('#41980a');
        const sandColor = new paper.Color('#f7d08a');

        // Draw the map
        drawForThreshold(0.25, seaColor);
        drawForThreshold(0.49, sandColor);
        drawForThreshold(0.5, grassColor);

        function drawForThreshold(threshold: number, color: paper.Color) {
            const marchingSquares = new MarchingSquares(
                chunkData.getData(),
                threshold
            );
            const shapes = marchingSquares.getShapes();
            shapes.forEach((shape) => {
                const points = shape.map((point) => {
                    return new paper.Point(
                        chunkData.getX() + point.x * tileSize,
                        chunkData.getY() + point.y * tileSize
                    );
                });

                const path = new paper.Path(points);
                path.strokeWidth = 0;
                path.fillColor = color;
                path.closed = true;
            });
        }
    }

    function getColorForValues(values: number[]): paper.Color {
        visualizationSettings.forEach((setting) => {
            const conditions = setting.conditions;

            let meetsConditions = true;
            conditions.forEach((condition) => {
                const value = values[condition.layerId];

                if (!meetsCondition(condition, value)) {
                    meetsConditions = false;
                    return;
                }
            });

            if (meetsConditions) {
                return new paper.Color(setting.color);
            }
        });

        return new paper.Color('#000000');
    }

    function evaluationFunction(setting: IVisualizationSetting, values: number[]): boolean {
        const conditions = setting.conditions;

        let meetsConditions = true;
        conditions.forEach((condition) => {
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
            <EditorOverlay />
        </div>
    );
}

export default Editor;
