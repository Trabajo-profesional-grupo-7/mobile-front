import React, { createContext, useContext, useState, ReactNode } from "react";

interface Profile {
  username: string;
  email: string;
  preferences: string[];
  location: string;
  birthdate: Date | undefined;
  image: string | undefined;
  coordinates: { longitude: number; latitude: number } | undefined;
}

interface ProfileContextProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined
);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Profile>({
    username: "",
    email: "",
    preferences: [],
    location: "",
    birthdate: undefined,
    image: undefined,
    coordinates: undefined,
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextProps => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
