import './App.css';
import Table from './components/Table';
import {
  ButtonDomRef,
  InputDomRef,
  Page,
  TableSelectionMultiDomRef,
  Toast,
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
  const [selectedRowsKeys, setSelectedRowsKeys] = useState('')
  const [showDeploymentSuccessToast, setShowDeploymentSuccessToast] = useState(false)

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

  function handleCheckboxClick(event: MouseEvent<HTMLElement>) {
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

  function handleTableSelectionChange(event: Ui5CustomEvent<TableSelectionMultiDomRef, never>) {
    const selectedRowsKeys = event.target.selected
    setSelectedRowsKeys(selectedRowsKeys)

  }

  async function handleDeployArtifactsButtonClick() {
    try {
      const selectedArtifacts = artifacts.filter((artifact) => selectedRowsKeys.split(' ').some((key) => artifact.regId === key))
      const failedArtifacts = await sendMessage('deploy artifacts', selectedArtifacts)
      if(!failedArtifacts.length) {
        setShowDeploymentSuccessToast(true)
      } 
    } catch (error) {
      console.log(error);
    }
  }

  function handleDeploymentSuccessToastClose() {
    setShowDeploymentSuccessToast(false)
  }

  async function handleUndeployArtifactsButtonClick() {
    try {
      const selectedArtifacts = artifacts.filter((artifact) => selectedRowsKeys.split(' ').some((key) => artifact.regId === key))
      const failedArtifacts = await sendMessage('undeploy artifatcs', selectedArtifacts)
      console.log(failedArtifacts);
    } catch (error) {
      console.log(error);
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

  const headers = ['Artifact name', 'Deployment Status'];

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
          handleDeployedCheckboxClick={handleCheckboxClick}
          handleUnDeployedCheckboxClick={handleCheckboxClick}
        />
      }
      footer={
        <BottomToolbar
          design={BarDesign.Footer}
          handleLoadArtifactsButtonClick={handleLoadArtifactsButtonClick}
          handleDeployArtifactsButtonClick={handleDeployArtifactsButtonClick}
          handleUndeployArtifactsButtonClick={handleUndeployArtifactsButtonClick}
        />
      }
      style={{ height: '500px' }}
    >
      <Table headers={headers} artifacts={filterArtifacts()} handleSelectionChange={handleTableSelectionChange}/>
      <Toast open={showDeploymentSuccessToast} onClose={handleDeploymentSuccessToastClose}>All selected artifacts have been triggered for deployment!</Toast>
    </Page>
  );
}
