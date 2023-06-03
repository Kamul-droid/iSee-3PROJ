import { Field } from 'formik';
import React from 'react';
import { TReactChildren } from '../types/TReactChildren';

export default function LabelledSelectComponent(props: {
  name: string;
  label?: string;
  children: TReactChildren;
  className?: string;
  hideLabel?: boolean;
}) {
  const { name, children, hideLabel, className } = props;

  const label = props.label ?? name;
  return (
    <div className={`flex flex-col ${className}`}>
      {hideLabel !== true && (
        <label htmlFor={name} className="text-sm text-gray-500">
          {label}
        </label>
      )}
      <Field as="select" id={name} name={name} className="border border-slate-200 border-solid rounded-xl p-2 my-1">
        {children}
      </Field>
    </div>
  );
}
