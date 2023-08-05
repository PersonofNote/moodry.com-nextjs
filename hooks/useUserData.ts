import { useEffect, useState, useCallback } from 'react';
import { getSession } from 'next-auth/react';

export async function useUserData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
        try {
            const session = await getSession();
            if (session && session.user) {
                const userEmail = session.user.email || '';
                const userData = await fetchResponse(userEmail);
                setUser(userData);
              }
        }
        catch (error) {
            console.log('error', error);
        }
    }
    fetchUserData();
}, [])
 console.log("USER FROM HOOK RETURNING:")
 console.log(user)
  return user;
}

const fetchResponse = async (email: string) => {
    const response = await fetch(`/api/users/${email}`);
    if (!response.ok) {
        // Check if the response status is not OK (e.g., 404, 500, etc.)
        throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
}