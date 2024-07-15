# Changes
- 

# Todo
- Fix gaps between chunks.
- [Fix splitting. Splits too soon with unequal world widths and heights.](https://gyazo.com/03908767ee0e62ce41744b46108223d5)
- Add asynchronous loading of world map and noise maps.
- Improve responsiveness.
- Add more visualization settings.
- Add saving and loading of world maps.

# Hard Limitations
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

[v0.3.0: Added UI and customization](https://gyazo.com/bb5ba9ddf3790571e857bc8839ce7fec)