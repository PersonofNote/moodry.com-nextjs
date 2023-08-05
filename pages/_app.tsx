import { useEffect, useState, useMemo } from "react"
import { NextPageContext } from 'next';
import { SessionProvider, useSession, getSession } from "next-auth/react";
import { useUserData } from "../hooks/useUserData";
import { ThemeProvider } from 'next-themes';
import connectMongo from '../lib/connectMongo';
import { User } from '../models/user.model';
import { Mood } from '../models/mood.model';
import "./styles/styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

import IndexPageNoAuth from "./index-no-auth";

import Router from "next/router";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  console.log(user)
  const fetchResponse = async (email: string) => {
    const response = await fetch(`/api/users/${email}`);
    if (!response.ok) {
        // Check if the response status is not OK (e.g., 404, 500, etc.)
        throw new Error(`Network response was not ok: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

  useMemo(() => {
    setLoading(true);
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
    setLoading(false);
}, [user?._id])

  return (
    <ThemeProvider>
      <SessionProvider session={session}>
      <>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <>
            {user ? <Component {...pageProps} user={user} /> :  <IndexPageNoAuth />}

            </>
          )}
        </>
      </SessionProvider>
    </ThemeProvider>
  )
}