import "./App.css";
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import React from "react";
import { useState, useEffect } from "react";
import API from "./API/APIclient";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home.js"
import {LoginForm} from "./components/LoginForm.js"
import Calendar from "./components/Calendar"


function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [studyGroupList,setStudyGroupList] = useState(null);
  const [myStudyGroupList,setMyStudyGroupList] = useState("");
  const [isSGListloading, setIsSGListLoading] = useState(true);
  const [allStudyGroupList,setAllStudyGroupList] = useState(null);
  const [renderList,setRenderList] = useState(false)
  const [allMeet,setAllMeet] = useState(null)
  const [partecipation,setPartecipation] = useState(null)
  const [invalid,setInvalid] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setUser(() => user);
        setLoggedIn(() => true);
      } catch (err) {
        console.log(err.error); // mostly unauthenticated user
      }
    };
    checkAuth();
  }, [])

   useEffect(() => {
     //prende solo le materie inserite nel db subjects
     const loadStudyGroup = () => {
          API.getStudyGroupList()
         .then((studyGroupList) => {
           setStudyGroupList(() =>studyGroupList);
           setIsSGListLoading(false)
         })
         .catch((e) => {
           console.log("error loading StudyGroup List " + e)
           //qua potrei mettere un reloading della pagina se c'è stato un errore, tenta di fare il reloading
         });
     }
     //prende le materie a cui sono iscritto o ho mandato una richiesta altrimenti non sono nel db
      const loadMyStudyGroup = () => {
        API.getMyStudyGroupList()
        .then((myStudyGroupList) => {
          setMyStudyGroupList(() =>myStudyGroupList);
        })
        .catch((e) => {
          console.log("error loading MyStudyGroup List " + e)
          //qua potrei mettere un reloading della pagina se c'è stato un errore, tenta di fare il reloading
        });
    }
    //prende tutti i dati che ci sono in gs, cioè tutti gli iscritti alle materie e le richieste mandate
    const loadAllStudyGroup = () => {
      API.getAllStudyGroup()
      .then((allStudyGroupList) => {
        setAllStudyGroupList(() =>allStudyGroupList);
      })
      .catch((e) => {
        console.log("error loading AllStudyGroup List " + e)
        //qua potrei mettere un reloading della pagina se c'è stato un errore, tenta di fare il reloading
      });
  }

    const loadAllMeet = () => {
      API.getAllMeet()
      .then((allMeet) => {
        setAllMeet(() =>allMeet);
      })
      .catch((e) => {
        console.log("error loading AllMeet List " + e)
      });
  }

  const loadPartecipation = () => {
    API.getPartecipation()
    .then((partecipation) => {
      setPartecipation(() =>partecipation);
    })
    .catch((e) => {
      console.log("error loading Partecipation List " + e)
    });
}

     if(loggedIn){
      loadAllMeet();
      loadPartecipation();
      loadStudyGroup();
      loadAllStudyGroup();
     loadMyStudyGroup();
     }

   },[loggedIn,renderList]);

  const doLogIn = async (credentials) => {
    try {
      await API.logIn(credentials);
      setLoggedIn(true);
      setInvalid(()=>false)
      window.location.reload()
    } catch (err) {
      console.log("Error during the log in");
      setInvalid(()=>true)
    }
    //window.location.realod()
  };

  const doLogOut = () => {
     API.logOut();
    setLoggedIn(() =>false);
    // clean up everything
  };


  return (
    <Router>
    <Switch>
    <Redirect exact from='/' to='/login' />

    <Route path="/home" render={() => <>{<Home user={user} logout={doLogOut} studyGroupList={studyGroupList} myStudyGroupList={myStudyGroupList} isSGListloading={isSGListloading}
    setStudyGroupList={setStudyGroupList} setMyStudyGroupList={setMyStudyGroupList} setIsSGListLoading={setIsSGListLoading} allStudyGroupList={allStudyGroupList}
     setAllStudyGroupList={setAllStudyGroupList} renderList={renderList} setRenderList={setRenderList}> </Home>}</>}/>
    <Route path="/calendar" render={()=><>{<Calendar logout={doLogOut} myStudyGroupList={myStudyGroupList} user={user} studyGroupList={studyGroupList}
                                             renderList={renderList} setRenderList={setRenderList}  allMeet={allMeet}
                                             setAllMeet={setAllMeet} allStudyGroupList={allStudyGroupList} partecipation={partecipation} setPartecipation={setPartecipation}></Calendar> }</>}/>
    <Route path="/login" render={() => 
        <>{!loggedIn ? <LoginForm login={doLogIn} invalid={invalid}></LoginForm>  : <Redirect exact  to='/home' /> }</>
    }/>  


    </Switch>
  </Router>
  );
}

export default App;
