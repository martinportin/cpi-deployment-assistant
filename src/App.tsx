import './App.css';
import { Button, Title } from '@ui5/webcomponents-react';
import Toolbar from './components/Toolbar';

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

  return (
    <>
      <Toolbar />
    </>
  );
}
