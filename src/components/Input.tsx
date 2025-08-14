import {
  Input as UI5Input,
  InputDomRef,
  Ui5CustomEvent
} from '@ui5/webcomponents-react';

export default function Input({
  id,
  placeHolder,
  handleInput
}: {
  id: string;
  placeHolder: string;
  handleInput: (event: Ui5CustomEvent<InputDomRef, never>) => void;
}) {
  return <UI5Input id={id} placeholder={placeHolder} onInput={handleInput} />;
}
