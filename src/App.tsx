import './App.css';
import Toolbar from './components/Toolbar';
import Table from './components/Table';
import {
  InputDomRef,
  ToolbarButtonDomRef,
  Ui5CustomEvent
} from '@ui5/webcomponents-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { sendMessage } from './utils/Message';
import { Artifact } from './custom';

export default function App() {
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

  async function handleLoadArtifactsButtonClick(
    event: Ui5CustomEvent<ToolbarButtonDomRef, never>
  ) {
    try {
      console.log('!');
      const response = await sendMessage('get artifacts');
      setArtifacts(response);
    } catch (reason) {
      console.log(reason);
    }
  }

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
        handleLoadArtifactsButtonClick={handleLoadArtifactsButtonClick}
        handleFilterInputChange={handleFilterInputChange}
      />
      <Table headers={headers} artifacts={filterArtifacts()} />
    </>
  );
}
