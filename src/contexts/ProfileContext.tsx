import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("user-profile");
    return saved ? JSON.parse(saved) : null;
  });

  const setProfile = (newProfile: Profile | null) => {
    setProfileState(newProfile);
    if (newProfile) {
      localStorage.setItem("user-profile", JSON.stringify(newProfile));
    } else {
      localStorage.removeItem("user-profile");
    }
  };

  const logout = () => {
    setProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      setProfile, 
      isLoggedIn: !!profile,
      logout 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
