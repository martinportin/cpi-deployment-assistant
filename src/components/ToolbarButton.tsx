import {
  ToolbarButton as UI5ToolbarButton,
  Ui5CustomEvent,
  ToolbarButtonDomRef
} from '@ui5/webcomponents-react';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign';

export default function ToolbarButton({
  id,
  disabled,
  design,
  icon,
  handleClick,
  text
}: {
  id: string;
  disabled: boolean;
  design?: ButtonDesign;
  icon?: string;
  handleClick: (event: Ui5CustomEvent<ToolbarButtonDomRef, never>) => void;
  text: string;
}) {
  return (
    <UI5ToolbarButton
      id={id}
      disabled={disabled}
      design={design}
      icon={icon}
      text={text}
      onClick={handleClick}
    />
  );
}
