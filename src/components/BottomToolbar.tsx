import {
  Bar,
  ButtonDomRef,
  Switch,
  Ui5CustomEvent
} from '@ui5/webcomponents-react';
import ToolbarButton from './ToolbarButton';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign';
import { ButtonClickEventDetail } from '@ui5/webcomponents/dist/Button';
import BarDesign from '@ui5/webcomponents/dist/types/BarDesign';

export default function BottomToolbar({
  slot,
  design,
  isButtonsDisabled,
  handleLoadArtifactsButtonClick,
  handleDeployArtifactsButtonClick,
  handleUndeployArtifactsButtonClick
}: Readonly<{
  slot?: string;
  design: BarDesign;
  isButtonsDisabled: boolean;
  handleLoadArtifactsButtonClick: (
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) => void;
  handleDeployArtifactsButtonClick: (
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) => void;
  handleUndeployArtifactsButtonClick: (
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) => void;
}>) {
  return (
    <Bar
      slot={slot}
      design={design}
      startContent={
        <>
          <ToolbarButton
            id="loadArtifactsButton"
            disabled={isButtonsDisabled}
            handleClick={handleLoadArtifactsButtonClick}
            text="Load artifacts"
          />
        </>
      }
      endContent={
        <>
          <ToolbarButton
            id="deployArtifactsButton"
            disabled={isButtonsDisabled}
            design={ButtonDesign.Emphasized}
            handleClick={handleDeployArtifactsButtonClick}
            text="Deploy artifacts"
          />
          <ToolbarButton
            id="undeployArtifactsButton"
            disabled={isButtonsDisabled}
            design={ButtonDesign.Emphasized}
            handleClick={handleUndeployArtifactsButtonClick}
            text="Undeploy artifacts"
          />
        </>
      }
    ></Bar>
  );
}
