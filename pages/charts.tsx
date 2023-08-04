import { useState, useCallback, useEffect } from 'react';
import Layout from "../components/layout"
import { useSession, getSession } from "next-auth/react"
import connectMongo from '../lib/connectMongo';
import { User } from '../models/user.model';
import { Mood } from '../models/mood.model';
import { MdDelete } from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';
import LineChart from '../components/LineChart';
import DateFilter from '../components/dateFilters';
import styles from '../components/charts.module.css'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function ChartsPage({user}) {
    const [loading, setLoading] = useState(false);
    const { data } = useSession();
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });
    const [moods, setMoods] = useState(null);
    const [filteredMoods, setFilteredMoods] = useState(moods);

    // TODO: extract this into a reusable hook. Or convert to ServerSide Props rendering
    const fetchMoods = useCallback(async () => {
        setLoading(true);
        try {
            fetch(`/api/moods/${user.user_id}`)
            .then(response => response.json())
            .then(res => {
                setMoods(res)
                setLoading(false)
            })
        }
        catch (error) {
            console.log('error', error);
        }
    }, [])


    useEffect(() => {
      setLoading(true);
        fetchMoods();
        // Initial load
        setFilteredMoods(moods);
        setLoading(false)
    },[]);

   
  return (
    <Layout>
      {loading ? <Skeleton /> : (
        <div className={styles['line-chart-container']}>
          <DateFilter data={moods} setDateRange={setDateRange} setFilteredData={setFilteredMoods}/>
          <LineChart data={filteredMoods} dateRange={dateRange} />
        </div>
      )}
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);
  
    if (!session) {
      return {
        redirect: {
          destination: '/',
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
        user: {
          user_id: user._id,
          email: user.email,
          username: user.username,
          roles: user.roles.join(", ")
        }
      },
    }
  }

