import React, { useContext } from 'react';
import { DisplayTypeContext } from '../App';
import ButtonComponent from './ButtonComponent';
import { EDisplayType } from '../enums/EDisplayType';

export default function DisplaySwitcherComponent() {
  const { setDisplayType, displayType } = useContext(DisplayTypeContext);

  return (
    <>
      <ButtonComponent
        text="Grid display"
        color="light"
        onClick={() => setDisplayType(EDisplayType.GRID)}
        disabled={displayType === EDisplayType.GRID}
        className="mr-2"
      />
      <ButtonComponent
        text="List display"
        color="light"
        onClick={() => setDisplayType(EDisplayType.LIST)}
        disabled={displayType === EDisplayType.LIST}
      />
    </>
  );
}
