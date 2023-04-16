import { useCallback, useState, useEffect } from 'react';
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/layout";
import connectMongo from '../lib/connectMongo';
import { User } from '../models/user.model';
import { Mood } from '../models/mood.model';
import { MdDelete } from 'react-icons/md';
import { IoIosAdd } from 'react-icons/io';
import { format } from 'date-fns';
import { moodTextMapping, moodColors, moodIconMapping } from '../constants'
import MoodEntryModule from '../components/moodEntryModule';

import  styles from './styles/dashboard.module.css';
import formStyles from './styles/forms.module.scss';

export default function Dashboard({user}) {

  const { data } = useSession() 

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMoods = useCallback(async () => {
    setLoading(true);
    try {
        fetch(`/api/moods/${user.user_id}`)
        .then(response => response.json())
        .then(res => {
            console.log(res)
            setMoods(res)
            setLoading(false)

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

  const renderMoods = (moodsList) => {
    const moodsArray = Object.keys(moodsList).reverse().map((key, index) => {
        const { _id, value, note, createdAt } = moodsList[key];
        // const Icon = moodIconMapping[value]
        const date = createdAt ? format(new Date(createdAt), 'MM/dd h:m aaaa') : "Unknown date";
        return(
            <li key={`${index}`} className={styles.moodContainerAms} >
                <div style={{width: `20%`}}>{date}</div> 
                <div className='div-item-ams'>
                    <svg width='32px' height='32px' xmlns="http://www.w3.org/2000/svg">
                        <circle viewBox="0 0 32 32" cx="16" cy="16" r="16" fill={moodColors[value]} />
                    </svg> 
                </div> 
                <div style={{width: `55%`}}className='div-item-ams'>
                    {note ? <div style={{paddingLeft: `1rem`}}>{note}</div> : 
                    <div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input className={formStyles.formField}
                            placeholder={"Enter Note (Optional)"}
                            name="note"
                            autoComplete="off"
                        />
                        <button style={{background: 'none', display: 'flex', alignItems: 'center', padding: '0.5rem', fontSize: '32px'}} value={_id} >
                           +
                        </button>
                    </div>
                    </div>
                    } 
                    </div> 
                <div className='div-item-ams'> 
                    <button className='icon-button'  value={_id}>
                        <MdDelete width='100%' height='100%'/>
                    </button> 
                </div>
            </li>
        )
    });
    return moodsArray;
}


  return (
    <Layout>
      {loading && <p>Loading...</p>}
      <MoodEntryModule user={user} loading={loading} setLoading={setLoading} fetchMoods={fetchMoods} setMoods={setMoods}/>
      <ul role="list" className={'undeeorated-list-ams'}>
        {renderMoods(moods)}
      </ul>
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

