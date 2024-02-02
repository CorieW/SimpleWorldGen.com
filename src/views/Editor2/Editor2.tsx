import { useRef, useEffect } from 'react';
import './Editor2.scss';
import paper from 'paper';
import WorldGenerator2 from '../../ts/obsolete/WorldGenerator2';
import WorldDimensions from '../../ts/data/WorldDimensions';
import Vector2 from '../../ts/utils/Vector2';
import MapBodyExtractor from '../../ts/obsolete/MapBodyExtractor';
import Utils from '../../ts/utils/Utils';
import EdgeExtractor from '../../ts/obsolete/EdgeExtractor';
import MarchingSquares from '../../ts/utils/MarchingSquares';
import { Color } from 'paper/dist/paper-core';

function Editor2() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStart = useRef<paper.Point | null>(null);
    const world = useRef<WorldGenerator2 | null>(null);

    const maxZoom = 1000;
    const minZoom = 1;
    const tileSize = 15;

    let globalOffset = new paper.Point(0, 0);
    let globalZoom = 0;

    useEffect(() => {
        const screenDimensions = new Vector2(
            window.innerWidth,
            window.innerHeight
        );
        const worldDimensions = new WorldDimensions(
            screenDimensions.x / tileSize,
            screenDimensions.y / tileSize
        );
        const worldGenerator = new WorldGenerator2(worldDimensions, Date.now());
        world.current = worldGenerator;
        globalZoom = minZoom;

        // Attach Paper.js to the canvas and setup
        paper.setup(canvasRef.current!);
        paper.view.viewSize.width = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;

        paper.view.scale(minZoom, new paper.Point(0, 0));
        // paper.view.setCenter(0, 0);

        const data = worldGenerator.update(
            new Vector2(
                window.innerWidth / tileSize,
                window.innerHeight / tileSize
            ),
            globalOffset,
            globalZoom
        );
        draw(data);
    }, []);

    useEffect(() => {
        function onResize(event: Event) {
            // Resize the canvas to fill browser window dynamically
            paper.view.viewSize.width = window.innerWidth;
            paper.view.viewSize.height = window.innerHeight;
        }

        function onMouseDown(event: paper.MouseEvent) {
            dragStart.current = event.point;
        }

        function onDrag(event: paper.MouseEvent) {
            // clear the canvas
            paper.project.clear();

            if (dragStart.current) {
                let mouseDiff = event.point.subtract(dragStart.current);
                dragStart.current = event.point;

                // Delta is the amount the mouse has moved
                let delta = mouseDiff.multiply(1 / (globalZoom * tileSize));
                globalOffset = globalOffset.subtract(delta);

                const data = world.current!.update(
                    new Vector2(
                        window.innerWidth / tileSize,
                        window.innerHeight / tileSize
                    ),
                    globalOffset,
                    globalZoom
                );
                draw(data);
            }
        }

        function zoom(event: WheelEvent) {
            console.log(paper.project.layers.length)
            const oldLayer = paper.project.activeLayer;

            // Create a new layer
            const layer = new paper.Layer();
            paper.project.addLayer(layer);
            layer.activate();

            const view = paper.view;

            const oldZoom = globalZoom;
            let newZoom = oldZoom * (1 + event.deltaY * -0.001);
            // Limit zoom to reasonable values
            newZoom = Math.max(minZoom, Math.min(newZoom, maxZoom));

            const beta = oldZoom / newZoom;

            const mousePosition = new paper.Point(event.offsetX, event.offsetY);
            const viewPosition = view.viewToProject(mousePosition);
            let move = viewPosition.subtract(view.center);
            move = move.multiply(1 - beta);
            globalZoom = newZoom;

            const data = world.current!.update(
                new Vector2(
                    window.innerWidth / tileSize,
                    window.innerHeight / tileSize
                ),
                globalOffset,
                newZoom
            );

            // Zoom in
            // view.zoom = newZoom;
            requestAnimationFrame(() => {
                draw(data);

                // Delte the underlying layer
                // if (paper.project.layers.length > 0)
                    // paper.project.layers[0].remove();
            });

            // smoothZoomIntoLayer(oldLayer, beta);

            function smoothZoomIntoLayer(layer: paper.Layer, beta: number) {
                // TODO: Calculate the target scale based on width and height

                const scale = layer.scaling;
                const targetScale = scale.multiply(1 + (1 - beta)); // 1 + (1 - beta)
                const step = 0.05;

                function animate() {
                    // Next scale
                    const nextScaleX = scale.x + (targetScale.x - scale.x) * step;
                    const nextScaleY = scale.y + (targetScale.y - scale.y) * step;

                    console.log({ scale, targetScale, nextScaleX, nextScaleY });
                    if (scale >= targetScale) {
                        scale.set(targetScale);

                        requestAnimationFrame(() => {
                            draw(data);
                        });
                    } else {
                        scale.x = nextScaleX;
                        scale.y = nextScaleY;
                        requestAnimationFrame(animate);
                    }
                }

                animate();
            }
        }

        // window.addEventListener('resize', onResize);
        window.addEventListener('wheel', zoom);

        paper.view.onMouseDown = onMouseDown;
        paper.view.onMouseDrag = onDrag;

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('wheel', zoom);

            paper.view.onMouseDown = null;
            paper.view.onMouseDrag = null;
        };
    }, []);

    function draw(data: number[][]) {
        const worldDimensions = world.current!.getWorldDimensions();

        const seaColor = new paper.Color('#4dbedf');
        const deepSeaColor = new paper.Color('#2b8cb3');
        const grassColor = new paper.Color('#41980a');
        const sandColor = new paper.Color('#f7d08a');

        // Fill the background
        const background = new paper.Path.Rectangle(
            new paper.Point(0, 0),
            new paper.Size(
                worldDimensions.xKM * tileSize,
                worldDimensions.yKM * tileSize
            )
        );
        background.fillColor = deepSeaColor;

        // Draw the map
        drawForThreshold(0.25, seaColor);
        drawForThreshold(0.49, sandColor);
        drawForThreshold(0.5, grassColor);

        function drawForThreshold(threshold: number, color: paper.Color) {
            const marchingSquares = new MarchingSquares(data, threshold);
            const shapes = marchingSquares.getShapes();
            shapes.forEach((shape) => {
                const points = shape.map((point) => {
                    return new paper.Point(point.x * tileSize, point.y * tileSize);
                });

                const path = new paper.Path(points);
                path.strokeColor = color;
                path.fillColor = color;
                path.closed = true;
            });
        }
    }

    return (
        <div id='editor'>
            <canvas id='worldCanvas' ref={canvasRef} />
            <div className='overlay'></div>
        </div>
    );
}

export default Editor2;
