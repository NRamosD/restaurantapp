import React from 'react'
import { router } from 'expo-router'
import { useAuthStore } from '@/hooks/useAuthStore'

type Props = {}

export const usePopUpGeneralActions = ({}: Props) => {

    const token = useAuthStore((s) => s.token);
    const logout = useAuthStore((s) => s.logout);
    const changeRole = () => {
        if (!token) return;
        
    }
    const changeProfile = () => {
        if (!token) return;
        
    }
    const closeSession = () => {
        if (!token) return;
        logout();
        router.dismissTo("/(auth)/login");
    }


    return {
        changeRole,
        changeProfile,
        closeSession,
    }
}