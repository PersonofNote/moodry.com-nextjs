import React from 'react';
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import useSwr from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function UsersList() {
    const { data, error, isLoading } = useSwr<any>('/api/examples/users', fetcher)

    if (error) return <div>Failed to load users</div>
    if (isLoading) return <div>Loading...</div>
    if (!data) return null
  
    return (
      <ul>        
        {data.map((user) => (
          <li key={user.id}>
              {user.username ?? `User ${user._id}`}
          </li>
        ))}
        
      </ul>
    )
}
