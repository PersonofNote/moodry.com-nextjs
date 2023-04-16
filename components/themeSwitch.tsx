import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import styles from '../pages/styles/forms.module.scss'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

// Delay theme reading until hydrated
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className='ams-card'>
        <h3>Choose color scheme: </h3>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <label className={styles['rad-label']}>
                <input type="radio" className={styles['rad-input']} name="rad" value="system" onClick={e => setTheme(e.currentTarget.value)}/>
                <div className={styles['rad-design']}></div>
                <div className={styles['rad-text']}>System</div>
            </label>

            <label className={styles['rad-label']}>
                <input type="radio" className={styles['rad-input']} name="rad" value='dark' onClick={e => setTheme(e.currentTarget.value)}/>
                <div className={styles['rad-design']}></div>
                <div  className={styles['rad-text']}>Dark</div>
            </label>

            <label className={styles['rad-label']}>
                <input type="radio" className={styles['rad-input']} name="rad" onClick={e => setTheme(e.currentTarget.value)}/>
                <div  className={styles['rad-design']}></div>
                <div className={styles['rad-text']}>Light</div>
            </label>
        </div>
    </div>
  )
}

export default ThemeSwitch