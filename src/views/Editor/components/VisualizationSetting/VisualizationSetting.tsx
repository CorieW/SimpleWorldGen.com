import Input from '../../../../components/Input/Input';
import ColorField from '../../../../components/Input/ColorField';
import IconButton from '../../../../components/IconButton/IconButton';
import { ScalingTypeEnum } from '../../../../ts/enums/ScalingTypeEnum';
import { VisualizationTypeEnum } from '../../../../ts/enums/VisualizationTypeEnum';
import { IVisualizationCondition } from '../../../../ts/interfaces/visualization/IVisualizationCondition';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import Shapes from '../../../../ts/utils/Shapes';
import enumOptions from '../../../../ts/utils/enumOptions';
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
                    options={enumOptions(VisualizationTypeEnum)}
                />

                {Shapes.getShape(setting.type).canScale && (
                    <Input
                        label='Scaling Type'
                        className='scaling-type-input'
                        type='select'
                        value={setting.scalingType}
                        onChange={(value) => updateSetting({ scalingType: value as ScalingTypeEnum })}
                        options={enumOptions(ScalingTypeEnum)}
                    />
                )}

                <ColorField color={setting.color} onChange={(color) => updateSetting({ color })} />

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
                    <button type='button' className='ui-button add-condition-btn' onClick={addCondition}>
                        <i className='fa-solid fa-plus' aria-hidden='true'></i>
                        Add condition
                    </button>
                    <IconButton
                        icon='fa-trash'
                        label='Delete visualization'
                        className='delete-setting-btn danger-btn'
                        onClick={deleteSetting}
                    />
                    <IconButton
                        icon='fa-arrow-up'
                        label='Move visualization up'
                        className='up-setting-btn'
                        onClick={() => moveSetting('up')}
                        disabled={!canMoveUp}
                    />
                    <IconButton
                        icon='fa-arrow-down'
                        label='Move visualization down'
                        className='down-setting-btn'
                        onClick={() => moveSetting('down')}
                        disabled={!canMoveDown}
                    />
                </div>
            </div>
        </div>
    );
}
