import React, { useState } from "react";
import appContext from "./appContext"

const AppState = (props) => {
  const host = "http://localHost:5000/";
  const notesInitial = [
  ]
  const [user, setUser] = useState(notesInitial);


  // fetch all  note
  const getUser = async () => {

    const response = await fetch(`${host}api/auth/getuser`, {
      method: 'POST',
      headers: {
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json()
    setUser(json)
  }




  // edit note



  return (
    <appContext.Provider value={{ user, getUser }}>
      {props.children}
    </appContext.Provider>
  )
}


export default AppState;