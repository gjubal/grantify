import React, { SelectHTMLAttributes } from 'react';
import { SelectBlock } from './styles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  isQuantityCounter?: boolean;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const ListSelect: React.FC<SelectProps> = ({
  name,
  label,
  isQuantityCounter = false,
  options,
  ...rest
}) => {
  return (
    <SelectBlock>
      <label htmlFor={name}>{label}</label>
      <select id={name} {...rest}>
        <option disabled hidden>
          {isQuantityCounter ? 'Quantity' : 'Select an option'}
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SelectBlock>
  );
};

export default ListSelect;
