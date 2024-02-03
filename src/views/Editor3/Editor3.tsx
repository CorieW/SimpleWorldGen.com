import { useRef, useEffect } from 'react';
import './Editor3.scss';
import paper from 'paper';
import WorldGenerator from '../../ts/WorldGenerator';
import WorldDimensions from '../../ts/data/WorldDimensions';
import Vector2 from '../../ts/utils/Vector2';
import MarchingSquares from '../../ts/utils/MarchingSquares';
import Bounds from '../../ts/data/Bounds';
import ChunkData from '../../ts/data/ChunkData';

function Editor3() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStart = useRef<paper.Point | null>(null);
    const world = useRef<WorldGenerator | null>(null);

    const maxZoom = 1000;
    const minZoom = 0.01;

    const worldKMWidth = 1000;
    const worldKMHeight = 1000;

    let globalOffset = new paper.Point(0, 0);
    let globalZoom = 0;

    const initialZoom = (): number => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const worldWidth = worldKMWidth;
        const worldHeight = worldKMHeight;

        const zoomX = width / worldWidth;
        const zoomY = height / worldHeight;

        return Math.min(zoomX, zoomY);
    }

    useEffect(() => {
        const worldDimensions = new WorldDimensions(
            worldKMWidth,
            worldKMHeight
        );
        const worldGenerator = new WorldGenerator(worldDimensions, Date.now());
        world.current = worldGenerator;
        globalZoom = initialZoom();

        console.log(globalZoom);

        // Attach Paper.js to the canvas and setup
        paper.setup(canvasRef.current!);
        paper.view.viewSize.width = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;
        paper.view.zoom = globalZoom;
        paper.view.center = new paper.Point(worldKMWidth / 2, worldKMHeight / 2);

        let bounds = paper.view.bounds;
        worldGenerator.update(
            new Bounds(
                bounds.x,
                bounds.y,
                bounds.width,
                bounds.height
            ),
            (chunkData: ChunkData) => {
                draw(chunkData);
            }
        );
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
            const view = paper.view;
            if (dragStart.current) {
                const delta = event.point.subtract(dragStart.current);
                console.log(delta);
                view.center = view.center.subtract(delta);
            }
        }

        function zoom(event: WheelEvent) {
            // clear the canvas
            paper.project.activeLayer.removeChildren();

            const view = paper.view;

            const oldZoom = view.zoom;
            let newZoom = oldZoom * (1 + event.deltaY * -0.001);
            // Limit zoom to reasonable values
            newZoom = Math.max(minZoom, Math.min(newZoom, maxZoom));

            const beta = oldZoom / newZoom;

            const mousePosition = new paper.Point(event.offsetX, event.offsetY);
            const viewPosition = view.viewToProject(mousePosition);
            let move = viewPosition.subtract(view.center);
            move = move.multiply(1 - beta);
            const newCenter = view.center.add(move);

            view.zoom = newZoom;
            view.center = newCenter;

            let bounds = paper.view.bounds;
            world.current!.update(
                new Bounds(
                    bounds.x,
                    bounds.y,
                    bounds.width,
                    bounds.height
                ),
                (chunkData: ChunkData) => {
                    draw(chunkData);
                }
            );
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

    function draw(chunkData: ChunkData) {
        console.log(chunkData)
        // Fill the background
        const background = new paper.Path.Rectangle(
            new paper.Point(chunkData.getX(), chunkData.getY()),
            new paper.Size(
                chunkData.getSize(),
                chunkData.getSize()
            )
        );
        background.fillColor = new paper.Color('#2b8cb3')
        background.strokeColor = new paper.Color('black');
        background.strokeWidth = chunkData.getSize() / 100;
    }

    return (
        <div id='editor'>
            <canvas id='worldCanvas' ref={canvasRef} />
            <div className='overlay'></div>
        </div>
    );
}

export default Editor3;
