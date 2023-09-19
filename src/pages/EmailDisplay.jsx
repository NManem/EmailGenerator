import { useEffect, useState } from "react";
import Email from "../components/Email.jsx";
import EmailDetails from "../components/EmailDetails.jsx";

const EmailDisplay = () => {

  const [emails, setEmails] = useState([]);
  const [updateEmails, setUpdateEmails] = useState(true);
  const [popupState, setPopupState] = useState(false);
  const [emailIdForDetail, setEmailIdForDetail] = useState('');

  useEffect(() => {
    async function fetchEmails() {
      const response = await fetch('/api/gmail/drafts');
      const data = await response.json()
      setEmails(data)
    }
    fetchEmails()

  }, [updateEmails]);

  // Override css on page
  useEffect(() => {
    document.body.classList.add("email-page");
    return () => {
      document.body.classList.remove("email-page");
    };
  }, []);

  function emailDetailButton(emailId){
    setEmailIdForDetail(emailId)
    setPopupState(true);
  }

  return (
    <>
      <div className="email-list">
        {emails.map(email => (
          <Email
            key={email.emailId}
            emailId={email.emailId}
            to={email.To}
            company={email.company}
            setUpdateEmails={setUpdateEmails}
            emailDetailButton={emailDetailButton}
          />
        ))}
      </div>
      {popupState && <EmailDetails 
        emailId={emailIdForDetail}
        setPopupState={setPopupState}
      />}
    </>
  );
}

export default EmailDisplay;
