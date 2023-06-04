import { Field, useFormikContext } from 'formik';
import React from 'react';
import { TReactChildren } from '../types/TReactChildren';
import { EVideoState } from '../enums/EVideoState';

export default function LabelledSelectComponent(props: {
  name: string;
  label?: string;
  children: TReactChildren;
  className?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  disabledOption?: string;
  onChange?: (e: any) => void;
}) {
  const { name, children, hideLabel, className, disabled, disabledOption, onChange } = props;

  const { setFieldValue } = useFormikContext();

  const handleChange = (e: any) => {
    setFieldValue(name, e.target.value);
    onChange?.(e);
  };

  const label = props.label ?? name;
  return (
    <div className={`flex flex-col ${className}`}>
      {hideLabel !== true && (
        <label htmlFor={name} className="text-sm text-gray-500">
          {label}
        </label>
      )}
      <Field
        as="select"
        id={name}
        name={name}
        onChange={handleChange}
        className="disabled:bg-slate-200 disabled:text-gray-600  border border-slate-200 border-solid rounded-xl p-2 my-1"
        disabled={disabled}
      >
        {disabled ? <option>{disabledOption}</option> : children}
      </Field>
    </div>
  );
}
