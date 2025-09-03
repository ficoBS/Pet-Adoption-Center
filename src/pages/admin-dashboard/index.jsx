import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../../comp/header";
import './index.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [adopted, setAdopted] = useState([]);
  const [waitingPickup, setWaitingPickup] = useState([]);
  const [waitingApproval, setWaitingApproval] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAdoptionRequests();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const allUsers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    setUsers(allUsers.filter((u) => u.role !== "worker" && u.role !== "admin"));
    setWorkers(allUsers.filter((u) => u.role === "worker"));
  };

  const fetchAdoptionRequests = async () => {
    const snap = await getDocs(collection(db, "adoptionRequests"));
    const allRequests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    setAdopted(allRequests.filter((r) => r.status === "adopted"));
    setWaitingPickup(allRequests.filter((r) => r.status === "waitingPickup"));
    setWaitingApproval(allRequests.filter((r) => r.status === "waitingApproval"));
  };

  const makeWorker = async (userId) => {
    await updateDoc(doc(db, "users", userId), { role: "worker" });
    fetchUsers();
  };

  const makeUser = async (userId) => {
    await updateDoc(doc(db, "users", userId), { role: "user" });
    fetchUsers();
  };

  const updateRequestStatus = async (requestId, newStatus, petId) => {
    const batch = writeBatch(db);

    batch.update(doc(db, "adoptionRequests", requestId), { status: newStatus });

    const isAdoptedValue = newStatus === "adopted" || newStatus === "waitingPickup";
    batch.update(doc(db, "pets", petId), { isAdopted: isAdoptedValue });

    await batch.commit();
    fetchAdoptionRequests();
  };

  const goToProfile = (id) => {
    navigate(`/profile/${id}`);
  };
  const goToPet = (id) =>
    navigate(`/pets/${id}`);

  return (
    <>
      <Header />
      <div className="db-body">
        <div className="all-users">

          <div className="half-users">
            <h2>Users</h2>
            <div className="u-list">
              {users.map((u) => (
                <div key={u.id} className="u-card">
                  <div onClick={() => goToProfile(u.id)}>
                    {u.firstName} {u.lastName}  |  {u.email}
                  </div>
                  <div>
                    <button onClick={() => makeWorker(u.id)}>Make Worker</button>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="half-users">
            <h2>Workers</h2>
            <div className="u-list">
              {workers.map((u) => (
                <div key={u.id} className="u-card">
                  <div onClick={() => goToProfile(u.id)}>
                    {u.firstName} {u.lastName}  |  {u.email}
                  </div>
                  <div>
                    <button onClick={() => makeUser(u.id)}>Make User</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        

        <div className="all-adoptions">
          <h2>Adoption Requests</h2>

          <div className="adopted">
            <h3>Adopted</h3>
            {adopted.map((req) => (
              <div key={req.id} className="a-card">
                <img src={req.petPhoto} alt="pet-photo" />
                <span onClick={() => goToPet(req.petId)}>{req.petName}</span>
                <span onClick={() => goToProfile(req.userId)}>{req.userName}  |  {req.userEmail}</span>
              </div>
            ))}
          </div>
        
          <div className="adopted">
            <h3>Waiting Pickup</h3>
            {waitingPickup.map((req) => (
              <div key={req.id} className="a-card">
                <img src={req.petPhoto} alt="pet-photo" />
                <span onClick={() => goToPet(req.petId)}>{req.petName}</span>
                <span onClick={() => goToProfile(req.userId)}>{req.userName}  |  {req.userEmail}</span>
                <span>
                  <button onClick={() => updateRequestStatus(req.id, "adopted", req.petId)}>Adopted</button>
                  <button onClick={() => updateRequestStatus(req.id, "rejected", req.petId)}>
                    Reject
                  </button>
                </span>
              </div>
            ))}
          </div>
        
          <div className="adopted">
            <h3>Waiting Approval</h3>
            {waitingApproval.map((req) => (
              <div key={req.id} className="a-card">
                <img src={req.petPhoto} alt="pet-photo" />
                <span onClick={() => goToPet(req.petId)}>{req.petName}</span>
                <span onClick={() => goToProfile(req.userId)}>{req.userName}  | {req.userEmail}</span>
                <span>
                  <button onClick={() => updateRequestStatus(req.id, "waitingPickup", req.petId)}>Approve</button>
                  <button onClick={() => updateRequestStatus(req.id, "rejected", req.petId)}>
                    Reject
                  </button>
                </span>
              </div>
            ))}
          </div>

        </div>



      </div>
    </>
  );
};

export default AdminDashboard;