import React, { useContext } from 'react';
import { DisplayTypeContext } from '../App';
import ButtonComponent from './ButtonComponent';
import { EDisplayType } from '../enums/EDisplayType';
import { MdViewList, MdViewModule } from 'react-icons/md';
import TooltipComponent from './TooltipComponent';

export default function DisplaySwitcherComponent() {
  const { setDisplayType, displayType } = useContext(DisplayTypeContext);

  return (
    <div className="flex">
      <TooltipComponent text="Grid display">
        <ButtonComponent
          color="light"
          onClick={() => setDisplayType(EDisplayType.GRID)}
          disabled={displayType === EDisplayType.GRID}
          restyle
          className="pr-2 pl-3 py-2 rounded-l-full"
        >
          <MdViewModule size={20} />
        </ButtonComponent>
      </TooltipComponent>
      <TooltipComponent text="List display">
        <ButtonComponent
          color="light"
          onClick={() => setDisplayType(EDisplayType.LIST)}
          disabled={displayType === EDisplayType.LIST}
          restyle
          className="pr-3 pl-2 py-2  rounded-r-full"
        >
          <MdViewList size={20} />
        </ButtonComponent>
      </TooltipComponent>
    </div>
  );
}
