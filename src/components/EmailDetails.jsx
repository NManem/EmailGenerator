import { useState, useEffect } from "react";

const EmailDetails = (props) => {
  const { emailId, setPopupState } = props;

  const [emailDetails, setEmailDetails] = useState({})

  useEffect(()=>{
    async function fetchEmailDetails(emailId){
      const response = await fetch(`/api/gmail/draftdetails/${emailId}`);
      const data = await response.json()
      setEmailDetails(data);
    }
    fetchEmailDetails(emailId);

  }, []);
  //! Note, the HTML is set dangerously. In future need to change
  return (
    <div className="popup">
      <div className="email-details">
        <button className="close-btn" onClick={() => setPopupState(false)}>X</button>
        <div className="details-header">
          <div><b>From:</b> {emailDetails.from}</div>
          <div><b>To:</b> {emailDetails.to}</div>
          <div><b>Subject:</b> {emailDetails.subject}</div>
        </div>
        <div className="details-body" dangerouslySetInnerHTML={{ __html: emailDetails.body }}></div>
      </div>
    </div>
  );

}
export default EmailDetails;