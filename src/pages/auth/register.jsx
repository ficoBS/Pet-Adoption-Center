import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../config//firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import "./auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      city: "",
      gender: "",
      phone: "",
      additionalInfo: "",
      livingType: "",
    });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const isAdult = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const isValidPassword = (password) => {
    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return rules.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAdult(formData.birthDate)) {
      return setError("You have to be 18 or older.");
    }

    if (!isValidPassword(formData.password)) {
      return setError("The password must contain an uppercase letter, a lowercase letter, and a number.");
    }

    try {
      const reg = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = reg.user;

      let photoURL = "";

      if (image) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });

        await updateProfile(user, {
          displayName: `${formData.firstName} ${formData.lastName}`,
          photoURL
        });
      }

      const { password, ...dataToSave } = formData;


      await setDoc(doc(db, "users", reg.user.uid), {
        ...dataToSave,
        email: formData.email,
        role: "user",
        createdAt: serverTimestamp(),
        photoURL: photoURL || "",
      });
      navigate("/login");
      alert("Account created.")
    } catch (er) {
      if (er.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      }
      else {
      setError(er.message);
      }
    }
  };

  return (
    <div className='auth-body'>
      <div className='reg-form'>
        <form onSubmit={handleSubmit}>
          <h1>Create an account</h1>
          <hr />
        {error && <p className='error'>{error}</p>}
        <input type='email' name='email' placeholder='Email' onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <br />
        <input type='password' name='password' placeholder='Password' onChange={handleChange} required />
        <br />
        <input type='text' name='firstName' placeholder='First Name' onChange={handleChange} required />
        <input type='text' name='lastName' placeholder='Last Name' onChange={handleChange} required />
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
        
        <input type='date' name='birthDate' placeholder='Birth Date' onChange={handleChange} required />
        <br />
        <input type='tel' name='phone' placeholder='Phone Number' onChange={handleChange} required />
        <br />
        <fieldset>
          <legend>Gender</legend>
          <label>
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
        <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  )
};


export default Register;