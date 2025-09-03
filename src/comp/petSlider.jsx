import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import PetCard from "./petCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./petSlider.css";


const PetSlider = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsRef = collection(db, "pets");
        const q = query(
          petsRef,
          where("isAdopted", "==", false),
          orderBy("foundDate", "asc"),
          limit(8)
        );

        const querySnapshot = await getDocs(q);
        const petsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsData);
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="pet-slider">
      <div className="slider-top">
      <h2>See some pets</h2>
      <Link to="/pets" className="pets-link">See all pets</Link>
      </div>
      <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={5} navigation pagination={{ clickable: true }} loop direction="horizontal">
        {pets.map((pet) => (
          <SwiperSlide key={pet.id}>
            <Link to={`/pets/${pet.id}`} className="pet-card-link">
              <PetCard key={pet.id} pet={pet} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PetSlider;