import { useCallback, useState, useEffect } from 'react';
import { useSession, getSession } from "next-auth/react";
import connectMongo from '../lib/connectMongo';
import { User } from '../models/user.model';
import { Mood } from '../models/mood.model';
import { IoIosAdd } from 'react-icons/io';

// DATE FUNCTIONS
import { format } from 'date-fns';
import { isBefore, isAfter, addDays, subDays, parseISO, endOfDay, startOfDay } from 'date-fns'

// COMPONENTS
import Layout from "../components/layout";
import MoodEntryModule from '../components/moodEntryModule';
import Loader from '../components/loader';
import DatePicker from "react-datepicker";
import Skeleton from 'react-loading-skeleton';

// STYLES
// import 'react-loading-skeleton/dist/skeleton.css';
import "react-datepicker/dist/react-datepicker.css";
import  styles from './styles/dashboard.module.css';
import formStyles from './styles/forms.module.css';

// ICONS AND COLORS
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { moodTextMapping, moodColors, moodIconMapping } from '../constants'


// TODO: Move the types
interface MoodData {
    _id: string;
    value: number;
    note: string;
    createdAt: string;
  }

  interface UserData {
    _id: string;
    email: string;
  }
  
  interface MoodList {
    [key: string]: MoodData;
  }
  
  interface DashboardProps {
    user: UserData;
  }

export default function Dashboard({ user }: DashboardProps) {

  const [moods, setMoods] = useState<MoodList>({});
  const [filteredMoods, setFilteredMoods] = useState<MoodList>({})
  const [note, setNote] = useState<string>('');

  const [startDate, setStartDate] = useState(new Date("2020/04/01"));
  const [endDate, setEndDate] = useState(new Date())

  useEffect(() => {
    const filtered = Object.values(moods).filter((mood) => {
      const date = parseISO(mood.createdAt);
      return isBefore(date, endOfDay(endDate)) && isAfter(date, startOfDay(startDate));
    })
    setFilteredMoods(filtered)
  }, [startDate, endDate]);

  // TODO: Make this better. Probably put it up to the top level and pass it down so you're not constantly calling it
  const fetchMoods = useCallback(async () => {
    try {
      fetch(`/api/moods/${user._id}`)
        .then(response => response.json())
        .then(res => {
          setMoods(res)
          // Todo: right now this will unset the filtering on delete and note add
          setFilteredMoods(res)
        })
    }
    catch (error) {
      console.log('error', error);
    }
  }, [user._id])

  const addNote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (note) {
      const noteValue = {
        _id: e.currentTarget.value,
        note: note
      }
      try {
        const requestOptions = {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteValue)
        };
        fetch(`/api/moods/update-mood/${e.currentTarget.value}`, requestOptions)
          .then(response => response.json())
          .then(res => {
            fetchMoods();
          })
      }
      catch (error) {
        console.log('error', error);
      }
    }
  }

  const handleDeleteMood = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const moodData = {
        _id: e.currentTarget.value,
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodData)
      };
      fetch(`/api/moods/update-mood/${e.currentTarget.value}`, requestOptions)
        .then(response => response.json())
        .then(res => {
          console.log(res)
          fetchMoods();
        })
    }
    catch (error) {
      console.log('error', error);
    }
    }

    useEffect(() => {
        fetchMoods();
    }, []);

    if (!user) return null
    

  
  if (!user) return null

  const renderMoods = (moodsList: MoodList) => {
    const data = Object.keys(moodsList);
    if (data.length < 1) {
      return (<div>No moods for the dates selected; pick a different date range or add some data</div>)
    }
    const moodsArray = data.reverse().map((key, index) => {
        const { _id, value, note, createdAt } = moodsList[key];
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
                    <input
                        className={formStyles.formField}
                        onChange={e => setNote(e.target.value)}
                        
                        placeholder={"Enter Note (Optional)"}
                        name="note"
                        autoComplete='off'
                    />
                        <button style={{background: 'none', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        padding: '0.5rem', 
                                        fontSize: '32px'}} 
                                value={_id}
                                onClick={addNote} >
                           <AiOutlinePlus fill="lightblue" width='100%' height='100%' />
                        </button>
                    </div>
                    </div>
                    } 
                    </div> 
                <div className='div-item-ams'> 
                    <button className='icon-button' value={_id} onClick={handleDeleteMood}>
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
        <MoodEntryModule user={user} fetchMoods={fetchMoods} setMoods={setMoods}/>
        <div style={{display: 'flex', flexDirection: 'row', padding: '1rem 0'}}>
          <DatePicker
            className='date-picker-input'
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          <DatePicker
            className="date-picker-input"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
        <ul role="list" className={'undeeorated-list-ams'}>
            {renderMoods(filteredMoods)}
        </ul>
    </Layout>
      
  )
}
