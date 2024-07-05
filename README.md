# Changes
- Added layer name changing
- Added layer expanding
- Added ability to add nodes
- Added ability to add layers
- Added ability to remove layers
- Added ability to remove nodes
- Added ability to hide/show layers
- Added ability to move node up/down
- Added ability to move layers right/left
- Added visualization menu
  - Added ability to add conditions (add, edit, remove)
  - Added modifying colour of met conditions
    - Added colour picker
- Added map settings menu
  - Added changing of map dimensions
  - Added changing map's fadeoff
  - Added randomize seeds action button
- Added scrolling large amounts of layers
- Added notification popups
  - Added notification for duplicate layer names
- No longer re-generates noise map when unnecessary during movement and zooming
- Can no longer have duplicate layer names
- Fixed window resizing causing canvas to stretch/squash
- Improved responsiveness

# Todo
- When repositioning, update chunking system of change.
- Fix gaps between chunks.
- [Fix terrain overlapping world border.](https://gyazo.com/c7a39a09e91fb1032082ac4ec3175b7e)
  - [Not caused by Marching Squares Algorithm.](https://gyazo.com/9c17127afa3e9ca8712c5410f1a182f5)
- [Fix splitting. Splits too soon with unequal world widths and heights.](https://gyazo.com/03908767ee0e62ce41744b46108223d5)

# Existing Limitations
- [Impractical for extremely large maps. This is because as zoom increases, precision decreases in the drawing of the map. Meaning, it's better suited for maps small to large, as a lower zoom level is necessary to view close-up details.](https://gyazo.com/69aa0be214b873100d41c36e17d735fb)

# Screenshots

[v0.0.1: Basic chunking system](https://gyazo.com/0c5e9109ef345a71506cadc2f073017b)

[v0.0.2: Using chunking system with basic noise](https://gyazo.com/4379fa8573ecb0024522b1bcde1a52c2)

[v0.1.0: Removal of chunking system. Redrawing noise map with every movement (zooming, panning, repositioning).](https://gyazo.com/9c01b0b29acd28cc0ee58cd77b4f9e68)

[v0.1.1: Generating contours for noise map](https://gyazo.com/5df468fa2c69e0efa2f148d9922686a0)

[v0.1.2: Generating shapes from contours](https://gyazo.com/33e2790b545fe9b07097b85cda4cd60b)

[v0.1.3: Applying simple height-based coloring](https://gyazo.com/0ba271c6433d6fd15b0f1305923c3131)

[v0.2.0: Added improved chunking system](https://gyazo.com/a40b173106a4ad1f92829ef01dbfc36b)

[v0.2.1: Using improved chunking system with basic noise](https://gyazo.com/bdc23ecca555e06deb557d2f0e83dfe2)