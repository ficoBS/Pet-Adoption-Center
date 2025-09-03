import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config//firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


const CompleteRegister = () => {
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!formData.birthDate || !formData.city || !formData.gender || !formData.phone || !formData.livingType) {
       return setError("Fill out all required spaces.");
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...formData,
      });
      navigate("/");
    } catch (er) {
      setError("Error while saving the profile.");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className='auth-body'>
      <div className='reg-form'>
        <form onSubmit={handleSubmit}>
          <h1>Complete Register</h1>
          <hr />
        {error && <p className='error'>{error}</p>}
        <input value={formData.email} disabled />
        <input value={formData.firstName} disabled />
        <input value={formData.lastName} disabled />
        <br />

        <select name='city' onChange={handleChange} required>
          <option value="">-Select a city-</option>
          <option>Berovo</option>
          <option>Bitola</option>
          <option>Bogdanci</option>
          <option>Valandovo</option>
          <option>Veles</option>
          <option>Vinica</option>
          <option>Gevgelija</option>
          <option>Gostivar</option>
          <option>Debar</option>
          <option>Delcevo</option>
          <option>Demir Kapija</option>
          <option>Demir Hisar</option>
          <option>Kavadarci</option>
          <option>Kicevo</option>
          <option>Kocani</option>
          <option>Kratovo</option>
          <option>Kriva Palanka</option>
          <option>Krusevo</option>
          <option>Kumanovo</option>
          <option>Makedonska Kamenica</option>
          <option>Makedonski Brod</option>
          <option>Negotino</option>
          <option>Ohrid</option>
          <option>Prilep</option>
          <option>Probistip</option>
          <option>Radovis</option>
          <option>Resen</option>
          <option>Sveti Nikole</option>
          <option>Skopje</option>
          <option>Struga</option>
          <option>Strumica</option>
          <option>Tetovo</option>
          <option>Stip</option>
        </select>
        <input type='date' name='birthDate' placeholder='birthDate' onChange={handleChange} required />
        <br />
        <input type='tel' name='phone' placeholder='Phone Number' onChange={handleChange} required />
        <br />
        <fieldset>
          <label>
            <legend>Gender</legend>
            <input type='radio' name='gender' value='Male' onChange={handleChange} checked={formData.gender === "Male"} />
            Male
          </label>
          <label>
            <input type='radio' name='gender' value='Female' onChange={handleChange} checked={formData.gender === "Female"} />
            Female
          </label>
        </fieldset>
        <br />
        <fieldset>
          <legend>Residence</legend>
          <label>
            <input type='radio' name='livingType' value='House' onChange={handleChange} checked={formData.livingType === "House"} />
            House
          </label>
          <label>
            <input type='radio' name='livingType' value='Apartment' onChange={handleChange} checked={formData.livingType === "Apartment"} />
            Apartment
          </label>
        </fieldset>
        <br />
        <textarea name='additionalInfo' placeholder='Additional Info' onChange={handleChange} />
        <br />
        <button type='submit'>Save</button>
        </form>
      </div>
    </div>
  )
};

export default CompleteRegister;