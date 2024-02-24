import React from 'react'
import styles from './dropdown.module.scss'
import Select from 'react-select'

import Paragraph from '../Paragraph'

export interface DropdownProps {
  options: {
    value: string | number,
    label: string,
    isDisabled?: boolean
  }[];
  defaultValue?: DropdownProps['options'][0];
  value?: DropdownProps['options'][0];
  onChange: (value: { value: string, label: string }) => void
  label?: string
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onChange, defaultValue, value }) => (
  <Select
    closeMenuOnSelect={false}
    placeholder={<Paragraph as="label">{label}</Paragraph>}
    isDisabled={options.length <= 1}
    defaultValue={defaultValue}
    value={value}
    classNames={{
      control: () => styles.control,
      valueContainer: () => styles.valueContainer,
      menuList: () => styles.menuList,
      singleValue: () => styles.singleValue,
      input: () => styles.searchInput,
      option: () => styles.option,
    }}
    blurInputOnSelect
    components={{
      NoOptionsMessage: ({ children }) => (
        <Paragraph className="text-center p-2">{children}</Paragraph>
      ),
    }}
    onChange={(value) => onChange(value as { value: string; label: string })}
    options={options}
    styles={{
      container: (base) => ({
        ...base,
        display: 'inline-block',
        width: '235px',
        zIndex: 9999,
      }),
      control: (base) => ({ ...base, outline: 'none' }),
    }}
  />
)

Dropdown.defaultProps = {
  options: [],
  onChange: () => { },
}

export default Dropdown
