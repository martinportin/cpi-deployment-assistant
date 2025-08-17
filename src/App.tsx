import './App.css';
import Toolbar from './components/Toolbar';
import Table from './components/Table';
import { Artifact } from './components/custom';
import {
  InputDomRef,
  ToolbarButtonDomRef,
  Ui5CustomEvent
} from '@ui5/webcomponents-react';
import { Dispatch, SetStateAction, useState } from 'react';

export default function App() {
  async function sendMessage() {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    if (tab.id) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        subject: 'world'
      });
      console.log(response.response);
    }
  }

  const [artifacts, setArtifacts]: [
    Artifact[],
    Dispatch<SetStateAction<Artifact[]>>
  ] = useState([
    {
      regId: '1',
      displayName: 'Artifact 1',
      name: 'Artifact_1',
      deployStatus: 'Deployed',
      packageRegId: '10'
    },
    {
      regId: '2',
      displayName: 'Artifact 2',
      name: 'Artifact_2',
      deployStatus: 'Undeployed',
      packageRegId: '20'
    },
    {
      regId: '3',
      displayName: 'Artifact 3',
      name: 'Artifact_3',
      deployStatus: 'Deployed',
      packageRegId: '30'
    }
  ]);
  const [filterInputValue, setFilterInputValue] = useState('');

  function handleFilterInputChange(event: Ui5CustomEvent<InputDomRef, never>) {
    setFilterInputValue(event.target.value);
  }

  function filterArtifacts(): Artifact[] {
    return artifacts.filter((artifact) =>
      artifact.displayName.includes(filterInputValue)
    );
  }

  const headers = ['Artifact name', 'Deploy Status'];

  return (
    <>
      <Toolbar
        filterInputValue={filterInputValue}
        handleFilterInputChange={handleFilterInputChange}
      />
      <Table headers={headers} artifacts={filterArtifacts()} />
    </>
  );
}
