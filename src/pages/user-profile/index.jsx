import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth-context';
import { db } from '../../config/firebase';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import Header from '../../comp/header';
import userLogoWoman from '../../images/user-woman.png';
import userLogoMan from '../../images/user-man.png';
import './index.css';

const UserProfile = () => {
  const {id} = useParams();
  const {currentUser} = useAuth();
  const [userData, setUserData] = useState(null);
  const [adoptionRequests, setAdoptRequests] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
       const userIdToFetch = id || currentUser?.uid;
      if (!userIdToFetch) return;
      const userDocRef = doc(db, "users", userIdToFetch);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      }
    };

    const fetchAdoptionRequests = async () => {
      const userIdToFetch = id || currentUser?.uid;
      if (!userIdToFetch) return;
      const q = query(
        collection(db, "adoptionRequests"),
        where("userId", "==", userIdToFetch)
      );

      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => ({id: doc.id,
         ...doc.data()
        }));
      setAdoptRequests(requests);
    }

    fetchUserData();
    fetchAdoptionRequests();
  }, [id, currentUser]);

  if ((!currentUser && !id) || !userData) return <div>Loading...</div>;

  return (
    <>
    <Header />
    <div className='prof-body'>
      <div className='prof-info'>
          <img src={userData?.photoURL && userData.photoURL.trim() !== "" 
          ? userData.photoURL 
          : (userData?.gender === "Female" ? userLogoWoman : userLogoMan)} alt="user-photo" className="user-photo" />
        <h1>{userData.firstName} {userData.lastName}</h1>
        <p>Email: {userData.email}</p>
        <p>Contact: {userData.phone}</p>
        <p>Born at: {userData.birthDate}</p>
        <p>City: {userData.city}</p>
        <p>Gender: {userData.gender}</p>
        <p>Residence: {userData.livingType}</p>
        <p>Additional Info: {userData.additionalInfo}</p>
      </div>
      <div className='prof-req'>
        <h2>Adoption Requests</h2>
        {adoptionRequests.map(req => (
          <div key={req.id} className='req-card'>
            <img src={req.petPhoto} alt="pet-photo" />
            <div className='pet-name'>{req.petName}</div>
            <div className={`status-${req.status}`}>
              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </div>
          </div>
        ))}
        {adoptionRequests.length === 0 && <p>No adoption requests yet.</p>}
    </div>
  </div>
    </>
  );
};

export default UserProfile;