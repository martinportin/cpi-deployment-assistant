import './App.css';
import Table from './components/Table';
import {
  ButtonDomRef,
  InputDomRef,
  Page,
  Ui5CustomEvent
} from '@ui5/webcomponents-react';
import { MouseEvent, useState } from 'react';
import { sendMessage } from './utils/Message';
import { Artifact } from './custom';
import BottomToolbar from './components/BottomToolbar';
import TopToolbar from './components/TopToolbar';
import { ButtonClickEventDetail } from '@ui5/webcomponents/dist/Button';
import BarDesign from '@ui5/webcomponents/dist/types/BarDesign';

export default function App() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filterInputValue, setFilterInputValue] = useState('');
  const [
    isDeployedArtifactsCheckboxChecked,
    setIsDeployedArtifactsCheckboxChecked
  ] = useState(true);
  const [
    isUndeployedArtifactsCheckboxChecked,
    setIsUndeployedArtifactsCheckboxChecked
  ] = useState(true);

  async function handleLoadArtifactsButtonClick(
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) {
    try {
      const response = await sendMessage('get artifacts');
      setArtifacts(response);
    } catch (reason) {
      console.log(reason);
    }
  }

  function handleFilterInputChange(event: Ui5CustomEvent<InputDomRef, never>) {
    setFilterInputValue(event.target.value);
  }

  function handleCheckBoxClick(event: MouseEvent<HTMLElement>) {
    const checkboxId = event.currentTarget.id;
    switch (checkboxId) {
      case 'deployCheckbox':
        setIsDeployedArtifactsCheckboxChecked(
          !isDeployedArtifactsCheckboxChecked
        );
        break;
      case 'undeployCheckbox':
        setIsUndeployedArtifactsCheckboxChecked(
          !isUndeployedArtifactsCheckboxChecked
        );
        break;
    }
  }

  function filterArtifacts(): Artifact[] {
    return artifacts.filter(
      (artifact) =>
        artifact.displayName.includes(filterInputValue) &&
        ((artifact.deployStatus === 'DEPLOYED' &&
          isDeployedArtifactsCheckboxChecked) ||
          (artifact.deployStatus === 'UNDEPLOYED' &&
            isUndeployedArtifactsCheckboxChecked))
    );
  }

  const headers = ['Artifact name', 'Deploy Status'];

  function handleOnClick() {
    console.log('click');
  }

  return (
    <Page
      backgroundDesign="List"
      header={
        <TopToolbar
          design={BarDesign.Header}
          filterInputValue={filterInputValue}
          isDeployedArtifactsCheckboxChecked={
            isDeployedArtifactsCheckboxChecked
          }
          isUndeployedArtifactsCheckboxChecked={
            isUndeployedArtifactsCheckboxChecked
          }
          handleFilterInputChange={handleFilterInputChange}
          handleDeployedCheckboxClick={handleCheckBoxClick}
          handleUnDeployedCheckboxClick={handleCheckBoxClick}
        />
      }
      footer={
        <BottomToolbar
          design={BarDesign.Footer}
          handleLoadArtifactsButtonClick={handleLoadArtifactsButtonClick}
          handleDeployArtifactsButtonClick={handleOnClick}
          handleUndeployArtifactsButtonClick={handleOnClick}
        />
      }
      style={{ height: '500px' }}
    >
      <Table headers={headers} artifacts={filterArtifacts()} />
    </Page>
  );
}
