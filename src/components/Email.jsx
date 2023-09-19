import { useEffect } from "react";

const Email = (props) => {
  const { emailId, to, subject, company, setUpdateEmails, emailDetailButton} = props
  const handleSend = () => {
    async function sendEmail(){
      const response = await fetch(`/api/gmail/draft/${emailId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      await setUpdateEmails(bool=>!bool);
    }
    sendEmail();
    
  };

  return (
    <div className="email-item">
      <div className="email-id"><b>Email ID:</b> {emailId}</div>
      <div className="email-to"><b>To:</b> {to}</div>
      <div className="email-company"><b>Company:</b> {company}</div>
      <button onClick={handleSend}>Send</button>
      <button onClick={()=>emailDetailButton(emailId)}>Details</button>
    </div>
  );
}

export default Email;
