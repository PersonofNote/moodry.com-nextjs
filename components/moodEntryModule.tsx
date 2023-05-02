import { useState } from 'react';
import { FaSmile } from "react-icons/fa";
import { FaMeh } from "react-icons/fa";
import { FaFrown } from "react-icons/fa";
import styles from './moodEntryModule.module.css'
import formStyles from '../pages/styles/forms.module.css'

import Loader from './loader'


const MoodEntryModule = ({ user, loading, setLoading, fetchMoods, setMoods }) => {

    const initialMoodState = {
        value: 0,
        note: '',
        user_id: user?.user_id
    }
    const [moodValue, setMoodValue] = useState(initialMoodState)
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setMoodValue({...moodValue, note: e.currentTarget.value})
    }

    const handleClick = (e) => {
        setMoodValue({...moodValue, value: e.currentTarget.value})
        console.log(moodValue)
    }

    const handleSubmit = async (e) => {
        if (!moodValue.value || moodValue.value < 1) {
            setError('Please select a face')
            return
        }
        setLoading(true)
        try {   
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moodValue)
            };
            fetch(`/api/moods/${user.user_id}`, requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log("RESPONSE")
                res.errors && setError(res.errors)
                setMoodValue(initialMoodState)
                fetchMoods()
            })
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
            setError(error)
            console.log('error', error);
        }
    }

    if (loading) return <Loader />

    return(
    <div className={styles.card}>
        <div style={{textAlign: 'center'}} className="text-center">
            <h2> How are you feeling? </h2>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <button 
                className={`${styles.iconButton} ${parseInt(moodValue.value) === 3 ? styles.active : '' }`}
                color="inherit"
                border-radius='100%'
                value={3}
                onClick={handleClick}>
                <FaSmile
                    size={40}
                    strokeWidth={2}
                    style={{ fill: '#ACD8AA'}}
                />
            </button>
            <button
                className={`${styles.iconButton} ${parseInt(moodValue.value) === 2 ? styles.active : '' }`}
                color="inherit"
                value={2}
                onClick={handleClick}>
                <FaMeh
                    size={40}
                    strokeWidth={2}
                    style={{ fill: '#FFA666' }}
                />
            </button>
            <button
                className={`${styles.iconButton} ${parseInt(moodValue.value) === 1 ? styles.active : '' }`}
                color="inherit" 
                value={1}
                onClick={handleClick}>
                <FaFrown
                    size={40}
                    style={{ fill: '#FF7171' }}
                />
            </button>
        </div>
        <div className={styles.formGroup}>
            <input
                className={formStyles.formField}
                onChange={e => handleChange(e)}
                value={moodValue.note}
                placeholder={"Enter Note (Optional)"}
                name="new-note"
                autoComplete='off'
            /> 
            <label htmlFor="new-note" style={{marginTop: '4px'}} >Add note (optional)</label>
        </div>
            <div>
                <button className={styles.submitButton} disabled={moodValue === null} onClick={handleSubmit}>Add Mood</button>
            </div>
            <div className='error-message'>{error}</div>
    </div>
)
};


export default MoodEntryModule;