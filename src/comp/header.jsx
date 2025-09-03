import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '../hooks/auth-context';
import './header.css';
import logoSmall from '../images/logo-small.png';
import userLogo from '../images/user.png';
import userLogoMan from '../images/user-man.png';
import userLogoWoman from '../images/user-woman.png';

const Header = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            gender: userData.gender,
            displayName: `${userData.firstName} ${userData.lastName}`,
            photoURL: userData.photoURL && userData.photoURL.trim() !== "" 
            ? userData.photoURL 
            : (currentUser.photoURL || currentUser.providerData[0]?.photoURL || ""),
          });
        }
        else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            gender: "",
            displayName: currentUser.displayName || currentUser.email,
            photoURL: currentUser.photoURL || "",
          });
        }
      }
      else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdown(false);
    navigate("/login");
  };

  const isAllowed = currentUser?.role === "admin" || currentUser?.role === "worker";

  return (
    <header>
      <div className='logoo'>
        <img src={logoSmall} alt="logo" />
      </div>
      <nav>
        <Link to="/" className='link'>Home</Link>
        <Link to="/pets" className='link'>Pets</Link>
        {isAllowed && (
          <Link to="/dashboard" className='link'>Admin Dashboard</Link>
        )}
      </nav>
      {!user ? (
        <div onClick={() => navigate("/login")} className='userLogo'>
          <img src={userLogo} alt="user" />
          <span>Sign up</span>
        </div>
      ) : (
          <div className="user-dropdown">
            <div className="user-info" onClick={() => setDropdown(!dropdown)}>
              <img src={user?.photoURL || (user?.gender === "Female" ? userLogoWoman : userLogoMan)} alt="user" className="user-icon" />
              <span>{user.displayName}</span>
            </div>

            {dropdown && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate(`/profile/${user.uid}`)}>Profile</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            )}
          </div>
        )}
    </header>
  );
};

export default Header;