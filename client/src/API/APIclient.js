import Course from "./../models/Course"
import Meet from "./../models/Meet"

// AUTHENTICATION APIS
    async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
    
    async function logOut() {
      await fetch('/api/sessions/current', { method: 'DELETE' });
    }

    async function getUserInfo() {
      const response = await fetch("/api/sessions/current");
      const userInfo = await response.json();
      if (response.ok) {
        return userInfo;
      } else {
        throw userInfo; // an object with the error coming from the server, mostly unauthenticated user
      }
    }


//OTHER APIS
async function getStudyGroupList() {
  const response = await fetch("/api/studygrouplist")

  const responseBody = await response.json();

  const studyGroupList = []

  for(let jsonCourse of responseBody){
    studyGroupList.push(new Course(jsonCourse.idcorso, jsonCourse.nomecorso, jsonCourse.crediti, jsonCourse.colore, jsonCourse.richiesta,null,null))
  }
  return studyGroupList
}

//Prende tutti i dati di GS
async function getAllStudyGroup() {
  const response = await fetch("/api/allstudygrouplist")

  const responseBody = await response.json();

  const studyGroupList = []

  for(let jsonCourse of responseBody){
    studyGroupList.push(new Course(jsonCourse.idcorso, jsonCourse.nomecorso, jsonCourse.crediti, jsonCourse.colore, jsonCourse.richiesta,jsonCourse.ruolo,jsonCourse.idstudente))
  }
  return studyGroupList
}

//Prende tutti i dati di incontri
async function getAllMeet() {
  const response = await fetch("/api/allmeet")

  const responseBody = await response.json();

  const myStudyGroupMetting = []

  for(let jsonCourse of responseBody){
    myStudyGroupMetting.push(new Meet( jsonCourse.idcorso, jsonCourse.data, jsonCourse.idincontro,jsonCourse.durata, jsonCourse.luogo,null,null))
  }
  return myStudyGroupMetting
}

// GetMyStudyGroup logged in user
async function getMyStudyGroupList() {
  const response = await fetch("/api/mystudygrouplist")

  const responseBody = await response.json();

  const mystudyGroupList = []

  for(let jsonCourse of responseBody){
    mystudyGroupList.push(new Course(jsonCourse.idcorso, jsonCourse.nomecorso, jsonCourse.crediti, jsonCourse.colore, jsonCourse.richiesta,jsonCourse.ruolo,jsonCourse.idstudente))
  }

  return mystudyGroupList
}

//GetMyStudygroupMeeting
async function getPartecipation() {
  const response = await fetch("/api/partecipation")

  const responseBody = await response.json();

  const partecipation = []

  for(let jsonCourse of responseBody){
    partecipation.push(new Meet( jsonCourse.idcorso,null, jsonCourse.idincontro,null, null,jsonCourse.idstudente))
  }
  return partecipation
}

//GetAdministratorsByCourseID
async function getAdministratorsByCourse(courseId){
  const response = await fetch('/api/getadministrator/' + encodeURIComponent(courseId))

  const responseBody = await response.json();


  return responseBody
}

//GetMembersByCourseID
async function getMembersByCourse(courseId){
  const response = await fetch('/api/getmembers/' + encodeURIComponent(courseId))

  const responseBody = await response.json();

  return responseBody
}

//sendig request for a SG 
export async function sendRequest(course) {
  const response = await fetch("/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idcorso: course.id,
      nomecorso: course.nome,
      crediti: course.crediti,
      colore: course.colore,
      richiesta: 1,
      ruolo: 1,
    }),
  });

  const responseBody = await response.json();

  return responseBody;
}

//POST add Course
export async function addCourse(course) {
  const response = await fetch("/api/addcourse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idcorso: course.id,
      nomecorso: course.nome,
      crediti: course.crediti,
      colore: course.colore,
    }),
  });

  const responseBody = await response.json();

  return responseBody;
}

//POST add Meet
export async function addMeet(meet) {
  const response = await fetch("/api/addmeet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idcorso: meet.idcorso,
      data: meet.data,
      idincontro: meet.idincontro,
      durata:meet.durata,
      luogo:meet.luogo,
    }),
  });

  const responseBody = await response.json();

  return responseBody;
}

//Joinare un meet 
export async function requestToJoinMeet(idincontro,idcorso) {
  const response = await fetch(
    "/api/joinmeet",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idincontro: idincontro,
        idcorso: idcorso,
      }),
    }
  );
  const responseBody = await response.json();

  return responseBody.idincontro;
}

//Cancellare una richiesta a una partecipazione
export async function requestToCancelMeet(idincontro) {
  const response = await fetch(
    "/api/cancelmeet/"+ encodeURIComponent(idincontro),
    {
      method: "DELETE",
    }
  );
  const responseBody = await response.json();

  return responseBody.idincontro;
}


//PUT fai diventare qualcuno admin
export async function updateRole(idstudente, idcorso){
  const response = await fetch(
    "/api/becomeadmin",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idstudente: idstudente,
        idcorso: idcorso
      }),
    }
  );
  const responseBody = await response.json();

  return responseBody;
}

//PUT togli il ruolo di admin a qualcuno
export async function removeRole(idstudente, idcorso){
  const response = await fetch(
    "/api/removeadmin",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idstudente: idstudente,
        idcorso: idcorso
      }),
    }
  );
  const responseBody = await response.json();

  return responseBody;
}

//PUT fai diventare qualcuno admin
export async function approveRequest(idstudente,idcorso){
  const response = await fetch(
    "/api/approverequest",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idstudente: idstudente,
        idcorso: idcorso
      }),
    }
  );
  const responseBody = await response.json();

  return responseBody;
}

//DELETE member
export async function removeMember(idstudente,idcorso) {
  return await fetch("/api/removemember/" + encodeURIComponent(idstudente)+"/"+encodeURIComponent(idcorso), {
    method: "DELETE",
  });
}

//DELETE rejectRequest
export async function rejectRequest(idstudente,idcorso) {
  return await fetch("/api/rejectrequest/" + encodeURIComponent(idstudente)+"/"+encodeURIComponent(idcorso), {
    method: "DELETE",
  });
}

//DELETE course
export async function deleteCourse(courseId) {
  return await fetch("/api/deletecourse/" + encodeURIComponent(courseId), {
    method: "DELETE",
  });
}

    const API = {logIn, logOut, getAllMeet, addMeet, removeMember, rejectRequest, approveRequest, deleteCourse, removeRole, addCourse, updateRole,requestToCancelMeet, getUserInfo, getStudyGroupList,getAllStudyGroup,sendRequest, getMyStudyGroupList, getPartecipation, requestToJoinMeet,getAdministratorsByCourse,getMembersByCourse};
    export default API;