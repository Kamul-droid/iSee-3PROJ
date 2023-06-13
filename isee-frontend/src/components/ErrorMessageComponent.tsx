import React from 'react';

export default function ErrorMessageComponent(props: {
  error?: string;
  errors?: any;
  touched?: any;
  classname?: string;
}) {
  const { error, errors, classname, touched } = props;
  return (
    <>
      {error ||
      (errors && Object.keys(errors).filter((key) => !touched || Object.keys(touched).includes(key)).length) ? (
        <div className={`p-2 my-2 rounded-lg bg-red-300 text-red-900 break-words w-full ${classname}`}>
          {error && <p>{error}</p>}
          {errors && (
            <ul className="list-inside list-disc">
              {Object.keys(errors)
                .filter((key) => !touched || Object.keys(touched).includes(key))
                .map((key, idx) => (
                  <li key={idx}>
                    {key}: {errors[key]}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ) : null}
    </>
  );
}
