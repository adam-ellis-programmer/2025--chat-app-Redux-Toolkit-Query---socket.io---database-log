import React from 'react'

const FormTextInput = ({
  i,
  type,
  placeholder,
  className,
  defaultValue,
  id,
  onChange,
  value,
  name, 
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      name={name}
      className={className}
      // defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    />
  )
}

export default FormTextInput
