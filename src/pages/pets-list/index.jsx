import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/auth-context';
import Header from '../../comp/header';
import PetCard from '../../comp/petCard';
import './index.css';

const PetList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [sort, setSort] = useState("foundDateAsc");
  const [filterBreed, setFilterBreed] = useState("");
  const [filterIsVaccinated, setFilterIsVaccinated] = useState("");
  const [filterIsDog, setFilterIsDog] = useState("");

  useEffect(() => {
    loadPets();
  }, [sort, filterBreed, filterIsVaccinated, filterIsDog]);

  async function loadPets() {
    let c = collection(db, "pets");

    let constraints = [];

    constraints.push(where("isAdopted", "==", false));

    if (filterBreed) constraints.push(where("breed", "==", filterBreed));
    if (filterIsVaccinated) constraints.push(where("isVaccinated", "==", filterIsVaccinated === "yes"));
    if (filterIsDog) constraints.push(where("isDog", "==", filterIsDog === "dog"));

    if (sort === "foundDateAsc") constraints.push(orderBy("foundDate", "asc"));
    if (sort === "nameAsc") constraints.push(orderBy("name", "asc"));
    if (sort === "nameDesc") constraints.push(orderBy("name", "desc"));
    if (sort === "ageAsc") constraints.push(orderBy("age", "asc"));
    if (sort === "ageDesc") constraints.push(orderBy("age", "desc"));

    let data = await getDocs(query(c, ...constraints));
    setPets(data.docs.map((d) => ({ id: d.id, ...d.data() })));

  }

  const isAllowed = currentUser?.role === "admin" || currentUser?.role === "worker";
  
  return (
    <>
      <Header />
      <div className='pList-body'>
        <div className='sfb'>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="foundDateAsc">-Sort-</option>
              <option value="nameAsc">Name A-Z</option>
              <option value="nameDesc">Name Z-A</option>
              <option value="ageAsc">Age Ascending</option>
              <option value="ageDesc">Age Descending</option> 
            </select>
            <br />
            <input type='text' placeholder='Breed' value={filterBreed} onChange={(e) => setFilterBreed(e.target.value)} />
            <select value={filterIsVaccinated} onChange={(e) => setFilterIsVaccinated(e.target.value)}>
              <option value="">-IsVaccinated-</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <select value={filterIsDog} onChange={(e) => setFilterIsDog(e.target.value)}>
              <option value="">Dog and Cat</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>


            {isAllowed && (
              <button onClick={() => navigate("/pets/add-pet")}>Add Pet</button>
            )}

        </div>

        <div className='pet-list'>
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </div>
    </>
  );
}

export default PetList;