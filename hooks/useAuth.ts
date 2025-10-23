import React from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { getAllProfiles } from '@/database/profile.operations';

type Props = {}

const useAuth = ({

}: Props) => {
    const db = useSQLiteContext();

    const searchProfile = async (email: string) => {
        const allProfiles = await getAllProfiles(db);

        const profile = allProfiles.find((profile: any) => profile.correo === email);
        return profile;
    }

    const setCurrentProfile = async (token: any) => {
        db.runAsync(`INSERT INTO app_config_data (current_user) VALUES (?)`, [token]);
    }

    return {
        searchProfile,
        setCurrentProfile
    }
}

export default useAuth