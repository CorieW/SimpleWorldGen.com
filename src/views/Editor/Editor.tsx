import { useRef, useEffect } from 'react';
import './Editor.scss';
import paper from 'paper';
import WorldGenerator from '../../ts/obsolete/WorldGenerator';
import NoiseSettings from '../../ts/data/NoiseSettings';
import TilingSettings from '../../ts/obsolete/TilingSettings';
import WorldDimensions from '../../ts/data/WorldDimensions';
import Vector2 from '../../ts/utils/Vector2';
import Bounds from '../../ts/data/Bounds';
import MarchingSquares from '../../ts/utils/MarchingSquares';

function Editor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStart = useRef<paper.Point | null>(null);
    const world = useRef<WorldGenerator | null>(null);

    const maxZoom = 10;
    const minZoom = 1;

    useEffect(() => {
        const worldDimensions = new WorldDimensions(1024, 1024);
        const tilingSettings = new TilingSettings(256, 64, 2, 2, 0.01);
        const noiseSettings = new NoiseSettings(
            Date.now(),
            120,
            1,
            0.5,
            0.5,
            0.5,
            0.5
        );
        const worldGenerator = new WorldGenerator(
            worldDimensions,
            tilingSettings,
            noiseSettings
        );
        worldGenerator.init();
        world.current = worldGenerator;

        // Attach Paper.js to the canvas and setup
        paper.setup(canvasRef.current!);
        paper.view.viewSize.width = window.innerWidth;
        paper.view.viewSize.height = window.innerHeight;

        paper.view.zoom = minZoom;
        paper.view.center = new paper.Point(0, 0);

        let viewCenter = new Vector2(paper.view.center.x, paper.view.center.y);
        let viewBottomLeft = new Vector2(
            -paper.view.viewSize.width / 2,
            -paper.view.viewSize.height / 2
        );
        worldGenerator.update(
            minZoom / maxZoom,
            new Bounds(
                viewBottomLeft.x + viewCenter.x,
                viewBottomLeft.y + viewCenter.y,
                paper.view.viewSize.width,
                paper.view.viewSize.height
            )
        );
        draw(worldGenerator.getTile().getFurthestTileDescendants());
    }, []);

    useEffect(() => {
        function onResize(event: UIEvent) {
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
            let zoom = Math.min(newZoom / maxZoom, 1 - minZoom / maxZoom);
            world.current!.update(zoom, Bounds.fromPaperRect(bounds));
            // renderWorld(view.center, view.zoom);

            // Display the world
            let tiles = world.current!.getTile().getFurthestTileDescendants();
            draw(tiles);
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
    }, []);

    function draw(tiles: any[]) {
        console.log(tiles);
        tiles.forEach((tile) => {
            let tileData = tile.getTileData();
            let tileDataSize = tileData.getSize();
            console.log(tileDataSize);
            let data = tileData.getData();
            let dataSize = tile.getSize() / tileDataSize;

            drawChunk(new paper.Point(tile.getX(), tile.getY()), dataSize, data);

            // for (let x = 0; x < tileDataSize; x++) {
            //     for (let y = 0; y < tileDataSize; y++) {
            //         const point = new paper.Point(
            //             tile.getX() + x * dataSize,
            //             tile.getY() + y * dataSize
            //         );
            //         // console.log(dataSize);

            //         let color = null;
            //         if (data[x][y] <= 0.6) {
            //             color = new paper.Color(0, 0, 1);
            //         } else {
            //             color = new paper.Color(0, 1, 0);
            //         }

            //         new paper.Path.Rectangle({
            //             point: point,
            //             size: new paper.Size(dataSize, dataSize),
            //             strokeColor: color,
            //             fillColor: color,
            //         });
            //     }
            // }
        });
    }

    function drawChunk(pos: paper.Point, tileSize: number, data: number[][]) {
        const seaColor = new paper.Color('#4dbedf');
        const deepSeaColor = new paper.Color('#2b8cb3');
        const grassColor = new paper.Color('#41980a');
        const sandColor = new paper.Color('#f7d08a');

        // Fill the background
        // const background = new paper.Path.Rectangle(
        //     new paper.Point(pos.x * tileSize, pos.y * tileSize),
        //     new paper.Size(
        //         tileSize * data.length,
        //         tileSize * data[0].length
        //     )
        // );
        // background.fillColor = deepSeaColor;

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
                path.strokeWidth = 1;
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

export default Editor;
