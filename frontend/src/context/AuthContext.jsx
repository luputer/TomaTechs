import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (signed in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const login = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    };

    const logout = async () => {
        try {
            const result = await Swal.fire({
                title: 'Apakah Anda yakin ingin keluar?',
                text: "Anda akan keluar dari akun Anda",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#478800',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, keluar',
                cancelButtonText: 'Batal',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            // Debug log to check the result
            console.log('SweetAlert result:', result);

            // More explicit check for confirmation
            if (!result.isConfirmed || result.isDismissed || result.dismiss) {
                console.log('Logout cancelled by user');
                return false; // Return false to indicate cancellation
            }

            // Proceed with logout only if confirmed
            console.log('Proceeding with logout...');
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Show success message
            await Swal.fire({
                title: 'Berhasil!',
                text: 'Anda telah keluar dari akun',
                icon: 'success',
                confirmButtonColor: '#478800',
                timer: 2000,
                showConfirmButton: false
            });

            // Navigate after successful logout
            navigate('/');
            return true; // Return true to indicate successful logout

        } catch (error) {
            console.error('Error logging out:', error.message);
            await Swal.fire({
                title: 'Error!',
                text: 'Terjadi kesalahan saat keluar',
                icon: 'error',
                confirmButtonColor: '#478800'
            });
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;