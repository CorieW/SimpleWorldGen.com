import './VisualizationSetting.scss';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import { IVisualizationCondition } from '../../../../ts/interfaces/visualization/IVisualizationCondition';
import { Checkbox, Button, Text, HStack } from '@chakra-ui/react';
import Input from '../../../../components/Basic/Input/Input';
import useStore from '../../editorStore';
import { VisualizationConditionalOperatorEnum } from '../../../../ts/enums/VisualizationConditionalOperatorEnum';
import ColorPicker from '../../../../components/Basic/ColorPicker/ColorPicker';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import { VisualizationTypeEnum } from '../../../../ts/enums/VisualizationTypeEnum';
import Shapes from '../../../../ts/utils/Shapes';
import { ScalingTypeEnum } from '../../../../ts/enums/ScalingTypeEnum';

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
            <Input
                label='Operator'
                className='condition-operator'
                type='select'
                value={condition.condOperator?.toString()}
                onChange={(valueString: any) =>
                    setCondition(index, {
                        ...condition,
                        condOperator: valueString as VisualizationConditionalOperatorEnum,
                    })
                }
                options={Object.values(VisualizationConditionalOperatorEnum).map((operator) => ({
                    label: operator,
                    value: operator,
                }))}
            />
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
                        label='Min Value'
                        className='min-input'
                        type='number'
                        value={condition.min.toString()}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(valueString: any) =>
                            setCondition(index, {
                                ...condition,
                                min: adjustConditionRangeInput(
                                    parseFloat(valueString)
                                ),
                            })
                        }
                    />
                    <span className='condition-separator'>-</span>
                    <Input
                        label='Max Value'
                        className='max-input'
                        type='number'
                        value={condition.max.toString()}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(valueString: any) =>
                            setCondition(index, {
                                ...condition,
                                max: adjustConditionRangeInput(
                                    parseFloat(valueString)
                                ),
                            })
                        }
                    />
                </div>
                <Checkbox
                    className='condition-min-inclusive'
                    defaultChecked={condition.minInclusive}
                    onChange={(e: any) =>
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
                    onChange={(e: any) =>
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
                    <Input
                        label='Visualization Type'
                        type='select'
                        className='visualization-type-input'
                        value={setting.type}
                        onChange={(valueString: any) =>
                            setSetting({ ...setting, type: valueString as VisualizationTypeEnum })
                        }
                        options={Object.values(VisualizationTypeEnum).map((type) => ({
                            label: type,
                            value: type,
                        }))}
                    />
                </div>
                {
                    Shapes.getShape(setting.type).canScale && (
                        <div className='scaling-type'>
                            <Input
                                label='Scaling Type'
                                className='scaling-type-input'
                                type='select'
                                value={setting.scalingType}
                                onChange={(valueString: any) =>
                                    setSetting({ ...setting, scalingType: valueString as ScalingTypeEnum })
                                }
                                options={Object.values(ScalingTypeEnum).map((type) => ({
                                    label: type,
                                    value: type,
                                }))}
                            />
                        </div>
                    )
                }
                <HStack>
                    <ColorPicker color={setting.color} setColor={(color) => setSetting({ ...setting, color })} />
                    <Input
                        className='color-input'
                        value={setting.color}
                        placeholder='Hex Color'
                        onChange={(valueString: any) =>
                            setSetting({ ...setting, color: valueString })
                        }
                    />
                </HStack>
                <div className='conditions'>
                    <Text size='sm' fontWeight={600}>
                        Conditions
                    </Text>
                    {setting.conditions.map((condition, index) => {
                        return (
                            <div key={index} className='condition'>
                                {index != 0 &&
                                    conditionalOperatorSelectJSX(condition)}
                                <Input
                                    label='Select Layer'
                                    className='condition-field'
                                    type='select'
                                    value={condition.layerId}
                                    onChange={(valueString: any) =>
                                        setCondition(index, {
                                            ...condition,
                                            layerId: parseInt(valueString),
                                        })
                                    }
                                    options={layers.map((layer: ILayer) => ({
                                        label: layer.name,
                                        value: layer.id,
                                    }))}
                                />
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
