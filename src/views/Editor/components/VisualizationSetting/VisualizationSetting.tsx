import './VisualizationSetting.scss';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import { IVisualizationCondition } from '../../../../ts/interfaces/visualization/IVisualizationCondition';
import { Input, Checkbox, Button, Text, Select } from '@chakra-ui/react';
import useStore from '../../editorStore';
import { VisualizationConditionalOperatorEnum } from '../../../../ts/enums/VisualizationConditionalOperatorEnum';
import ColorPicker from '../../../../components/ColorPicker/ColorPicker';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import { VisualizationTypeEnum } from '../../../../ts/enums/VisualizationTypeEnum';

type Props = {
    index: number;
    settings: IVisualizationSetting[];
    setSettings: (setting: IVisualizationSetting[]) => void;
};

export default function VisualizationSetting(props: Props) {
    const { index, settings, setSettings } = props;

    const setting = settings[index];

    const {
        layers,
    } = useStore();

    function setSetting(newSetting: IVisualizationSetting) {
        const newSettings = [...settings];
        newSettings[index] = newSetting;
        setSettings(newSettings);
    }

    function moveVisualizationSetting(index: number, direction: 'up' | 'down') {
        const newSettings = [...settings];
        const temp = newSettings[index];
        newSettings[index] = newSettings[index + (direction === 'up' ? -1 : 1)];
        newSettings[index + (direction === 'up' ? -1 : 1)] = temp;
        setSettings(newSettings);
    }

    function canMoveVisualizationSetting(index: number, direction: 'up' | 'down') {
        return direction === 'up' ? index !== 0 : index !== settings.length - 1;
    }

    function addCondition() {
        const newSetting = { ...setting };
        newSetting.conditions.push({
            layerId: -1,
            condOperator: null,
            min: 0,
            max: 0,
            minInclusive: false,
            maxInclusive: false,
        });
        setSetting(newSetting);
    }

    function deleteCondition(index: number) {
        const newSetting = { ...setting };
        newSetting.conditions.splice(index, 1);
        setSetting(newSetting);
    }

    function deleteSetting() {
        const newSettings = [...settings];
        newSettings.splice(index, 1);
        setSettings(newSettings);
    }

    function setCondition(index: number, condition: IVisualizationCondition) {
        const newSetting = { ...setting };
        newSetting.conditions[index] = condition;
        setSetting(newSetting);
    }

    function adjustConditionRangeInput(value: number): number {
        return value < 0 ? 0 : value > 1 ? 1 : value;
    }

    const conditionalOperatorSelectJSX = function (
        condition: IVisualizationCondition
    ) {
        return (
            <Select
                className='condition-operator'
                value={condition.condOperator?.toString()}
                onChange={(e) =>
                    setCondition(index, {
                        ...condition,
                        condOperator: e.target.value as VisualizationConditionalOperatorEnum,
                    })
                }
            >
                {Object.values(VisualizationConditionalOperatorEnum).map(
                    (operator) => (
                        <option key={operator} value={operator}>
                            {operator}
                        </option>
                    )
                )}
            </Select>
        );
    };

    const rangeJSX = function (
        condition: IVisualizationCondition,
        index: number
    ) {
        return (
            <>
                <div className='condition-range'>
                    <Input
                        className='min-input'
                        type='number'
                        value={condition.min.toString()}
                        min={0}
                        onChange={(e) =>
                            setCondition(index, {
                                ...condition,
                                min: adjustConditionRangeInput(
                                    parseFloat(e.target.value)
                                ),
                            })
                        }
                    />
                    <span className='condition-separator'>-</span>
                    <Input
                        className='max-input'
                        type='number'
                        value={condition.max.toString()}
                        max={1}
                        onChange={(e) =>
                            setCondition(index, {
                                ...condition,
                                max: adjustConditionRangeInput(
                                    parseFloat(e.target.value)
                                ),
                            })
                        }
                    />
                </div>
                <Checkbox
                    className='condition-min-inclusive'
                    defaultChecked={condition.minInclusive}
                    onChange={(e) =>
                        setCondition(index, {
                            ...condition,
                            minInclusive: e.target.checked,
                        })
                    }
                >
                    Min Inclusive
                </Checkbox>
                <Checkbox
                    className='condition-max-inclusive'
                    defaultChecked={condition.maxInclusive}
                    onChange={(e) =>
                        setCondition(index, {
                            ...condition,
                            maxInclusive: e.target.checked,
                        })
                    }
                >
                    Max Inclusive
                </Checkbox>
            </>
        );
    };

    return (
        <div className='visualization-setting'>
            <div className='setting-content'>
                <div className='visualization-type'>
                    <Select
                        className='visualization-type-input'
                        value={setting.type}
                        onChange={(e) =>
                            setSetting({ ...setting, type: e.target.value as VisualizationTypeEnum })
                        }
                    >
                        {Object.values(VisualizationTypeEnum).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className='color-picker'>
                    <ColorPicker color={setting.color} setColor={(color) => setSetting({ ...setting, color })} />
                    <Input
                        className='color-input'
                        value={setting.color}
                        placeholder='Hex Color'
                        onChange={(e) =>
                            setSetting({ ...setting, color: e.target.value })
                        }
                    />
                </div>
                <div className='conditions'>
                    <Text size='sm' fontWeight={600}>
                        Conditions
                    </Text>
                    {setting.conditions.map((condition, index) => {
                        return (
                            <div key={index} className='condition'>
                                {index != 0 &&
                                    conditionalOperatorSelectJSX(condition)}
                                <Select
                                    className='condition-field'
                                    value={condition.layerId}
                                    onChange={(e) =>
                                        setCondition(index, {
                                            ...condition,
                                            layerId: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    <option value={-1}>Select Layer</option>
                                    {layers.map((layer: ILayer) => (
                                        <option key={layer.id} value={layer.id}>
                                            {layer.name}
                                        </option>
                                    ))}
                                </Select>
                                {rangeJSX(condition, index)}
                                <div className='condition-actions'>
                                    <Button
                                        className='delete-condition-btn'
                                        onClick={() => deleteCondition(index)}
                                    >
                                        <i className='fa-solid fa-trash'></i>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='setting-actions'>
                <div>
                    <Button id='add-condition-btn' onClick={addCondition}>
                        <i className='fa-solid fa-plus'></i>
                    </Button>
                    <Button
                        id='delete-setting-btn'
                        onClick={deleteSetting}>
                        <i className='fa-solid fa-trash'></i>
                    </Button>
                    <Button
                        id='up-setting-btn'
                        onClick={() => moveVisualizationSetting(index, 'up')}
                        isDisabled={!canMoveVisualizationSetting(index, 'up')}
                    >
                        <i className='fa-solid fa-arrow-up'></i>
                    </Button>
                    <Button
                        id='down-setting-btn'
                        onClick={() => moveVisualizationSetting(index, 'down')}
                        isDisabled={!canMoveVisualizationSetting(index, 'down')}
                    >
                        <i className='fa-solid fa-arrow-down'></i>
                    </Button>
                </div>
                <div>
                </div>
            </div>
        </div>
    );
}
