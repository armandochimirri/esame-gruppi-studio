import {Table, Button, Modal, Row, Col} from 'react-bootstrap'
import API from "./../API/APIclient"
import {iconDelete} from "./Icon"
import {useState} from "react"

function StudyGroupList(props){

    return(<>
        <Table striped bordered hover variant="dark">
  {props.user?
  <thead>
    <tr>
      <th>Course Code</th>
      <th>Course Name</th>
      {props.user.amministratore === 1 ? <th>Administrators</th> : null}
      <th>Members</th>
      <th>Course Credits</th>
      <th></th>

      {props.user.amministratore === 1 ?<th></th> : null}
    </tr>
  </thead>:null
}
  <tbody>
               { 
               props.studyGroupList.map((c) =>(
                 
                    <SGItem
                    studyGroupList={props.studyGroupList}
                    setStudyGroupList={props.setStudyGroupList}
                         key={"course-" + c.id}
                         course={c}
                         myStudyGroupList={props.myStudyGroupList}
                         user={props.user}
                         allStudyGroupList={props.allStudyGroupList}
                         setAllStudyGroupList={props.setAllStudyGroupList}
                         setMyStudyGroupList={props.setMyStudyGroupList}
                         renderList={props.renderList}
                         setRenderList={props.setRenderList}
                        >
                    </SGItem>
                )) 
               }
  </tbody>
</Table>
       </> )
}

function SGItem(props){

  const [memberList,setMemberList] = useState(null)
  const [adminList,setAdminList] = useState(null)
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMember, setShowMember] = useState(false);
  

  const handleCloseAdmin = () => setShowAdmin(false);
  const handleShowAdmin = () => setShowAdmin(true);
  const handleCloseMember = () => setShowMember(false);
  const handleShowMember = () => setShowMember(true);

  const sendigRequest =async () => {
    props.setRenderList(()=>true)
    await API.sendRequest(props.course)
    props.setRenderList(()=>false)
  }
  // richiesta = 0 accettao
  //richiesta = 1 in attesa
  // no entry nel db posso mandare richiesta
  //controlla se lo studente ha mandato richiesta o meno e stampa di conseguenza il la scritta giusta
  function checkifsubscribed () {
    for( let c of props.myStudyGroupList){
      if(props.course.id === c.id && c.richiesta === 0 ){
        return (<td className = {props.course.colore}>Subscribed</td>)
      }
      if(props.course.id === c.id && c.richiesta === 1 ){
        return(<td><Button variant="secondary">Request Sent</Button></td>)
      }        
    }
    return (<td><Button variant="success" onClick={sendigRequest}>
        Request to join SG</Button></td>)
  }

  async function showAdministrator() {
    const response = await API.getAdministratorsByCourse(props.course.id)
    setAdminList(()=>response)
    handleShowAdmin();
    return(adminList)
  }

  async function showMembers() {
    const response = await API.getMembersByCourse(props.course.id)
    setMemberList(()=>response)
    handleShowMember();
    return(memberList)
  }
//se il ruolo dello studente è 1(studente) = false se è 2(amministratore gruppo) true
//mostra il bottone rimuovi membro
  function checkStudentRole(id){
    if(props.allStudyGroupList.find((el)=>(el.id===props.course.id && el.ruolo===2 && el.idstudente===id)))
      return true
    return false;
  }

  async function promoteAdmin(idstudente){
    setShowMember(()=>true)
    props.setRenderList(()=>true)
    await API.updateRole(idstudente,props.course.id)
     //questa è l'aggiornamento in locale
     let newAllStudyGroupList = props.allStudyGroupList.find((el)=>(el.id === props.course.id && el.idstudente===idstudente)) ;
     newAllStudyGroupList.ruolo = 2
     props.allStudyGroupList[props.allStudyGroupList.findIndex((el)=>(el.id === props.course.id && el.idstudente===idstudente))] = newAllStudyGroupList
    //aggiornamento del db
    setShowMember(()=>false)
    props.setRenderList(()=>false)
 }

 async function removeAdmin(idstudente){
  setShowMember(()=>true)
  props.setRenderList(()=>true)
  await API.removeRole(idstudente,props.course.id)
    //questa è l'aggiornamento in locale
    let newAllStudyGroupList = props.allStudyGroupList.find((el)=>(el.id === props.course.id && el.idstudente===idstudente)) ;
    if(newAllStudyGroupList)
    newAllStudyGroupList.ruolo = 1
    props.allStudyGroupList[props.allStudyGroupList.findIndex((el)=>(el.id === props.course.id && el.idstudente===idstudente))] = newAllStudyGroupList

   //aggiornamento del db
   setShowMember(()=>false)
   props.setRenderList(()=>false)
    return(null);
}

