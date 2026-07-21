import { Button } from '@chakra-ui/react';
import Input from '../../../../components/Input/Input';
import ColorPicker from '../../../../components/ColorPicker/ColorPicker';
import { ScalingTypeEnum } from '../../../../ts/enums/ScalingTypeEnum';
import { VisualizationTypeEnum } from '../../../../ts/enums/VisualizationTypeEnum';
import { IVisualizationCondition } from '../../../../ts/interfaces/visualization/IVisualizationCondition';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import Shapes from '../../../../ts/utils/Shapes';
import useStore from '../../editorStore';
import VisualizationCondition from './VisualizationCondition';
import './VisualizationSetting.scss';

type Props = {
    index: number;
    settings: IVisualizationSetting[];
    setSettings: (settings: IVisualizationSetting[]) => void;
};

export default function VisualizationSetting({ index, settings, setSettings }: Props) {
    const { layers } = useStore();
    const setting = settings[index];

    function replaceSetting(nextSetting: IVisualizationSetting) {
        setSettings(settings.map((current, currentIndex) => (
            currentIndex === index ? nextSetting : current
        )));
    }

    function updateSetting(changes: Partial<IVisualizationSetting>) {
        replaceSetting({ ...setting, ...changes });
    }

    function moveSetting(direction: 'up' | 'down') {
        const targetIndex = index + (direction === 'up' ? -1 : 1);
        if (targetIndex < 0 || targetIndex >= settings.length) return;

        const reorderedSettings = [...settings];
        [reorderedSettings[index], reorderedSettings[targetIndex]] = [
            reorderedSettings[targetIndex],
            reorderedSettings[index],
        ];
        setSettings(reorderedSettings);
    }

    function addCondition() {
        const condition: IVisualizationCondition = {
            layerId: layers[0]?.id ?? -1,
            condOperator: null,
            min: 0,
            max: 1,
            minInclusive: false,
            maxInclusive: false,
        };
        updateSetting({ conditions: [...setting.conditions, condition] });
    }

    function replaceCondition(conditionIndex: number, condition: IVisualizationCondition) {
        updateSetting({
            conditions: setting.conditions.map((current, currentIndex) => (
                currentIndex === conditionIndex ? condition : current
            )),
        });
    }

    function deleteCondition(conditionIndex: number) {
        updateSetting({
            conditions: setting.conditions.filter((_, currentIndex) => currentIndex !== conditionIndex),
        });
    }

    function deleteSetting() {
        setSettings(settings.filter((_, currentIndex) => currentIndex !== index));
    }

    const canMoveUp = index > 0;
    const canMoveDown = index < settings.length - 1;

    return (
        <div className='visualization-setting'>
            <div className='setting-label'>Visualization {index + 1}</div>

            <div className='setting-content'>
                <Input
                    label='Visualization Type'
                    type='select'
                    className='visualization-type-input'
                    value={setting.type}
                    onChange={(value) => updateSetting({ type: value as VisualizationTypeEnum })}
                    options={Object.values(VisualizationTypeEnum).map((type) => ({
                        label: type,
                        value: type,
                    }))}
                />

                {Shapes.getShape(setting.type).canScale && (
                    <Input
                        label='Scaling Type'
                        className='scaling-type-input'
                        type='select'
                        value={setting.scalingType}
                        onChange={(value) => updateSetting({ scalingType: value as ScalingTypeEnum })}
                        options={Object.values(ScalingTypeEnum).map((type) => ({
                            label: type,
                            value: type,
                        }))}
                    />
                )}

                <div className='color-setting-row'>
                    <ColorPicker
                        color={setting.color}
                        setColor={(color) => updateSetting({ color })}
                    />
                    <Input
                        className='color-input'
                        value={setting.color}
                        placeholder='Hex Color'
                        onChange={(color) => updateSetting({ color })}
                    />
                </div>

                <div className='conditions'>
                    <h4>Conditions <span>{setting.conditions.length}</span></h4>
                    {setting.conditions.map((condition, conditionIndex) => (
                        <VisualizationCondition
                            key={conditionIndex}
                            condition={condition}
                            conditionIndex={conditionIndex}
                            layers={layers}
                            onChange={(nextCondition) => replaceCondition(conditionIndex, nextCondition)}
                            onDelete={() => deleteCondition(conditionIndex)}
                        />
                    ))}
                </div>
            </div>

            <div className='setting-actions'>
                <div>
                    <Button className='add-condition-btn' onClick={addCondition}>
                        <i className='fa-solid fa-plus' aria-hidden='true'></i>
                        Add condition
                    </Button>
                    <Button
                        className='delete-setting-btn danger-btn icon-btn'
                        aria-label='Delete visualization'
                        title='Delete visualization'
                        onClick={deleteSetting}
                    >
                        <i className='fa-solid fa-trash' aria-hidden='true'></i>
                    </Button>
                    <Button
                        className='up-setting-btn icon-btn'
                        aria-label='Move visualization up'
                        title='Move up'
                        onClick={() => moveSetting('up')}
                        disabled={!canMoveUp}
                    >
                        <i className='fa-solid fa-arrow-up' aria-hidden='true'></i>
                    </Button>
                    <Button
                        className='down-setting-btn icon-btn'
                        aria-label='Move visualization down'
                        title='Move down'
                        onClick={() => moveSetting('down')}
                        disabled={!canMoveDown}
                    >
                        <i className='fa-solid fa-arrow-down' aria-hidden='true'></i>
                    </Button>
                </div>
            </div>
        </div>
    );
}
