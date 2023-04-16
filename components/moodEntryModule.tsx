import { useState } from 'react';
import { FaSmile } from "react-icons/fa";
import { FaMeh } from "react-icons/fa";
import { FaFrown } from "react-icons/fa";
import styles from './moodEntryModule.module.scss'
import formStyles from '../pages/styles/forms.module.scss'

import Loader from './loader'


const MoodEntryModule = ({ user, loading, setLoading, fetchMoods, setMoods }) => {

    const initialMoodState = {
        value: null,
        note: null,
        user_id: user?.id
    }
    const [moodValue, setMoodValue] = useState(initialMoodState)
    const [error, setError] = useState(null);

    console.log(moodValue.value)

    const handleChange = (e) => {
        if (e.currentTarget.name === 'new-note'){
            setMoodValue({...moodValue, note: e.currentTarget.value})
        }else{
            setMoodValue({...moodValue, value: e.currentTarget.value})
        }
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        try {   
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moodValue)
            };
            fetch(`/api/moods`, requestOptions)
            .then(response => response.json())
            .then(res => {
                res.message?.errors && setError(res.message.errors.value.message)
                setMoodValue(initialMoodState)
                fetchMoods()
            })
            setLoading(false)
        }
        catch (error) {
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
                className={`${styles.iconButton} ${parseInt(moodValue.value) === 1 ? styles.active : '' }`}
                color="inherit"
                border-radius='100%'
                value={1}
                onClick={e => handleChange(e)}>
                <FaSmile
                    strokeWidth={2}
                    style={{ fill: '#ACD8AA'}}
                />
            </button>
            <button
                className={`${styles.iconButton} ${parseInt(moodValue.value) === 2 ? styles.active : '' }`}
                color="inherit"
                value={2}
                onClick={e => handleChange(e)}>
                <FaMeh
                    strokeWidth={2}
                    style={{ fill: '#FFA666' }}
                />
            </button>
            <button
                className={`${styles.iconButton} ${parseInt(moodValue.value) === 3 ? styles.active : '' }`}
                color="inherit" 
                value={3}
                onClick={e => handleChange(e)}>
                <FaFrown
                    style={{ fill: '#FF7171' }}
                />
            </button>
        </div>
        <input
            className={formStyles.formField}
            onChange={e => handleChange(e)}
            value={moodValue.note?.length > 0 ? moodValue.note : ''}
            label={"Enter Note (Optional)"}
            name="note"
            autoComplete='off'
        />
            <div>
                <button className={styles.submitButton} disabled={moodValue === null} onClick={handleSubmit}>Add Mood</button>
            </div>
    </div>
)
};


export default MoodEntryModule;