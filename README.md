# SimpleWorldGen.com

An interactive browser-based tool for generating and exploring procedural worlds.

This project is simply a portfolio piece.

[![Visit SimpleWorldGen.com](https://img.shields.io/badge/Visit-SimpleWorldGen.com-2ea44f)](https://simpleworldgen.com)

## Development

The project uses Node.js 22 and pnpm. With a Node version manager, run `nvm use`
from the repository root before installing dependencies.

```sh
corepack enable
pnpm install
pnpm --dir firebase/functions install
pnpm run dev
```

Run all frontend and Firebase Functions validation with:

```sh
pnpm run check
```

The Firebase Functions runtime is explicitly set to Node.js 22 in both
`firebase/firebase.json` and `firebase/functions/package.json`.

## Version history
[v0.4.0: Added saving and loading](https://gyazo.com/af2092afaf6c2b01e81148fdf5f07a33)

[v0.3.0: Added UI and customization](https://gyazo.com/bb5ba9ddf3790571e857bc8839ce7fec)

[v0.2.1: Using improved chunking system with basic noise](https://gyazo.com/bdc23ecca555e06deb557d2f0e83dfe2)

[v0.2.0: Added improved chunking system](https://gyazo.com/a40b173106a4ad1f92829ef01dbfc36b)

[v0.1.3: Applying simple height-based coloring](https://gyazo.com/0ba271c6433d6fd15b0f1305923c3131)

[v0.1.2: Generating shapes from contours](https://gyazo.com/33e2790b545fe9b07097b85cda4cd60b)

[v0.1.1: Generating contours for noise map](https://gyazo.com/5df468fa2c69e0efa2f148d9922686a0)

[v0.1.0: Removal of chunking system. Redrawing noise map with every movement (zooming, panning, repositioning).](https://gyazo.com/9c01b0b29acd28cc0ee58cd77b4f9e68)

[v0.0.2: Using chunking system with basic noise](https://gyazo.com/4379fa8573ecb0024522b1bcde1a52c2)

[v0.0.1: Basic chunking system](https://gyazo.com/0c5e9109ef345a71506cadc2f073017b)
