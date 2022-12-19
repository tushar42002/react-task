import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import appContext from '../context/notes/appContext';

const Profile = (props) => {

  const context = useContext(appContext)
  const { user, getUser } = context;

  const [ucredentials, setUcredentials] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [edit, setEdit] = useState(true)

  const navigate = useNavigate();


  const updateUser = async (e) => {
    e.preventDefault();

    setFormErrors(validate(ucredentials))

    if (Object.keys(formErrors).length === 0) {

      if (ucredentials.password === ucredentials.cpassword) {


        const response = await fetch(`http://localhost:5000/api/auth/updateuser/${user._id}`, {
          method: 'PUT',
          headers: {
            'content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ name: ucredentials.name, email: ucredentials.email, mobile: ucredentials.mobile})
        });
        const json = await response.json()
        console.log(json);
        // save auth-token and redirect
        if (json.success) {
          // navigate("/profile");
           props.showAlert(" update Successfully", "success");
        } else {
          props.showAlert("some error occure", "danger");
        }
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUser()
    } else {
      navigate('/login')
    }
    // eslint-disable-next-line
  }, [updateUser])




  const validate = (values) => {
    const errors = {}

    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\w{2,3})+$/g;
    const regMobile = /^\d{10}$/;
    const regName = /^[a-zA-Z]+$/;
    const regPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[a-z]).{8,}$/;

    if (values.name === " ") {
      errors.name = "name is required"

    } else if (!regName.test(values.name)) {
      errors.name = "Enter a valid name"
    }
    if (!regEmail.test(values.email)) {
      errors.email = "enter A valid email"
    }
    if (values.mobile === " ") {
      errors.mobile = "mobile number is required"

    } else if (!regMobile.test(values.mobile)) {
      errors.mobile = "enter a valid mobile"
    }
    if (!regPassword.test(values.password)) {
      errors.password = "password must have at least one capital a small alphabet , symbal and number"
    }

    return errors
  }

  const handleEdit = () => {
    if(edit){
      setEdit(false);
    } else {
      setEdit(true);
    }
  }

  const onChange = (e) => {
      setUcredentials({ ...ucredentials, [e.target.name]: e.target.value });
      console.log(ucredentials);
  }
  return (
    <div className="mb-3 my-5 container">
      <form onSubmit={updateUser}>
        <h1 className='text-center'>Registration</h1>
        <div style={{textAlign: 'right'}}><button type="button" className="btn btn-primary" onClick={handleEdit}>Edit</button></div>
        <div>
          <label htmlFor="name" className="form-label">Your Name</label>
          <input disabled={edit} type="text" className="form-control" onChange={onChange} defaultValue={user.name} id="name" name='name' aria-describedby="emailHelp" required />
          <p className="text-danger">{formErrors.name}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Your Email address</label>
          <input disabled={edit} type="email" className="form-control" onChange={onChange} defaultValue={user.email} id="email" name='email' aria-describedby="emailHelp" required />
          <p className="text-danger">{formErrors.email}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">Your Mobile Number</label>
          <input disabled={edit} type="text" className="form-control" onChange={onChange} defaultValue={user.mobile} id="mobile" name='mobile' aria-describedby="mobileHelp" required />
          <p className="text-danger">{formErrors.mobile}</p>
        </div>
        {edit?"":<button type="submit" className="btn btn-primary">Update Data</button>}
      </form>
    </div>
  )
}

export default Profile