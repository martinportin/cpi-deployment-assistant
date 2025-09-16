import { InputDomRef, Ui5CustomEvent, Bar } from '@ui5/webcomponents-react';
import Input from './Input';
import BarDesign from '@ui5/webcomponents/dist/types/BarDesign';
import Checkbox from './Checkbox';
import { MouseEventHandler } from 'react';

export default function TopToolbar({
  slot,
  design,
  filterInputValue,
  isDeployedArtifactsCheckboxChecked,
  isUndeployedArtifactsCheckboxChecked,
  handleFilterInputChange,
  handleDeployedCheckboxClick,
  handleUnDeployedCheckboxClick
}: Readonly<{
  slot?: string;
  design: BarDesign;
  filterInputValue: string;
  isDeployedArtifactsCheckboxChecked: boolean;
  isUndeployedArtifactsCheckboxChecked: boolean;
  handleFilterInputChange: (event: Ui5CustomEvent<InputDomRef, never>) => void;
  handleDeployedCheckboxClick: MouseEventHandler<HTMLElement>;
  handleUnDeployedCheckboxClick: MouseEventHandler<HTMLElement>;
}>) {
  return (
    <Bar
      slot={slot}
      design={design}
      endContent={
        <>
          <Input
            id="filterInput"
            labelText="Search"
            placeHolder=""
            filterInputValue={filterInputValue}
            handleInput={handleFilterInputChange}
          />
          <Checkbox
            id="deployCheckbox"
            labelText="Deployed"
            isChecked={isDeployedArtifactsCheckboxChecked}
            handleClick={handleDeployedCheckboxClick}
          />
          <Checkbox
            id="undeployCheckbox"
            labelText="Undeployed"
            isChecked={isUndeployedArtifactsCheckboxChecked}
            handleClick={handleUnDeployedCheckboxClick}
          />
        </>
      }
    ></Bar>
  );
}
