import './App.css';
import Table from './components/Table';
import {
  BusyIndicator,
  ButtonDomRef,
  InputDomRef,
  MessageBox,
  MessageBoxAction,
  Page,
  TableSelectionMultiDomRef,
  Toast,
  Ui5CustomEvent
} from '@ui5/webcomponents-react';
import { MouseEvent, useState } from 'react';
import { sendMessage } from './utils/Message';
import { Artifact, DeploymentStatus } from './custom';
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
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
  const [showBusyIndicator, setShowBusyIndicator] = useState(false);
  const [showNoArtifactsSelectedMessageBox, setShowNoArtifactsSelectedMessageBox] = useState(false)
  const [showDeployConfirmationMessageBox, setShowDeployConfirmationMessageBox] = useState(false)
  const [showUndeployConfirmationMessageBox, setShowUndeployConfirmationMessageBox] = useState(false)
  const [showDeploymentSuccessToast, setShowDeploymentSuccessToast] = useState(false);
  const [showUndeploymentSuccessToast, setShowUndeploymentSuccessToast] = useState(false);

  async function handleLoadArtifactsButtonClick(
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) {
    try {
      setIsButtonsDisabled(true)
      setShowBusyIndicator(true)
      const response = await sendMessage('get artifacts');
      setArtifacts(response);
    } catch (reason) {
      console.log(reason);
    } finally {
      setShowBusyIndicator(false)
      setIsButtonsDisabled(false)
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
    if(selectedRowsKeys.length) {
      setShowDeployConfirmationMessageBox(true);
    } else {
      setShowNoArtifactsSelectedMessageBox(true);
    }
  }

  function handleDeployConfirmationMessageBoxClose(action: string | undefined, escPressed: boolean | undefined): void {
    if (action === 'OK') {
      deployArtifacts()
    }
    setShowDeployConfirmationMessageBox(false)
  }

  async function deployArtifacts(): Promise<void> {
    try {
      setIsButtonsDisabled(true)
      setShowBusyIndicator(true)
      const selectedArtifacts = getSelectedArtifacts(artifacts)
      const failedArtifacts = await sendMessage('deploy artifacts', selectedArtifacts)
      if(!failedArtifacts.length) {
        setShowDeploymentSuccessToast(true)
      } 
    } catch (error) {
      console.log(error);
    } finally {
      setShowBusyIndicator(false)
      setIsButtonsDisabled(false)
    }
  }

  function handleNoArtifactsSelectedMessageBoxClose() {
    setShowNoArtifactsSelectedMessageBox(false);
  }

  function getSelectedArtifacts(artifacts: Artifact[]): Artifact[] {
    return artifacts.filter((artifact) => selectedRowsKeys.split(' ').some((key) => artifact.regId === key))
  }

  function handleDeploymentSuccessToastClose() {
    setShowDeploymentSuccessToast(false)
  }

  async function handleUndeployArtifactsButtonClick() {
    if(selectedRowsKeys.length) {
      setShowUndeployConfirmationMessageBox(true)
    } else {
      setShowNoArtifactsSelectedMessageBox(true);
    }
  }

  function handleUndeployConfirmationMessageBoxClose(action: string | undefined, escPressed: boolean | undefined): void {
    if (action === 'OK') {
      undeployArtifacts()
    }
    setShowUndeployConfirmationMessageBox(false)
  }

  async function undeployArtifacts(): Promise<void> {
    try {
      setIsButtonsDisabled(true)
      setShowBusyIndicator(true)
      const selectedArtifacts = getSelectedArtifacts(artifacts)
      const failedArtifacts = await sendMessage('undeploy artifatcs', selectedArtifacts)
      if(!failedArtifacts.length) {
        setShowUndeploymentSuccessToast(true)
      } 
    } catch (error) {
      console.log(error);
    } finally {
      setShowBusyIndicator(false)
      setIsButtonsDisabled(false)
    }
  }

  function handleUndeploymentSuccessToastClose() {
    setShowUndeploymentSuccessToast(false)
  }

  function filterArtifacts(): Artifact[] {
    const undeployedDeployedStatus: DeploymentStatus[] = ['DEPLOYING', 'UNDEPLOYING', 'UNDEPLOYED', 'STORED', 'DELETED']
    return artifacts.filter(
      (artifact) =>
        artifact.displayName.toUpperCase().includes(filterInputValue.toUpperCase()) &&
        ((artifact.deployStatus === 'DEPLOYED' &&
          isDeployedArtifactsCheckboxChecked) ||
          (undeployedDeployedStatus.includes(artifact.deployStatus) &&
            isUndeployedArtifactsCheckboxChecked))
    );
  }

  const headers = ['Artifact name', 'Deployment Status', 'Status'];

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
          isButtonsDisabled={isButtonsDisabled}
          handleLoadArtifactsButtonClick={handleLoadArtifactsButtonClick}
          handleDeployArtifactsButtonClick={handleDeployArtifactsButtonClick}
          handleUndeployArtifactsButtonClick={handleUndeployArtifactsButtonClick}
        />
      }
      style={{ height: '500px' }}
    >
      <BusyIndicator active={showBusyIndicator} size='L' style={ { display: 'block'}}>
        <Table headers={headers} artifacts={filterArtifacts()} handleSelectionChange={handleTableSelectionChange}/>
      </BusyIndicator>
      <MessageBox type='Information' open={showNoArtifactsSelectedMessageBox} actions={[MessageBoxAction.OK]} onClose={handleNoArtifactsSelectedMessageBoxClose}>Select artifacts to deploy or undeploy.</MessageBox>
      <MessageBox open={showDeployConfirmationMessageBox} actions={[MessageBoxAction.OK, MessageBoxAction.Cancel]} onClose={handleDeployConfirmationMessageBoxClose}>Selected artifacts will be deployed. Press OK to continue.</MessageBox>
      <MessageBox open={showUndeployConfirmationMessageBox} actions={[MessageBoxAction.OK, MessageBoxAction.Cancel]} onClose={handleUndeployConfirmationMessageBoxClose}>Selected artifacts will be undeployed. Press OK to continue.</MessageBox>
      <Toast open={showDeploymentSuccessToast} onClose={handleDeploymentSuccessToastClose}>All selected artifacts have been triggered for deployment!</Toast>
      <Toast open={showUndeploymentSuccessToast} onClose={handleUndeploymentSuccessToastClose}>All selected artifacts have been triggered for undeployment!</Toast>
    </Page>
  );
}
