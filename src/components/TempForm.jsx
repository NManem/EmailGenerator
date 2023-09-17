import { useState } from 'react';

const TempForm = () => {
  // const [experience, setExperience] = useState('');
  // const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const emptyForm = { experience: '', role: '' };
  const [formData, setFormData] = useState(emptyForm);


  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    async function submit(){
      const response = await fetch(`/api/openai/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const newEmail = await response.json()
      setEmail(newEmail)
      setFormData(emptyForm)
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
        <p>{email}</p>
      </div>
    </>
  );
}

export default TempForm