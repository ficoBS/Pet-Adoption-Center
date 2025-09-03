import React, { useState } from 'react';
import { db, storage } from '../../config/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Header from '../../comp/header';
import './index.css';

const AddPet = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [isVaccinated, setIsVaccinated] = useState("");
  const [isDog, setIsDog] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const [mood, setMood] = useState("");
  const [foundWhere, setFoundWhere] = useState("");
  const [health, setHealth] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = "";
      if (photo) {
        const fileRef = ref(storage, `pets/${Date.now()}-${photo.name}`)
        await uploadBytes(fileRef, photo);
        photoURL = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "pets"), {
        name,
        age: Number(age),
        breed,
        isVaccinated,
        isDog,
        foundDate: Timestamp.now(),
        mood,
        foundWhere,
        health,
        photo: photoURL,
        isAdopted: false,
      });

      alert("Pet added!");
      navigate("/pets");
      setLoading(false);
    } catch (er) {
      alert("Error while adding pet."+er);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className='padd-body'>
        <div className='padd-form'>
          <h1>Add Pet</h1>
          <hr />
          <form onSubmit={handleSubmit}>
             <input type='file' onChange={(e) => setPhoto(e.target.files[0])} required />
             <br />
            <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} required />
            <br />
            <input type='number' placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} required />
            <br />
            <input type='text' placeholder='Breed' value={breed} onChange={(e) => setBreed(e.target.value)}  required />
            <input type='text' value={foundWhere} placeholder='Where was it found?' onChange={(e) => setFoundWhere(e.target.value)}  required />
            <input type='text' value={health} placeholder='Health condition?' onChange={(e) => setHealth(e.target.value)}  required />
            <fieldset>
              <legend>Vaccination?</legend>
              <label>
                <input type='radio' checked={isVaccinated === true} onChange={() => setIsVaccinated(true)} />Yes
              </label>
              <label>
                <input type='radio' checked={isVaccinated === false} onChange={() => setIsVaccinated(false)} />No
              </label>
            </fieldset>
            <fieldset>
              <legend>Type?</legend>
              <label>
                <input type='radio' checked={isDog === true} onChange={() => setIsDog(true)} />Dog
              </label>
              <label>
                <input type='radio' checked={isDog === false} onChange={() => setIsDog(false)} />Cat
              </label>
            </fieldset>
            
            <fieldset>
              <legend>Mood?</legend>
              <label>
                <input type='radio' checked={mood === "Safe"} onChange={() => setMood("Safe")} />Safe
              </label>
              <label>
              <input type='radio' checked={mood === "Cautious"} onChange={() => setMood("Cautious")} />Cautious
              </label>
              <label>
              <input type='radio' checked={mood === "Dangerous"} onChange={() => setMood("Dangerous")} />Dangerous
              </label>
            </fieldset>
            <button type='submit'>Add Pet</button>
          </form>
        </div>
      </div>
    </>
  )

}

export default AddPet;