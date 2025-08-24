import { Button, Ui5CustomEvent, ButtonDomRef } from '@ui5/webcomponents-react';
import { ButtonClickEventDetail } from '@ui5/webcomponents/dist/Button';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign';

export default function ToolbarButton({
  id,
  slot,
  disabled,
  design,
  icon,
  text,
  handleClick
}: {
  id: string;
  slot?: string;
  disabled: boolean;
  design?: ButtonDesign;
  icon?: string;
  text: string;
  handleClick: (
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) => void;
}) {
  return (
    <Button
      id={id}
      slot={slot}
      disabled={disabled}
      design={design}
      icon={icon}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
}
