import { useState, useCallback, useEffect } from 'react';
import { useSession, getSession } from "next-auth/react"
import connectMongo from '../lib/connectMongo';
import { User } from '../models/user.model';
import { Mood } from '../models/mood.model';

// ICONS
import { MdDelete } from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';

// COMPONENTS
import Layout from "../components/layout";
import DateFilter from '../components/dateFilters';
import LineChart from '../components/LineChart';
import { SpiralChart } from '../components/SpiralChart';

import Skeleton from 'react-loading-skeleton'
//import 'react-loading-skeleton/dist/skeleton.css'


import styles from '../components/charts.module.css'



export default function ChartsPage({user}) {

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });
    const [moods, setMoods] = useState(null);
    const [filteredMoods, setFilteredMoods] = useState(moods);

    // TODO: extract this into a reusable hook. Or convert to ServerSide Props rendering
    const fetchMoods = useCallback(async () => {
        try {
            fetch(`/api/moods/${user._id}`)
            .then(response => response.json())
            .then(res => {
                setMoods(res)
            })
        }
        catch (error) {
            console.log('error', error);
        }
    }, [])


    useEffect(() => {
        fetchMoods();
        // Initial load
        setFilteredMoods(moods);
    },[]);

   
  return (
    <Layout>
        <div className={styles['line-chart-container']}>
          <DateFilter data={moods} setDateRange={setDateRange} setFilteredData={setFilteredMoods}/>
          <LineChart data={filteredMoods} dateRange={dateRange} />
        </div>
      <h2> For Demo Purposes only</h2>
      <hr />
        <SpiralChart />
    </Layout>
  )
}


