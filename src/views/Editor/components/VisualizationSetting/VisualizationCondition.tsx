import Input from '../../../../components/Input/Input';
import IconButton from '../../../../components/IconButton/IconButton';
import { VisualizationConditionalOperatorEnum } from '../../../../ts/enums/VisualizationConditionalOperatorEnum';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import { IVisualizationCondition } from '../../../../ts/interfaces/visualization/IVisualizationCondition';
import './VisualizationCondition.scss';

type Props = {
    condition: IVisualizationCondition;
    conditionIndex: number;
    layers: ILayer[];
    onChange: (condition: IVisualizationCondition) => void;
    onDelete: () => void;
};

export default function VisualizationCondition({
    condition,
    conditionIndex,
    layers,
    onChange,
    onDelete,
}: Props) {
    function updateCondition(changes: Partial<IVisualizationCondition>) {
        onChange({ ...condition, ...changes });
    }

    return (
        <div className='condition'>
            {conditionIndex > 0 && (
                <Input
                    label='Operator'
                    className='condition-operator'
                    type='select'
                    value={condition.condOperator?.toString()}
                    onChange={(value) => updateCondition({
                        condOperator: value as VisualizationConditionalOperatorEnum,
                    })}
                    options={Object.values(VisualizationConditionalOperatorEnum).map((operator) => ({
                        label: operator,
                        value: operator,
                    }))}
                />
            )}

            <Input
                label='Select Layer'
                className='condition-field'
                type='select'
                value={condition.layerId}
                onChange={(value) => updateCondition({ layerId: Number(value) })}
                options={layers.map((layer) => ({ label: layer.name, value: layer.id }))}
            />

            <div className='condition-range'>
                <Input
                    label='Min Value'
                    className='min-input'
                    type='number'
                    value={condition.min}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateCondition({ min: value })}
                />
                <span className='condition-separator'>-</span>
                <Input
                    label='Max Value'
                    className='max-input'
                    type='number'
                    value={condition.max}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => updateCondition({ max: value })}
                />
            </div>

            <div className='inclusive-options'>
                <InclusiveCheckbox
                    label='Min inclusive'
                    checked={condition.minInclusive}
                    onChange={(checked) => updateCondition({ minInclusive: checked })}
                />
                <InclusiveCheckbox
                    label='Max inclusive'
                    checked={condition.maxInclusive}
                    onChange={(checked) => updateCondition({ maxInclusive: checked })}
                />
            </div>

            <div className='condition-actions'>
                <IconButton
                    icon='fa-trash'
                    label='Delete condition'
                    className='delete-condition-btn danger-btn icon-btn'
                    onClick={onDelete}
                />
            </div>
        </div>
    );
}

type InclusiveCheckboxProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function InclusiveCheckbox({ label, checked, onChange }: InclusiveCheckboxProps) {
    return (
        <label className='check-field'>
            <input
                type='checkbox'
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            <span><i className='fa-solid fa-check' aria-hidden='true'></i></span>
            {label}
        </label>
    );
}
