import React, {useState} from 'react';
// import '../styles/dashboard.css';



// import Loader from '../components/Loader'


// const api_url = process.env.NODE_ENV === 'development' ? 'https://xk5wizjyfh.execute-api.us-east-1.amazonaws.com/prod/' : 'https://xk5wizjyfh.execute-api.us-east-1.amazonaws.com/prod/'
const api_url = '/api/auth/email-auth'

const Signin = ({user, setUser}) => {
    const [formValues, setFormValues] = useState({
        email: null,
        password: null
    })
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')

    const setLocalStorage = (data) => {
        localStorage.setItem('moodryUser', JSON.stringify(data));
        //setUser(data)
    }

    const handleChange = e => {
        const attName = e.currentTarget.name;
        const value = e.currentTarget.value;
        setFormValues({...formValues, [attName]: value})
    }

    const handleLogin = () => {
        setLoading(true);
        if (formValues.email && formValues.password){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            };
            try {
            fetch(`${api_url}`, requestOptions)
                .then(response => response.json())
                .then(res => {
                    res.id ? setLocalStorage(res) : setMessage(res.message)
                    setLoading(false);
                })
            }catch (err) {
                setMessage(err.message)
            }
        }
        else {
            setMessage("One or more values is missing, please fill in all values and try again.")
        }
    }
    
    // TODO: add next redirect
    /*
    if (user) {
        return <Navigate to="/" replace />;
    }
    */   

  return (
    <main>
        <div className="form-container">
            <h1>Sign In</h1>
            {loading ? <p>loader</p> : (
                <>
                <input
                onChange={handleChange}
                value={formValues.email}
                label={"Enter Email"}
                name="email" 
                />
                <input
                    onChange={handleChange}
                    type='password'
                    value={formValues.password}
                    label={"Enter Password"} 
                    name="password"
                />
                    <button onClick={handleLogin}> Sign In</button>
            <div> Don't have an account? <a href="/signup">Sign Up</a></div>
            </>
            )}
       <div className="error-message">{message}</div>
        </div>
    </main>
  );
}

export default Signin;
