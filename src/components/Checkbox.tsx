import { Label, CheckBox as UI5Checkbox } from '@ui5/webcomponents-react';
import { MouseEventHandler } from 'react';

export default function Checkbox({
  id,
  slot,
  labelText,
  isChecked,
  handleClick
}: Readonly<{
  id: string;
  slot?: string;
  labelText: string;
  isChecked: boolean;
  handleClick: MouseEventHandler<HTMLElement>;
}>) {
  return (
    <>
      <Label slot={slot} for={id}>
        {labelText}:
      </Label>
      <UI5Checkbox
        id={id}
        slot={slot}
        checked={isChecked}
        onClick={handleClick}
      />
    </>
  );
}
