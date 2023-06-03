import React from 'react';

export default function ButtonComponent(props: {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'slate' | 'gray' | 'purple' | 'indigo' | 'cyan' | 'teal' | 'light';
  text: string;
  onClick?: () => any;
  disabled?: boolean;
}) {
  const { className, text, onClick } = props;
  const type = props.type ?? 'button';
  const disabled = props.disabled ?? false;

  const color =
    props.color === 'blue'
      ? 'text-white bg-blue-600 hover:bg-blue-500'
      : props.color === 'red'
      ? 'text-white bg-red-600 hover:bg-red-500'
      : props.color === 'green'
      ? 'text-white bg-green-600 hover:bg-green-500'
      : props.color === 'yellow'
      ? 'text-white bg-yellow-600 hover:bg-yellow-500'
      : props.color === 'slate'
      ? 'text-white bg-slate-600 hover:bg-slate-500'
      : props.color === 'purple'
      ? 'text-white bg-purple-600 hover:bg-purple-500'
      : props.color === 'indigo'
      ? 'text-white bg-indigo-600 hover:bg-indigo-500'
      : props.color === 'cyan'
      ? 'text-white bg-cyan-600 hover:bg-cyan-500'
      : props.color === 'gray'
      ? 'text-white bg-gray-600 hover:bg-gray-500'
      : props.color === 'teal'
      ? 'text-white bg-teal-600 hover:bg-teal-500'
      : props.color === 'light'
      ? 'text-black border border-slate-300 bg-white hover:bg-slate-100'
      : 'text-white bg-blue-600 hover:bg-blue-500';

  return (
    <button
      type={type}
      className={`p-2 rounded-lg my-2 disabled:bg-slate-200 disabled:text-gray-600 ${color} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
