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
  const [selectedRowsKeys, setSelectedRowsKeys] = useState('');
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
  const [showBusyIndicator, setShowBusyIndicator] = useState(false);
  const [showDeploymentSuccessToast, setShowDeploymentSuccessToast] =
    useState(false);
  const [showUndeploymentSuccessToast, setShowUndeploymentSuccessToast] =
    useState(false);
  const [showSelectArtifactsMessageBox, setShowSelectArtifactsMessageBox] =
    useState(false);

  async function handleLoadArtifactsButtonClick(
    event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>
  ) {
    try {
      setIsButtonsDisabled(true);
      setShowBusyIndicator(true);
      const response = await sendMessage('get artifacts');
      setArtifacts(response);
    } catch (reason) {
      console.log(
        reason ===
          'Error: Could not establish connection. Receiving end does not exist.'
      );
      console.log(reason);
    } finally {
      setShowBusyIndicator(false);
      setIsButtonsDisabled(false);
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

  function handleTableSelectionChange(
    event: Ui5CustomEvent<TableSelectionMultiDomRef, never>
  ) {
    const selectedRowsKeys = event.target.selected;
    setSelectedRowsKeys(selectedRowsKeys);
  }

  async function handleDeployArtifactsButtonClick() {
    const selectedArtifacts = getSelectedArtifacts(artifacts);
    if (selectedArtifacts.length) {
      await deployArtifacts(artifacts);
    } else {
      showMessageBox();
    }
  }

  function getSelectedArtifacts(artifacts: Artifact[]): Artifact[] {
    return artifacts.filter((artifact) =>
      selectedRowsKeys.split(' ').some((key) => artifact.regId === key)
    );
  }

  async function deployArtifacts(artifacts: Artifact[]): Promise<void> {
    try {
      setIsButtonsDisabled(true);
      setShowBusyIndicator(true);
      const failedArtifacts = await sendMessage('deploy artifacts', artifacts);
      if (!failedArtifacts.length) {
        setShowDeploymentSuccessToast(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowBusyIndicator(false);
      setIsButtonsDisabled(false);
    }
  }

  function showMessageBox(): void {
    setShowSelectArtifactsMessageBox(true);
  }

  function handleMessageBoxClose(): void {
    setShowSelectArtifactsMessageBox(false);
  }

  function handleDeploymentSuccessToastClose() {
    setShowDeploymentSuccessToast(false);
  }

  async function handleUndeployArtifactsButtonClick() {
    const selectedArtifacts = getSelectedArtifacts(artifacts);
    if (selectedArtifacts.length) {
      await undeployArtifacts(selectedArtifacts);
    } else {
      showMessageBox();
    }
  }

  async function undeployArtifacts(artifacts: Artifact[]): Promise<void> {
    try {
      setIsButtonsDisabled(true);
      setShowBusyIndicator(true);
      const failedArtifacts = await sendMessage(
        'undeploy artifatcs',
        artifacts
      );
      if (!failedArtifacts.length) {
        setShowUndeploymentSuccessToast(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowBusyIndicator(false);
      setIsButtonsDisabled(false);
    }
  }

  function handleUndeploymentSuccessToastClose() {
    setShowUndeploymentSuccessToast(false);
  }

  function filterArtifacts(): Artifact[] {
    const undeployedDeployedStatus: DeploymentStatus[] = [
      'DEPLOYING',
      'UNDEPLOYING',
      'UNDEPLOYED',
      'STORED',
      'DELETED'
    ];
    return artifacts.filter(
      (artifact) =>
        artifact.displayName
          .toUpperCase()
          .includes(filterInputValue.toUpperCase()) &&
        ((artifact.deployStatus === 'DEPLOYED' &&
          isDeployedArtifactsCheckboxChecked) ||
          (undeployedDeployedStatus.includes(artifact.deployStatus) &&
            isUndeployedArtifactsCheckboxChecked))
    );
  }

  const headers = ['Artifact name', 'Type', 'Deployment Status', 'Status'];

  return (
    <Page
      backgroundDesign="List"
      style={{ height: '500px' }}
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
          handleUndeployArtifactsButtonClick={
            handleUndeployArtifactsButtonClick
          }
        />
      }
    >
      <BusyIndicator
        active={showBusyIndicator}
        size="L"
        style={{ display: 'block' }}
      >
        <Table
          headers={headers}
          artifacts={filterArtifacts()}
          handleSelectionChange={handleTableSelectionChange}
        />
      </BusyIndicator>
      <MessageBox
        open={showSelectArtifactsMessageBox}
        type="Error"
        actions={[MessageBoxAction.OK]}
        onClose={handleMessageBoxClose}
      >
        Select artifacts to deploy or undeploy.
      </MessageBox>
      <Toast
        open={showDeploymentSuccessToast || showUndeploymentSuccessToast}
        onClose={
          showDeploymentSuccessToast
            ? handleDeploymentSuccessToastClose
            : handleUndeploymentSuccessToastClose
        }
      >
        {showDeploymentSuccessToast
          ? 'All selected artifacts have been triggered for deployment!'
          : 'All selected artifacts have been triggered for undeployment!'}
      </Toast>
    </Page>
  );
}
