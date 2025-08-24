import { Bar, ButtonDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react';
import ToolbarButton from './ToolbarButton';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign';
import { ButtonClickEventDetail } from '@ui5/webcomponents/dist/Button';
import BarDesign from '@ui5/webcomponents/dist/types/BarDesign';

export default function BottomToolbar({
  slot,
  design,
  handleLoadArtifactsButtonClick,
  handleDeployArtifactsButtonClick,
  handleUndeployArtifactsButtonClick
}: Readonly<{
  slot?: string;
  design: BarDesign;
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
        <ToolbarButton
          id="loadArtifactsButton"
          disabled={false}
          handleClick={handleLoadArtifactsButtonClick}
          text="Load artifacts"
        />
      }
      endContent={
        <>
          <ToolbarButton
            id="deployArtifactsButton"
            disabled={false}
            design={ButtonDesign.Emphasized}
            handleClick={handleDeployArtifactsButtonClick}
            text="Deploy artifacts"
          />
          <ToolbarButton
            id="undeployArtifactsButton"
            disabled={false}
            design={ButtonDesign.Emphasized}
            handleClick={handleUndeployArtifactsButtonClick}
            text="Undeploy artifacts"
          />
        </>
      }
    ></Bar>
  );
}
