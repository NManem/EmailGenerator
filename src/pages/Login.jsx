import React, { useState, useEffect, useRef } from "react";

const Login = () => {

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [labels, setLabels] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("Authorize");
  const [error, setError] = useState(null);

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
  const tokenClientRef = useRef(null);


  useEffect(() => {
    // Load GAPI
    const scriptGapi = document.createElement("script");
    scriptGapi.src = "https://apis.google.com/js/api.js";
    scriptGapi.onload = gapiLoaded;
    document.body.appendChild(scriptGapi);

    // Load GSI client
    const scriptGsi = document.createElement("script");
    scriptGsi.src = "https://accounts.google.com/gsi/client";
    scriptGsi.onload = gisLoaded;
    document.body.appendChild(scriptGsi);

    // Removes scripts ones you switch pages
    return () => {
      document.body.removeChild(scriptGapi);
      document.body.removeChild(scriptGsi);
    };
  }, []);

  const gapiLoaded = () => {
    window.gapi.load("client", initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);
  };

  const gisLoaded = () => {
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '',
    });
    setGisInited(true);
  };

  const handleAuthClick = async () => {
    if (!tokenClientRef.current) {
      console.error("tokenClient is not initialized yet.");
      return;
    }
    tokenClientRef.current.callback = async (resp) => {
      if (resp.error) {
        throw resp;
      }
      //& Action that occurs when authenticated
      setButtonLabel("Refresh");
      await listLabels();
    };

    if (window.gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClientRef.current.requestAccessToken({ prompt: '' });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken("");
      setLabels([]);
      setButtonLabel("Authorize");
    }
  };

  const listLabels = async () => {
    try {
      const response = await window.gapi.client.gmail.users.labels.list({ userId: 'me' });
      const labels = response.result.labels;
      setLabels(labels);
    } catch (err) {
      setError(err.message);
    }
  };




  return (
    <div>
      <p>Gmail API Quickstart</p>
      <button onClick={handleAuthClick}>{buttonLabel}</button>
      <button onClick={handleSignoutClick}>Sign Out</button>
      {error && <p>{error}</p>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {labels.length === 0 ? 'No labels found.' : `Labels:\n${labels.map(label => label.name).join("\n")}`}
      </pre>
    </div>
  );

}



export default Login;