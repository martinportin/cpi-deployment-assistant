import {
  Input as UI5Input,
  InputDomRef,
  Ui5CustomEvent,
  Label
} from '@ui5/webcomponents-react';

export default function Input({
  id,
  slot,
  labelText,
  placeHolder,
  filterInputValue,
  handleInput
}: Readonly<{
  id: string;
  slot?: string;
  labelText: string;
  placeHolder: string;
  filterInputValue: string;
  handleInput: (event: Ui5CustomEvent<InputDomRef, never>) => void;
}>) {
  return (
    <>
      <Label slot={slot} for={id}>
        {labelText}:
      </Label>
      <UI5Input
        id={id}
        slot={slot}
        placeholder={placeHolder}
        value={filterInputValue}
        onInput={handleInput}
      />
    </>
  );
}