async function deleteCourse() {

  await API.deleteCourse(props.course.id)

  //localmente aggiorno le 3 liste e poi mando al server
  let newStudyGroupList = [...props.studyGroupList]
  newStudyGroupList = newStudyGroupList.filter((el)=>el.id!==props.course.id)
  props.setStudyGroupList(()=>newStudyGroupList)

  let newMyStudyGroupList = [...props.myStudyGroupList]
  newMyStudyGroupList = newMyStudyGroupList.filter((el)=>el.id!==props.course.id)
  props.setMyStudyGroupList(()=>newMyStudyGroupList)

  let newAllStudyGroupList = [...props.allStudyGroupList]
  newAllStudyGroupList = newAllStudyGroupList.filter((el)=>el.id!==props.course.id)
  props.setAllStudyGroupList(()=>newAllStudyGroupList)

}

const checkIfAdminGroup = () => {
  for (let gs of props.myStudyGroupList){
    if(props.course.id === gs.id && gs.ruolo === 2){
    return true
    }
  }
  return false
}

const isRequest = (idstudente) => {
  for (let gs of props.allStudyGroupList){
    if(props.course.id === gs.id && gs.idstudente === idstudente){
      if(gs.richiesta === 1)
      return true
      else return false
    }
      
  }
  return false
}

