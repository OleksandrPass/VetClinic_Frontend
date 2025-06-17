const getProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) return null;

  try {
    const response = await fetch('https://vet-clinic-backend.ew.r.appspot.com/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const profile = await response.json();

    if (response.ok) {
      return profile;
    } else {
      console.error("Profile fetch failed:", profile.message);
      return null;
    }
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
};
export default getProfile;
