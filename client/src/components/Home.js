import { Navbar, Button, Form, Row, Col, Alert} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import StudyGroupList from "./StudyGroupList";
import { useState } from "react";
import Course from "../models/Course";
import API from "../API/APIclient";
import './Color.css';

//This is the homepage

function Home(props) {
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(0);
  const [color, setColor] = useState("");
  const ColorList = ["","lightblue","purple", "red", "yellow", "blue", "green","brown"]
  const history = useHistory();
  const [errorMessage,setErrorMessage] = useState("");

  const toLogOut = (event) => {
    event.preventDefault();
    props.logout();
    history.push("/login");
  };

  const toCalendar = (event) => {
    event.preventDefault();
    history.push("/calendar");
  };

  const onNameChange = (event) => {
    const newVal = event.target.value;
    setName(() => newVal);
  };

  const onCreditsChange = (event) => {
    const newVal = event.target.value;
    setCredits(() => newVal);
  };

  const selectColor = (event) =>{
    const newVal = event.target.value;
    setColor(()=>newVal);

  }

  function findMax(){
    let mymax = 0
    for(let c of props.studyGroupList){
      if(c.id > mymax)
        mymax=c.id
    }
    return mymax+1
  }

  const onCancel = async() =>{
    setOpenCreate(()=>false)
  }

  const onSubmit = async (event) =>{
    event.preventDefault();
    if(name==="" || credits===0 || credits>12 || credits<1 ||color===""){
      setErrorMessage(()=>"Value of Credits not valid (max=12 min=1)")
      return null;
    }
    else {setErrorMessage(()=>"")}
    let id = findMax();
    let newCourse = new Course(id,name,credits,color)
    await API.addCourse(newCourse)
 
    let newStudyGroupList = [...props.studyGroupList]
    newStudyGroupList.push(newCourse);
    props.setStudyGroupList(()=>newStudyGroupList)
    
    setOpenCreate(()=>false)
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/"><b> SG Study Group</b></Navbar.Brand>

        <Button variant="dark" onClick={toLogOut}>
          Log Out{" "}
        </Button>

        <Button variant="dark" onClick={toCalendar}>
          {" "}
          MyCalendar{" "}
        </Button>
      </Navbar>

      {" "}
      {!props.isSGListloading ? (
        <StudyGroupList
        setStudyGroupList={props.setStudyGroupList}
          setAllStudyGroupList={props.setAllStudyGroupList}
          allStudyGroupList={props.allStudyGroupList}
          user={props.user}
          studyGroupList={props.studyGroupList}
          myStudyGroupList={props.myStudyGroupList}
          setMyStudyGroupList={props.setMyStudyGroupList}
          renderList={props.renderList}
          setRenderList={props.setRenderList}
        ></StudyGroupList>
      ) : (
        ""
      )}
      {props.user ? (
        (props.user.amministratore && !openCreate) ? (
          <Button
            variant="success"
            onClick={() => {
              setOpenCreate(!openCreate);
            }}
          >
            New Study Group
          </Button>
        ) : null
      ) : null}
      <Row></Row>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      {openCreate ? (
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Course Name"
                  value={name}
                  onChange={onNameChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Credits</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Credits"
                  max={20}
                  min={1}
                  value={credits}
                  onChange={onCreditsChange}
                />
              </Form.Group>
            </Col>
            
            <Col>
            <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
                <Form.Select aria-label="Floating label select example" onChange={selectColor}>
              {ColorList.map((c)=>{
                if(props.studyGroupList.find((el)=>el.colore===c))
                  return null
                return <option key={"color-"+c} value={c} >{c}</option>

              })}
                </Form.Select>
                </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
          <Button variant="success" type="submit" onClick={onSubmit}>
    Submit
  </Button>
  {" "}
  <Button variant="secondary" onClick={onCancel}>
    Cancel
  </Button>
  </Col>

  </Row>
        </Form>
      ) : null}
    </>
  );
}

export default Home;
