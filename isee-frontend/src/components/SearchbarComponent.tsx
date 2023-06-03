import React from 'react';

export function SearchBar(props: { handleSubmit: (e: any) => void; className: string }) {
  const { handleSubmit, className } = props;

  return (
    <div className={className}>
      <form className="flex h-full w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          id="search-input"
          className="flex-grow shrink min-w-0 mx-2 px-2 rounded-full"
        />
        <button type="submit" className="bg-white px-3 rounded-full hover:bg-slate-50 shadow-sm">
          search
        </button>
      </form>
    </div>
  );
}
