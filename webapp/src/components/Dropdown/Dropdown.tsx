import React from 'react'
import styles from './dropdown.module.scss'
import Select, { OptionsOrGroups } from 'react-select'

import { Paragraph } from '../Paragraph'

interface DropdownProps {
  options: {
    value: string | number,
    label: string,
    isDisabled?: boolean
  }[];
  defaultValue?: DropdownProps['options'][0];
  onChange: (value: { value: string, label: string }) => void
  label?: string
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onChange, defaultValue }) => (
  <Select
    closeMenuOnSelect={false}
    placeholder={<Paragraph as="label">{label}</Paragraph>}
    // defaultInputValue={defaultInputValue}
    defaultValue={defaultValue}
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
        minWidth: '235px',
      }),
      control: (base) => ({ ...base, outline: 'none' }),
      menu: (base) => ({ ...base, zIndex: 9999 }),
    }}
  />
)

Dropdown.defaultProps = {
  options: [],
  onChange: () => { },
}

export default Dropdown
