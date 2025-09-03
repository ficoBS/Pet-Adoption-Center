import Header from '../../comp/header';
import PetSlider from "../../comp/petSlider";
import './index.css';

const Home = () => {
  return (
    <div className="home-body">
      <Header />
      <main className="main-content">
        <section className="mission">
          <h1>Welcome to PetAdopt</h1>
          <p>
            Our mission is to help abandoned animals find loving homes. Browse available pets
            and make a new friend today.
          </p>
        </section>

        <section className='infos'>
          <div className='info-div'>
            <h2>🐾 About us</h2>
            <p>At Adopt a pet, we believe every animal deserves a loving, forever home. Our mission is to connect compassionate individuals and families with pets in need, giving both a second chance at happiness. Whether you're looking for a loyal dog, a playful cat, or a gentle small pet, we're here to guide you every step of the way.</p>
          </div>
          <div className='info-div'>
            <h2>❤️ Why Adopt?</h2>
            <p>When you adopt, you're not just getting a pet — you're saving a life. Every animal in our care has a unique story and an incredible capacity for love. By choosing adoption, you're helping reduce overcrowding in shelters and giving hope to pets that have been abandoned, rescued, or surrendered.</p>
          </div>

          <PetSlider />

          <div className='info-div'>
            <h2>🏠 Our Process</h2>
            <p>We've made adopting simple, transparent, and stress-free. Browse our list of adoptable pets online or visit us in person to meet them face-to-face. Our team is here to help match you with the perfect companion based on your lifestyle, home, and heart.</p>
          </div>
          <div className='info-div'>
            <h2>🌟 Join the Mission</h2>
            <p>Even if you're not ready to adopt, there are many ways to help. Consider fostering, donating, or volunteering — every small act creates a big impact. Together, we can make sure every pet finds their person.</p>
          </div>
        </section>

        
      </main>
    </div>
  );
};

export default Home;