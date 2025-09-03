import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth-context';
import { doc, getDoc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Header from '../../comp/header';
import './index.css';

const PetDetails = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    async function fetchPet() {
      const snap = await getDoc(doc(db, "pets", id));
      setPet(snap.data());
    }
    fetchPet();
  }, [id]);

  if (!pet) {
    return <div>Loading...</div>
  }

  const foundDate = pet.foundDate?.toDate();
  const foundDateFormatted = foundDate
  ? foundDate.toLocaleDateString("en-GB")
  : "-";

  const handleAdoptRequest = async () => {
  if (!currentUser) {
    navigate("/login");
    return;
  }

  try {
    const requestId = `${currentUser.uid}_${id}`;
    const requestRef = doc(db, "adoptionRequests", requestId);

    const existingRequest = await getDoc(requestRef);
    if (existingRequest.exists()) {
      const data = existingRequest.data();
      alert(`Request is already in sent: ${data.status}`);
      return;
    }
    
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    let userName = currentUser.displayName || "Unknown";

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      userName = `${userData.firstName} ${userData.lastName}`;
    }

    await setDoc(requestRef, {
      petId: id,
      petName: pet.name,
      userId: currentUser.uid,
      petPhoto: pet.photo,
      userName,
      userEmail: currentUser.email,
      requestDate: Timestamp.now(),
      status: "waitingApproval",
    });

    alert("Adoption request submitted successfully!");
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Something went wrong. Try again later.");
  }
};

  return (
    <>
      <Header />
      <div className='pDetails-body'>
        <div className='detail-card'>
          <img  src={pet.photo} alt='pet-photo' />
          <div>
            <h1>{pet.name}</h1>
            <p>Age: {pet.age}</p>
            <p>Breed: {pet.breed}</p>
            <p>Vaccinated: {pet.isVaccinated ? "Yes" : "No"}</p>
            <p>Type: {pet.isDog ? "Dog" : "Cat"}</p>
            <p>Found on: {foundDateFormatted}</p>
            <p>Found where:{pet.foundWhere}</p>
            <p>Health: {pet.health}</p>
            <p>Mood: {pet.mood}</p>

            {!pet.isAdopted && (
              <button onClick={handleAdoptRequest}>
                Adopt
              </button>
            )}
            

          </div>
        </div>
      </div>
    </>
  );
}

export default PetDetails;