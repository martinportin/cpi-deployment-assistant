import {
  InputDomRef,
  ToolbarSpacer,
  Ui5CustomEvent,
  Toolbar as UI5Toolbar
} from '@ui5/webcomponents-react';
import Input from './Input';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign';
import ToolbarButton from './ToolbarButton';

export default function Toolbar({
  filterInputValue,
  handleFilterInputChange
}: Readonly<{
  filterInputValue: string;
  handleFilterInputChange: (event: Ui5CustomEvent<InputDomRef, never>) => void;
}>) {
  function handleClick() {
    console.log('Click!');
  }

  return (
    <UI5Toolbar>
      <ToolbarButton
        id="loadArtifactsButton"
        disabled={false}
        handleClick={handleClick}
        text="Load artifacts"
      />
      <ToolbarSpacer />
      <Input
        id="filterInput"
        placeHolder=""
        filterInputValue={filterInputValue}
        handleInput={handleFilterInputChange}
      />
      <ToolbarSpacer />
      <ToolbarButton
        id="deployArtifactsButton"
        disabled={false}
        design={ButtonDesign.Emphasized}
        handleClick={handleClick}
        text="Deploy artifacts"
      />
      <ToolbarButton
        id="undeployArtifactsButton"
        disabled={false}
        design={ButtonDesign.Emphasized}
        handleClick={handleClick}
        text="Undeploy artifacts"
      />
    </UI5Toolbar>
  );
}
