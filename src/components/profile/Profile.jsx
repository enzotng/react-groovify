import { useUserContext } from "../config/UserContext";
import "./Profile.scss";

const Profile = () => {
  const { userProfile } = useUserContext();

  if (!userProfile) {
    return <p>Loading profile...</p>;
  }

  return (
    <main>
      <div className="profile-wrapper">
        <h1>Profile</h1>
        <div className="profile-infos-wrapper">
          <img src={userProfile.images[0]?.url} alt={`Image profil de ${userProfile.display_name}`} />
          <div className="profil-infos-text">
            <p>{userProfile.display_name}</p>
            <p>{userProfile.email}</p>
          </div>
        </div>
        <div className="profile-settings">
          <ul>
            <li>Profile</li>
            <li>Notification</li>
            <li>Audio & Video</li>
            <li>Language</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Profile;
