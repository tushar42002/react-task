import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = (props) => {

  const [credentials, setCredentials] = useState({email: "", password: ""})
  let navigate = useNavigate();

  const h1Style = {color: 'blue',textAlign:'center',fontWeight: '700'};

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({email: credentials.email, password: credentials.password})
    });
    const json = await response.json()
    console.log(json);
    if(json.success){
      // save auth-token and redirect
      localStorage.setItem('token', json.authtoken);
        
        navigate("/profile");
    } else{
      props.showAlert("invalid details", "danger");
    }
  }

  const onChange = (e)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
}
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 style={h1Style}>Log in</h1>
        <div className="mb-3 my-5">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control outline-none" onChange={onChange} name='email' value={credentials.email} id="email" aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" onChange={onChange} name='password' value={credentials.password} id="password"/>
        </div>
        <button type="submit" className="btn btn-primary">Log in</button>
      </form>
      <p className='my-2'>Didn't have a account! <Link to="/reg">Create new account</Link></p>
    </div>
  )
}

export default Login