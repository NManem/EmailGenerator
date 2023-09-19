import { useState } from 'react';
import { Link } from 'react-router-dom';

const TempForm = (props) => {
  // const [experience, setExperience] = useState('');
  // const [role, setRole] = useState('');
  const [draft, setDraft] = useState('');
  const emptyForm = { experience: '', role: '' };
  const [formData, setFormData] = useState(emptyForm);


  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    async function submit() {
      const response = await fetch(`/api/openai/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const newDraft = await response.json()
      setDraft(newDraft)
      setFormData(prev => ({ ...prev, role: '' }))
    }
    submit()
  }


  return (
    <>
      <div >
        <h1>Input</h1>
        <form onSubmit={handleSubmit} className="form">
          <div>
            <label htmlFor="experience"><h3>Input Experience (Resume)</h3></label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder='test123..'
            ></textarea>
          </div>
          <div>
            <label htmlFor="role"><h3>Input Job Description</h3></label>
            <textarea
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder='test456..'
            ></textarea>
          </div>
          <button >Submit</button>
        </form>
      </div>
      <div>
        <h1>Response</h1>
        <p>{draft}</p>
        {draft && <Link to="/edit" state={{ draft: draft }}>Edit Email Draft</Link>}
        {/* {draft && <Link to={{
          pathname: "/edit",
          state: { draft: draft }
        }}>
          Edit Email Draft
        </Link>} */}
      </div>
    </>
  );
}

export default TempForm