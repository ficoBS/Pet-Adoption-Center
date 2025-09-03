import React from 'react';
import { useNavigate } from 'react-router-dom';
import './petCard.css';

const PetCard = ({ pet }) => {
  const navigate = useNavigate();

  return (
    <div className='card-body' onClick={() => navigate("/pets/" + pet.id)}>
      <div className='pph'>
        <img src={pet.photo} alt='pet-photo' />
      </div>
      <h2>{pet.name}, {pet.age} years old</h2>
      <p>{pet.breed}</p>
      <p>
        {pet.isVaccinated ? <span className='vacc'>Vaccinated</span> : <span className='not-vacc'>Not Vaccinated</span>}
      </p>
    </div>
  );
}

export default PetCard;