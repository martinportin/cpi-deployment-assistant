import {
  InputDomRef,
  ToolbarSpacer,
  Ui5CustomEvent,
  Toolbar as UI5Toolbar
} from '@ui5/webcomponents-react';
import Input from './Input';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign';
import ToolbarButton from './ToolbarButton';

export default function Toolbar() {
  function handleClick() {
    console.log('Click!');
  }

  function handleInput(event: Ui5CustomEvent<InputDomRef, never>) {
    const value = event;
    console.log(value);
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
      <Input id="filterInput" placeHolder="" handleInput={handleInput} />
      <ToolbarButton
        id="filterArtifactsButton"
        disabled={false}
        handleClick={handleClick}
        text="Filter artifacts"
      />
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
