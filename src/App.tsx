import './App.css';
import { Button } from '@ui5/webcomponents-react';

function App() {
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
      <Button onClick={sendMessage}>Send message</Button>
    </>
  );
}

export default App;
