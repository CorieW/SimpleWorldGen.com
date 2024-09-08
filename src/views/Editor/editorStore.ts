import { create } from 'zustand';
import { ILayer } from '../../ts/interfaces/ILayer';
import { NoiseTypeEnum } from '../../ts/enums/NoiseTypeEnum';
import { NodeTypeEnum } from '../../ts/enums/NodeTypeEnum';
import { NodeEffectEnum } from '../../ts/enums/NodeEffectEnum';
import { INode } from '../../ts/interfaces/INode';
import { IVisualizationSetting } from '../../ts/interfaces/visualization/IVisualizationSetting';
import { VisualizationColorTypeEnum } from '../../ts/enums/VisualizationColorTypeEnum';
import { IWorldSettings } from '../../ts/interfaces/IWorldSettings';
import { INoiseNode } from '../../ts/interfaces/INoiseNode';
import { VisualizationTypeEnum } from '../../ts/enums/VisualizationTypeEnum';
import { ScalingTypeEnum } from '../../ts/enums/ScalingTypeEnum';

type EditorStore = {
    worldSettings: IWorldSettings;
    setWorldSettings: (settings: IWorldSettings) => void;

    layerIdCounter: number;
    nodeIdCounter: number;
    getNewLayerId: () => number;
    getNewNodeId: () => number;

    activeFormLayerId: number;
    setActiveFormLayerId: (layerId: number) => void;
    activeFormNodeId: number;
    setActiveFormNodeId: (nodeId: number) => void;

    layers: ILayer[];
    setLayers: (layers: ILayer[]) => void;
    getLayer(id: number): ILayer | null;
    addLayer: (layer: ILayer) => void;
    removeLayer: (layerId: number) => void;
    modifyLayer: (layerId: number, layer: ILayer) => void;
    moveLayer: (layerId: number, direction: 'left' | 'right') => void;
    canMoveLayer(layerId: number, direction: 'left' | 'right'): boolean;
    randomizeSeeds: () => void;

    getNode: (nodeId: number) => INode | null;
    addNode: (node: INode | null, layerId: number) => void;
    removeNode: (nodeId: number) => void;
    modifyNode: (nodeId: number, node: INode) => void;
    moveNode: (nodeId: number, direction: 'up' | 'down') => void;
    isNodeFirstInLayer: (nodeId: number) => boolean;
    canMoveNode(nodeId: number, direction: 'up' | 'down'): boolean;
    getLayerWithNode: (nodeId: number) => ILayer | null;

    visualizationSettings: IVisualizationSetting[];
    setVisualizationSettings: (settings: IVisualizationSetting[]) => void;
};

