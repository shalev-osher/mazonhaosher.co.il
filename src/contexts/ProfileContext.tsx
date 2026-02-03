import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
}

interface ProfileContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.rpc("get_my_profile");
      
      if (error) {
        // Profile doesn't exist yet, that's okay
        if (error.message.includes("Not authenticated")) {
          return;
        }
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setProfileState(data[0] as Profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile();
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch to avoid auth deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile();
          }, 0);
        } else {
          setProfileState(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile();
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setProfile = (newProfile: Profile | null) => {
    setProfileState(newProfile);
  };

  const logout = async () => {
    // Clear local state first to prevent any re-auth attempts
    setProfileState(null);
    setUser(null);
    setSession(null);
    
    try {
      // Sign out from Supabase - this clears the session
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.log("Logout completed (local state cleared)");
    }
    
    // Manually clear any remaining auth data from localStorage
    // This ensures no tokens remain that could trigger auto-refresh
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || key.includes('supabase')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  return (
    <ProfileContext.Provider value={{ 
      user,
      session,
      profile, 
      setProfile, 
      isLoggedIn: !!session,
      isLoading,
      logout,
      refreshProfile,
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
