import { Field } from 'formik';
import React from 'react';

export default function LabelledTextAreaComponent(props: {
  name: string;
  placeholder: string;
  label?: string;
  type?: string;
  className?: string;
  hideLabel?: boolean;
}) {
  const { name, placeholder, hideLabel, className } = props;
  const label = props.label ?? name;
  const type = props.type ?? 'text';

  return (
    <div className={`flex flex-col ${className}`}>
      {hideLabel !== true && (
        <label htmlFor={name} className="text-sm text-gray-500">
          {label}
        </label>
      )}
      <Field
        as="textarea"
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="border border-slate-200 border-solid rounded-xl p-2 my-1"
      />
    </div>
  );
}
