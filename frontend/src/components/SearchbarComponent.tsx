import React from 'react';
import ButtonComponent from './ButtonComponent';
import { MdSearch } from 'react-icons/md';

export function SearchBar(props: { handleSubmit: (e: any) => void; className: string }) {
  const { handleSubmit, className } = props;

  return (
    <div className={className}>
      <form className="flex h-full w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          id="search-input"
          className="flex-grow shrink min-w-0 mx-2 px-3 py-1 rounded-full"
        />
        <ButtonComponent color="light" type="submit" className="rounded-full px-2 mr-2" restyle>
          <MdSearch size={25} color="#555" />
        </ButtonComponent>
      </form>
    </div>
  );
}
