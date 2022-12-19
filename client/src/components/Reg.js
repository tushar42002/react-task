import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const Reg = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", mobile: "", password: "", cpassword: "" });
    const [formErrors, setFormErrors] = useState({});

    let navigate = useNavigate();




    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(credentials);

        // console.log('correct');
        // console.log(formErrors.nameError);
        // console.log(formErrors.emailError);
        // console.log(formErrors.mobileError);
        // console.log(formErrors.passwordError);

        setFormErrors(validate(credentials))

        if (Object.keys(formErrors).length === 0) {
            if (credentials.password === credentials.cpassword) {


                const response = await fetch(`http://localhost:5000/api/auth/Createuser`, {
                    method: 'POST',
                    headers: {
                        'content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: credentials.name, email: credentials.email, mobile: credentials.mobile, password: credentials.password })
                });
                const json = await response.json()
                console.log(json);
                // save auth-token and redirect
                if (json.success) {
                    // save auth-token and redirect
                    localStorage.setItem('token', json.authtoken);

                    navigate("/profile");
                } else {
                    props.showAlert("invalid data", "danger");
                }
            }
        }


    }

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

    // console.log(formErrors);



    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className="mb-3 my-5 container">
            <form onSubmit={handleSubmit}>
                <h1 className='text-center'>Registration</h1>
                <div>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onChange} id="name" name='name' aria-describedby="emailHelp" required />
                    <p className="text-danger">{formErrors.name}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} id="email" name='email' aria-describedby="emailHelp" required />
                    <p className="text-danger">{formErrors.email}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">Mobile Number</label>
                    <input type="text" className="form-control" onChange={onChange} id="mobile" name='mobile' aria-describedby="mobileHelp" required />
                    <p className="text-danger">{formErrors.mobile}</p>

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} name='password' id="password" minLength={8} required />
                    <p className="text-danger">{formErrors.password}</p>


                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">confirm Password</label>
                    <input type="password" className="form-control" onChange={onChange} name='cpassword' id="cpassword" minLength={8} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <p className='my-2'>Already have a account! <Link to="/"> log in</Link></p>
        </div>
    )
}

export default Reg