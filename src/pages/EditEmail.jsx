import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const EditEmail = () => {
  const { state } = useLocation();
  const initialDraft = state?.draft || 'This is a test paragraph';

  const [draft, setDraft] = useState(initialDraft);
  const [subjectLine, setSubjectLine] = useState('')
  const [options, setOptions] = useState([]);
  const [name, setName] = useState('Nitesh Manem');

  const [networkers, setNetworkers] = useState([]);
  const [networkingEmailsString, setNetworkingEmailsString] = useState('');

  const [resumeLink, setResumeLink] = useState('https://drive.google.com/file/d/1yTVmV5n3JTEUM-UqWHlkw-Q6c1W0oFEs/view?usp=sharing');
  const [linkedinLink, setLinkedinLink] = useState('https://www.linkedin.com/in/nitesh-manem/');
  const [githubLink, setGithubLink] = useState('https://github.com/NManem/');


  const handleDraftChange = (e) => {
    setDraft(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubjectLine(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubjectFetch = async () => {
    const response = await fetch('/api/openai/subject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, draft })
    });
    const data = await response.json();
    setOptions(data);

  };

  // for handling different options for subject line
  const handleSubjectOptions = (selectedSubject) => {
    setSubjectLine(selectedSubject);
  };

  // for handling all networking emails
  const handleNetworkingSubmit = () => {
    const networkingList = networkingEmailsString.split(/[\s,;]+/);  // split by spaces, commas, or semicolons
    const parsedEmails = networkingList.map(email => {
      const nameGuess = email.split('@')[0].split('.')[0];  // naive guess
      return { email, name: nameGuess };
    });
    setNetworkers(parsedEmails);
  };
  const handleNetworkingNameChange = (index, name) => {
    const updatedNetworkers = [...networkers];
    updatedNetworkers[index].name = name;
    setNetworkers(updatedNetworkers);
  };

  // Generate email drafts
  function generateDrafts() {
    async function makeGmailDraft(draft, networkingEmail, networkersName) {
      
      const lines = draft.split('\n');
      await fetch('/api/gmail/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: lines, name, networkersName, to: networkingEmail, subject: subjectLine, resumeLink, linkedinLink, githubLink })
      });
    }
    for (let i = 0; i < networkers.length; i++) {
      makeGmailDraft(draft, networkers[i].email, networkers[i].name)
    }
  }

  return (
    <>
      <p>Subject Line</p>
      <input
        type="text"
        value={subjectLine}
        onChange={handleSubjectChange}
        style={{ width: '600px' }}
      />
      <p>Email</p>
      <textarea
        value={draft}
        onChange={handleDraftChange}
        rows="25"
        cols="80"
      />
      <br />
      <label htmlFor="inputName">Input Name:</label>
      <input
        id="inputName"
        type="text"
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleSubjectFetch}>Fetch Subject Line Options</button>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            {option}
            <button onClick={() => handleSubjectOptions(option)}>Select</button>
          </li>
        ))}
      </ul>
      <div>
        <textarea value={networkingEmailsString} onChange={(e) => setNetworkingEmailsString(e.target.value)}></textarea>
        <button onClick={handleNetworkingSubmit}>Process</button>
        {networkers.map((entry, index) => (
          <div key={index}>
            <span>{entry.email}</span>
            <input
              value={entry.name}
              onChange={(e) => handleNetworkingNameChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button style={{ backgroundColor: 'red', color: 'white' }} onClick={generateDrafts}>
        Generate Drafts
      </button>
      <div>
        <label>
          Resume Link:
          <input type="text" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />
        </label>
        <label>
          LinkedIn Link:
          <input type="text" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} />
        </label>
        <label>
          GitHub Link:
          <input type="text" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
        </label>
      </div>
    </>
  );
};

export default EditEmail;