async function approveRequest (idstudente){
  props.setRenderList(()=>true)
  setShowMember(()=>true)
  await API.approveRequest(idstudente, props.course.id);
    //questa è l'aggiornamento in locale
    let newAllStudyGroupList = props.allStudyGroupList.find((el)=>(el.id === props.course.id && el.idstudente===idstudente)) ;
    newAllStudyGroupList.richiesta = 0
    props.allStudyGroupList[props.allStudyGroupList.findIndex((el)=>(el.id === props.course.id && el.idstudente===idstudente))] = newAllStudyGroupList

  setShowMember(()=>false)
  props.setRenderList(()=>false)
}

 async function rejectRequest (idstudente){
  props.setRenderList(()=>true)
  setShowMember(()=>true)
    await API.rejectRequest(idstudente, props.course.id);
    //questa è l'aggiornamento in locale
    let newAllStudyGroupList = [...props.allStudyGroupList]
    newAllStudyGroupList = newAllStudyGroupList.filter((el)=>(el.id!==props.course.id && el.idstudente!==idstudente ))
    props.setAllStudyGroupList(()=>newAllStudyGroupList)

    let newMyStudyGroupList = [...props.myStudyGroupList]
    newMyStudyGroupList = newMyStudyGroupList.filter((el)=>el.id!==props.course.id && el.idstudente!==idstudente)
    props.setMyStudyGroupList(()=>newMyStudyGroupList)

    let newMemberList = [...memberList]
    newMemberList = newMemberList.filter((el)=>el.idstudente!==idstudente)
    setMemberList(()=>newMemberList)
  setShowMember(()=>false)
  props.setRenderList(()=>false)
}

  async function removeMember(idstudente){
 props.setRenderList(()=>true)
   setShowMember(()=>true)
      await API.removeMember(idstudente, props.course.id);
     //questa è l'aggiornamento in locale
     let newAllStudyGroupList = [...props.allStudyGroupList]
     newAllStudyGroupList = newAllStudyGroupList.filter((el)=>(el.id!==props.course.id && el.idstudente!==idstudente ))
     props.setAllStudyGroupList(()=>newAllStudyGroupList)

     let newMyStudyGroupList = [...props.myStudyGroupList]
     newMyStudyGroupList = newMyStudyGroupList.filter((el)=>el.id!==props.course.id && el.idstudente!==idstudente)
     props.setMyStudyGroupList(()=>newMyStudyGroupList)

     let newMemberList = [...memberList]
     newMemberList = newMemberList.filter((el)=>el.idstudente!==idstudente)
     setMemberList(()=>newMemberList)


    setShowMember(()=>true)
    props.setRenderList(()=>false)
 }

  return(<>
  {props.user?
  <tr>
    <td className = {props.course.colore}>{props.course.id}</td>
    <td className = {props.course.colore}>{props.course.nome}</td>
    {props.user.amministratore === 1 ? <td><Button variant="link" onClick={()=>showAdministrator()}>Administrators</Button></td> : null}
    {(props.user.amministratore === 1 || checkIfAdminGroup())? <td><Button variant="link" onClick={()=>showMembers()}>Members</Button></td> : <td></td>}
    <td className = {props.course.colore}>{props.course.crediti}</td>
    {checkifsubscribed()}
    {props.user.amministratore === 1 ? <td><Button variant="outline-dark" onClick={deleteCourse}>{iconDelete}</Button></td> : null}
    
  </tr>: null
}


{/* Il modale per guardare le liste amministratori */}
{props.course ?
  <Modal show={showAdmin} onHide={handleCloseAdmin}>
        <Modal.Header closeButton>
          <Modal.Title>{props.course.nome}'s Administratos ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {adminList ? adminList.map((a)=>(
            <Row key={"admin-"+a.idstudente}>Student's ID {a.idstudente}</Row>
          )) : "Nessun Admin in Questo corso"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseAdmin}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
:null}
{/* Il modale per guardare le liste membri */}
{/* compare pure l'ID della persona loggata perchè se vuole uscire dal gruppo può cancellarsi da sola */}
{props.course?
<Modal show={showMember} onHide={handleCloseMember}  >
        <Modal.Header closeButton>
          <Modal.Title>{props.course.nome}'s Members ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           {memberList ? memberList.map((a)=>(

            <Row key={"memberlist-"+a.idstudente+" course-"+props.course.id}>
              <Col>
              Student's ID {a.idstudente}
              </Col>
              {isRequest(a.idstudente) ? 
              <>
                            <Col>
                            <Button variant="success" onClick={()=>{approveRequest(a.idstudente)}}> Approve </Button> 
                           </Col> 
                            <Col>
                            <Button variant="danger" onClick={()=>{rejectRequest(a.idstudente)}}> Reject  </Button> 
                            </Col>
                            <Row></Row>
                            </>
                             :
              checkStudentRole(a.idstudente) ? 
              <>
              <Col>
              <Button variant="outline-dark" onClick={()=>{removeMember(a.idstudente)}}>{iconDelete}</Button>
              </Col>
              {props.user.amministratore ?
              <Col>
               <Button variant="success" onClick={()=>{promoteAdmin(a.idstudente)}}> Promote </Button> 
              </Col> : null
              }
              </>
              :
              <>
              <Col>
                <Button variant="outline-dark" onClick={()=>{removeMember(a.idstudente)}}>{iconDelete}</Button> 
               </Col>
               {props.user.amministratore ? 
               <Col>
               <Button variant="danger" onClick={()=>{removeAdmin(a.idstudente)}}> Demote  </Button> 
               </Col>
               : null}
               </>}

              </Row>
          )) : <Row key={"emptyRow-"+props.user.id}></Row>} 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseMember}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
:null}

      
  </>)
}
export default StudyGroupList;