import React, { useRef, useState, useEffect } from 'react';
import { format, addDays, subDays, isAfter, isBefore, parseISO, endOfDay, startOfDay   } from 'date-fns';
import styles from './charts.module.css';

const timeFrames = [{name: 'all', val: null}, {name : "day", val: 1}, {name: "week", val: 7}, {name: "month", val: 30}, {name: "year", val: 365}]
const now = new Date();

const DateFilters = ({data, setFilteredData, setDateRange}) => {

    const handleClick = e => {
        if (!e.target.value) {
            setFilteredData(data);
            setDateRange({startDate: null, endDate: null})
        }else{
            const daysAgo = subDays(now, e.target.value)
            const filteredData = data.filter(d => { 
                const date = parseISO(d.createdAt)
                //return isAfter(date, daysAgo) && isBefore(date, now)
                return isAfter(date, startOfDay(daysAgo)) && isBefore(date, endOfDay(now))
            })
            setFilteredData(filteredData);
            setDateRange({startDate: daysAgo, endDate: endOfDay(addDays(now, 1))});
        }
    }
    
    const buttonGroup = timeFrames.map((e, index) => (
        <button onClick={handleClick} name={e.name} key={index} value={e.val}>{e.name}</button>
    ))
    
    return (
    <div className={styles['button-container']}><div> Show by: </div>{buttonGroup}</div>
    )
}

export default DateFilters;


// TODO: add functionality to set beginning and end date for ticks, probably as a string for D3 to parse