const useStore: any = create<EditorStore>((set) => ({
    worldSettings: {
        worldWidth: 1000,
        worldHeight: 1000,
        backgroundColor: '#4a90e2',
        fadeOff: true,
        xFadeOffPercentage: 0.5,
        yFadeOffPercentage: 0.5,
    },
    setWorldSettings: (settings) => set({ worldSettings: settings }),

    layerIdCounter: 3,
    nodeIdCounter: 3,
    getNewLayerId: (): number => {
        // Increment the layerIdCounter and return the new value
        set((state) => ({ layerIdCounter: state.layerIdCounter + 1 }));
        return useStore.getState().layerIdCounter;
    },
    getNewNodeId: (): number => {
        // Increment the nodeIdCounter and return the new value
        set((state) => ({ nodeIdCounter: state.nodeIdCounter + 1 }));
        return useStore.getState().nodeIdCounter;
    },

    activeFormLayerId: -1,
    activeFormNodeId: -1,
    setActiveFormLayerId: (layerId) => set({ activeFormLayerId: layerId }),
    setActiveFormNodeId: (nodeId) => set({ activeFormNodeId: nodeId }),

    layers: [
        {
          "id": 0,
          "name": "Layer 1",
          "beginningNode": {
            "id": 0,
            "type": NodeTypeEnum.Noise,
            "noiseType": "Simplex",
            "multiplier": 1,
            "frequency": 0.01,
            "amplitude": 1,
            "octaves": 1,
            "persistence": 0.5,
            "lacunarity": 2,
            "seed": 1000,
            "offsetX": 0,
            "offsetY": 0,
            "effect": NodeEffectEnum.Add,
            "nextNode": null
          }
        },
        {
          "id": 1,
          "name": "Layer 2",
          "beginningNode": {
            "id": 1,
            "type": NodeTypeEnum.Noise,
            "noiseType": NoiseTypeEnum.Simplex,
            "multiplier": 1,
            "frequency": "0.03",
            "amplitude": 1,
            "octaves": 1,
            "persistence": "0.5",
            "lacunarity": 2,
            "seed": "0",
            "offsetX": 0,
            "offsetY": 0,
            "effect": NodeEffectEnum.Add,
            "nextNode": null
          }
        },
        {
          "id": 2,
          "name": "Layer 3",
          "beginningNode": {
            "id": 2,
            "type": NodeTypeEnum.Noise,
            "effect": NodeEffectEnum.Add,
            "nextNode": null,
            "noiseType": NoiseTypeEnum.Simplex,
            "octaves": "1",
            "seed": "1",
            "multiplier": "1.0",
            "persistence": "0.5",
            "lacunarity": "2.0",
            "frequency": "0.02",
            "offsetX": "0",
            "offsetY": "0"
          }
        }
    ],
    setLayers: (layers) => set({ layers }),
    getLayer: (id: number): ILayer | null => {
        for (let i = 0; i < useStore.getState().layers.length; i++) {
            if (useStore.getState().layers[i].id === id) {
                return useStore.getState().layers[i];
            }
        }

        return null;
    },
    addLayer: (layer) =>
        set({ layers: [...useStore.getState().layers, layer] }),
    removeLayer: (layerId) => {
        const currentLayers = useStore.getState().layers;
        const layerIndex = currentLayers.findIndex((l: ILayer) => l.id === layerId);

        if (layerIndex === -1) {
            return;
        }

        currentLayers.splice(layerIndex, 1);
        set({ layers: currentLayers });
    },
    modifyLayer: (layerId, layer) => {
        const currentLayers = useStore.getState().layers;
        const layerIndex = currentLayers.findIndex((l: ILayer) => l.id === layerId);

        if (layerIndex === -1) {
            return;
        }

        currentLayers[layerIndex] = layer;
        set({ layers: currentLayers });
    },
    moveLayer: (layerId: number, direction: 'left' | 'right') => {
        const currentLayers = useStore.getState().layers;
        const layerIndex = currentLayers.findIndex((l: ILayer) => l.id === layerId);

        if (layerIndex === -1) {
            return;
        }

        if (direction === 'left') {
            if (layerIndex === 0) {
                return;
            }

            const temp = currentLayers[layerIndex - 1];
            currentLayers[layerIndex - 1] = currentLayers[layerIndex];
            currentLayers[layerIndex] = temp;
        } else {
            if (layerIndex === currentLayers.length - 1) {
                return;
            }

            const temp = currentLayers[layerIndex + 1];
            currentLayers[layerIndex + 1] = currentLayers[layerIndex];
            currentLayers[layerIndex] = temp;
        }

        set({ layers: currentLayers });
    },
    canMoveLayer: (layerId: number, direction: 'left' | 'right'): boolean => {
        const currentLayers = useStore.getState().layers;
        const layerIndex = currentLayers.findIndex(
            (l: ILayer) => l.id === layerId
        );

        if (direction === 'left') {
            return layerIndex !== 0;
        } else {
            return layerIndex !== currentLayers.length - 1;
        }
    },
    randomizeSeeds: () => {
        const currentLayers = useStore.getState().layers;

        for (let i = 0; i < currentLayers.length; i++) {
            let currentNode: INode | null = currentLayers[i].beginningNode;

            while (currentNode) {
                if (currentNode.type === NodeTypeEnum.Noise) {
                    let noiseNode = currentNode as INoiseNode;
                    noiseNode.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                }

                currentNode = currentNode.nextNode;
            }
        }

        set({ layers: [...currentLayers] });
    },

    getNode: (nodeId: number): INode | null => {
        const layer = getLayerWithNode(useStore.getState().layers, nodeId);

        if (!layer) {
            return null;
        }

        let currentNode: INode | null = layer.beginningNode;

        while (currentNode) {
            if (currentNode.id === nodeId) {
                return currentNode;
            }

            currentNode = currentNode.nextNode;
        }

        return null;
    },
    addNode: (node: INode | null, layerId: number) => {
        if (!node) {
            node = {
                id: useStore.getState().getNewNodeId(),
                effect: NodeEffectEnum.Add
            } as INode;
        }

        const layers = useStore.getState().layers;
        const layer = findLayerById(layers, layerId);

        if (!layer) {
            return;
        }

        const topNode = getFinalNodeInLayer(layer);

        if (!topNode) {
            return;
        }

        topNode.nextNode = node;

        set({ layers: [...layers] });
    },
    removeNode: (nodeId: number) => {
        const layer = getLayerWithNode(useStore.getState().layers, nodeId);

        if (!layer) {
            return;
        }

        // If the layer only has one node, delete the layer
        if (layer.beginningNode.nextNode === null) {
            useStore.getState().removeLayer(layer.id);
        }

        let previousNode: INode | null = null;
        let currentNode: INode | null = layer.beginningNode;

        // Iterate through the nodes in the layer
        while (currentNode) {
            if (currentNode.id === nodeId) {
                // If the node is the first node in the layer, set the beginningNode to the next node
                if (previousNode === null) {
                    // Need this check to prevent a null pointer exception
                    if (currentNode.nextNode) {
                        layer.beginningNode = currentNode.nextNode;
                    }
                } else {
                    // If the node is not the first node in the layer, set the previous node's nextNode to the current node's nextNode
                    previousNode.nextNode = currentNode.nextNode;
                }

                break;
            }

            previousNode = currentNode;
            currentNode = currentNode.nextNode;
        }

        set({ layers: [...useStore.getState().layers] });
    },
    modifyNode: (nodeId, node: INode) => {
        const layer = getLayerWithNode(useStore.getState().layers, nodeId);

        if (!layer) {
            return;
        }

        let previousNode: INode | null = null;
        let currentNode: INode | null = layer.beginningNode;

        while (currentNode) {
            if (currentNode.id === nodeId) {
                if (previousNode) {
                    previousNode.nextNode = node;
                } else {
                    layer.beginningNode = node;
                }

                break;
            }

            previousNode = currentNode;
            currentNode = currentNode.nextNode;
        }
    },
    moveNode: (nodeId: number, direction: 'up' | 'down') => {
        const layer = getLayerWithNode(useStore.getState().layers, nodeId);

        if (!layer) return;

        let previousPreviousNode: INode | null = null;
        let previousNode: INode | null = null;
        let currentNode: INode | null = layer.beginningNode;

        if (currentNode === null || currentNode.nextNode === null) return;

        while (currentNode) {
            if (currentNode.id === nodeId) {
                if (direction === 'up') {
                    if (previousNode === null) return;

                    previousNode.nextNode = currentNode.nextNode;
                    currentNode.nextNode = previousNode;

                    if (previousPreviousNode) {
                        previousPreviousNode.nextNode = currentNode;
                    } else {
                        layer.beginningNode = currentNode;
                    }
                } else {
                    if (currentNode.nextNode === null) return;

                    const newAbove = currentNode.nextNode;
                    currentNode.nextNode = newAbove.nextNode;
                    newAbove.nextNode = currentNode;

                    if (previousNode) {
                        previousNode.nextNode = newAbove;
                    } else {
                        layer.beginningNode = newAbove;
                    }
                }

                break;
            }

            previousPreviousNode = previousNode;
            previousNode = currentNode;
            currentNode = currentNode.nextNode;
        }

        set({ layers: [...useStore.getState().layers] });
    },
    isNodeFirstInLayer: (nodeId: number): boolean => {
        const layer = getLayerWithNode(useStore.getState().layers, nodeId);

        if (!layer) {
            return false;
        }

        return layer.beginningNode.id === nodeId;
    },
    canMoveNode: (nodeId: number, direction: 'up' | 'down'): boolean => {
        const layer = getLayerWithNode(useStore.getState().layers, nodeId);

        // Node is parent node (no node before it)
        if (layer?.beginningNode.id === nodeId && direction === 'up') {
            return false;
        }

        const currentNode = useStore.getState().getNode(nodeId);
        // No node after the current node
        if (currentNode?.nextNode == null && direction === 'down') {
            return false;
        }

        return true;
    },
    getLayerWithNode: (nodeId: number): ILayer | null =>
        getLayerWithNode(useStore.getState().layers, nodeId),

    visualizationSettings: [
        {
            "type": VisualizationTypeEnum.Square,
            "colorType": VisualizationColorTypeEnum.Color,
            "color": "#4a90e2",
            "conditions": [
                {
                "condOperator": null,
                "layerId": 0,
                "min": 0,
                "max": 0.5,
                "minInclusive": true,
                "maxInclusive": false
                }
            ]
        },
        {
            "type": VisualizationTypeEnum.Square,
            "colorType": VisualizationColorTypeEnum.Color,
            "color": "#fff694",
            "conditions": [
                {
                    "layerId": 0,
                    "condOperator": null,
                    "min": 0.49,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                },
                {
                    "layerId": 1,
                    "condOperator": null,
                    "min": 0.4,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                }
            ]
        },
        {
            "type": VisualizationTypeEnum.Square,
            "colorType": VisualizationColorTypeEnum.Color,
            "color": "#7ed321",
            "conditions": [
                {
                    "condOperator": null,
                    "layerId": 0,
                    "min": 0.5,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                }
            ]
        },
        {
            "type": VisualizationTypeEnum.Triangle,
            "scalingType": ScalingTypeEnum.BOTH,
            "colorType": VisualizationColorTypeEnum.Color,
            "color": "#5ea60e",
            "conditions": [
                {
                    "condOperator": null,
                    "layerId": 0,
                    "min": 0.5,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                },
                {
                    "condOperator": null,
                    "layerId": 1,
                    "min": 0.5,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                }
            ]
        },
        {
            "type": VisualizationTypeEnum.Square,
            "colorType": VisualizationColorTypeEnum.Color,
            "color": "#fff694",
            "conditions": [
                {
                    "layerId": 3,
                    "condOperator": null,
                    "min": 0.6,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                },
                {
                    "layerId": 0,
                    "condOperator": null,
                    "min": 0,
                    "max": 0.2,
                    "minInclusive": true,
                    "maxInclusive": false
                }
            ]
        },
        {
            "type": VisualizationTypeEnum.Square,
            "colorType": VisualizationColorTypeEnum.Color,
            "color": "#7ed321",
            "conditions": [
                {
                    "layerId": 3,
                    "condOperator": null,
                    "min": 0.61,
                    "max": 1,
                    "minInclusive": true,
                    "maxInclusive": false
                },
                {
                    "layerId": 0,
                    "condOperator": null,
                    "min": 0,
                    "max": 0.2,
                    "minInclusive": true,
                    "maxInclusive": false
                }
            ]
        }
    ],
    setVisualizationSettings: (settings) =>
        set({ visualizationSettings: settings }),
}));

function findLayerById(layers: ILayer[], layerId: number): ILayer | null {
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].id === layerId) {
            return layers[i];
        }
    }

    return null;
}

// Helper Functions
function getLayerWithNode(layers: ILayer[], nodeId: number): ILayer | null {
    for (let i = 0; i < layers.length; i++) {
        if (isNodeInLayer(layers[i], nodeId)) {
            return layers[i];
        }
    }

    return null;
}

function isNodeInLayer(layer: ILayer, nodeId: number): boolean {
    let currentNode: INode | null = layer.beginningNode;

    while (currentNode) {
        if (currentNode.id === nodeId) {
            return true;
        }

        currentNode = currentNode.nextNode;
    }

    return false;
}

function getFinalNodeInLayer(layer: ILayer): INode | null {
    let currentNode: INode | null = layer.beginningNode;

    while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
    }

    return currentNode;
}

export default useStore;