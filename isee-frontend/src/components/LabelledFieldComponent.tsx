import { Field } from 'formik';
import React from 'react';

export default function LabelledFieldComponent(props: {
  name: string;
  placeholder: string;
  label?: string;
  type?: string;
}) {
  const { name, placeholder } = props;

  const label = props.label ?? name;
  const type = props.type ?? 'text';

  return (
    <>
      <label htmlFor={name} className="text-sm text-gray-500">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-8 border border-slate-200 border-solid rounded-xl px-2 py-5 my-1"
      />
    </>
  );
}
