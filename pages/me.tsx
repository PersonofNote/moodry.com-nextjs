import { useCallback, useState, useEffect } from 'react';
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/layout";
import connectMongo from '../lib/connectMongo';
import { User } from '../models/user.model';
import { Mood } from '../models/mood.model';

export default function MePage({user}) {

  const { data } = useSession() 

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMoods = useCallback(async () => {
    setLoading(true);
    try {
        fetch(`/api/moods/${user.user_id}`)
        .then(response => response.json())
        .then(res => {
            setMoods(res.message, setLoading(false))
        })
    }
    catch (error) {
        console.log('error', error);
    }
}, [])

  useEffect(() => {
    fetchMoods();
  },[]);
  
  if (!data) return null

  return (
    <Layout>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  )
}

// TODO: figure out this type

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/dashboard/auth/login',
        permanent: false
      },
    }
  }

  await connectMongo();
  
  const userData = await User.findOne({
      email: session.user.email
      })

  const user = JSON.parse(JSON.stringify(userData))

  return {
    props: {
      test: 'test',
      user: {
        user_id: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles.join(", ")
      }
    },
  }
}

