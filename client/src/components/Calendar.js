import {
  Navbar,
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import API from "../API/APIclient";
import DatePicker from "react-datepicker";
import Meet from "../models/Meet";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import dayjs from "dayjs";
import "./Color.css";

//This is the homepage

function Calendar(props) {
  const history = useHistory();
  const [openNewMeet, setOpenNewMeet] = useState(false);
  const [courseID, setCourseID] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [datetime, setDatetime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function checkAdminGroup() {
    for (let course of props.myStudyGroupList) {
      if (
        course.id === parseInt(courseID) &&
        course.idstudente === props.user.id &&
        course.ruolo === 2
      ) {
        return true;
      }
    }
    return false;
  }

  const toLogOut = (event) => {
    event.preventDefault();
    props.logout();
    history.push("/login");
  };

  const onCourseIDChange = (event) => {
    const newVal = event.target.value;
    setCourseID(() => newVal);
  };

  const onLocationChange = (event) => {
    const newVal = event.target.value;
    setLocation(() => newVal);
  };

  const onDurationChange = (event) => {
    const newVal = event.target.value;
    setDuration(() => newVal);
  };

  const onCancel = async () => {
    setOpenNewMeet(() => false);
  };

  function findMax() {
    let mymax = 0;
    for (let c of props.allMeet) {
      if (c.idmeet > mymax) mymax = c.idmeet;
    }
    return mymax + 1;
  }

  const onSubmit = (event) => {
    event.preventDefault();

    if (location === "") {
      setErrorMessage(() => "Missing location field");
      return;
    }
    if (duration === "") {
      setErrorMessage(() => "Missing duration field");
      return;
    }
    if (courseID === "") {
      setErrorMessage(() => "Missing course ID field");
      return;
    }
    if (datetime === "") {
      setErrorMessage(() => "Missing datetime field");
      return;
    }
    if (!checkAdminGroup()) {
      setErrorMessage(() => "You are not Group admin for this  course ID");
      return;
    }

    let id = findMax();
    let newMeet = new Meet(courseID, datetime, id, duration, location, null);
    props.setRenderList(() => true);
    API.addMeet(newMeet);
    let newAllMeet = [...props.allMeet];
    newAllMeet.push(newMeet);
    props.setAllMeet(() => newAllMeet);
    setErrorMessage(() => "");
    props.setRenderList(() => true);
    setOpenNewMeet(() => false);
    return;
  };

  const onDatetimeChange = (newDate) => {
    setDatetime(() => newDate);
  };

  function isAdmin() {
    for (let c of props.allStudyGroupList) {
      if (c.idstudente === props.user.id && c.ruolo === 2) return true;
    }
    return false;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">SG Study Group</Navbar.Brand>

        <Button variant="dark" onClick={toLogOut}>
          Log Out{" "}
        </Button>
      </Navbar>
      {props.user && props.user.amministratore !== 1
        ? props.myStudyGroupList
          ? props.myStudyGroupList.map((c) => {
              if (c.richiesta === 0) {
                return (
                  <SGHead
                    key={"corso-" + c.id}
                    course={c}
                    allMeet={props.allMeet}
                    renderList={props.renderList}
                    setRenderList={props.setRenderList}
                    allStudyGroupList={props.allStudyGroupList}
                    user={props.user}
                    isAdmin={isAdmin}
                    partecipation={props.partecipation}
                    setPartecipation={props.setPartecipation}
                  ></SGHead>
                );
              }
              return null;
            })
          : null
        : props.studyGroupList
        ? props.studyGroupList.map((c) => {
            return (
              <SGHead
                key={"corso-" + c.id}
                course={c}
                allMeet={props.allMeet}
                renderList={props.renderList}
                setRenderList={props.setRenderList}
                allStudyGroupList={props.allStudyGroupList}
                user={props.user}
                isAdmin={isAdmin}
                partecipation={props.partecipation}
                setPartecipation={props.setPartecipation}
              ></SGHead>
            );
          })
        : null}
      {props.user && props.allStudyGroupList ? (
        props.user.amministratore || (isAdmin() && !openNewMeet) ? (
          <Button
            variant="success"
            onClick={() => {
              setOpenNewMeet(!openNewMeet);
            }}
          >
            New Meet
          </Button>
        ) : null
      ) : null}
      {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : ""}
      {openNewMeet ? (
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Course ID</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Course ID"
                  min={1}
                  value={courseID}
                  onChange={onCourseIDChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={onLocationChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Row} controlId="task-deadline">
                <Form.Label>Date and Time</Form.Label>
                <DatePicker
                  className="form-control fw-300"
                  selected={datetime}
                  onChange={onDatetimeChange}
                  showTimeSelect
                  isClearable
                  dateFormat="dd/MM/yyyy, hh:mm a"
                  placeholderText="No date&time set"
                  minDate={new Date()}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Duration"
                  min={1}
                  value={duration}
                  onChange={onDurationChange}
                />
              </Form.Group>
            </Col>

            <Row>
              <Col>
                <Button variant="success" type="submit" onClick={onSubmit}>
                  Submit
                </Button>{" "}
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Row>
        </Form>
      ) : null}
    </>
  );
}

//List of meetings
function SGHead(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [meetingInModal, setMeetingInModal] = useState(null); //stato necessario per salvare il metting quando appare il modal per passare le info necessarie

  const acceptToJoin = () => {
    API.requestToJoinMeet(meetingInModal.idincontro, meetingInModal.idcorso);
    let newPartecipation = [
      ...props.partecipation,
      new Meet(
        meetingInModal.idcorso,
        null,
        meetingInModal.idincontro,
        null,
        null,
        props.user.id
      ),
    ];
    props.setPartecipation(() => newPartecipation);
    setMeetingInModal(() => meetingInModal);
    setShow(() => false);
  };
  const rejectToJoin = () => {
    setShow(() => false);
  };

  const requestToJoinMeet = async (m) => {
    props.setRenderList(() => true);
    for (let el of props.partecipation) {
      if (el.idstudente === props.user.id) {
        for (let inc of props.allMeet) {
          if (el.idincontro === inc.idincontro) {
            //console.log((dayjs(m.data)>=dayjs(inc.data) && dayjs(m.data)<=dayjs(inc.data)+inc.durata*3600000) || (dayjs(m.data)+m.durata*3600000>=dayjs(inc.data) && dayjs(m.data)+m.durata*3600000<=dayjs(inc.data)+inc.durata*3600000))
            if (
              (dayjs(m.data) >= dayjs(inc.data) &&
                dayjs(m.data) <= dayjs(inc.data) + inc.durata * 3600000) ||
              (dayjs(m.data) + m.durata * 3600000 >= dayjs(inc.data) &&
                dayjs(m.data) + m.durata * 3600000 <=
                  dayjs(inc.data) + inc.durata * 3600000)
            ) {
              console.log("stessa data");
              setMeetingInModal(() => m);
              setShow(() => true);
              return;
            }
          }
        }
      }
    }
    await API.requestToJoinMeet(m.idincontro, m.idcorso);
    let newPartecipation = [
      ...props.partecipation,
      new Meet(m.idcorso, null, m.idincontro, null, null, props.user.id),
    ];
    props.setPartecipation(() => newPartecipation);
    props.setRenderList(() => false);
  };

  const requestToCancelMeet = async (m) => {
    props.setRenderList(() => true);
    await API.requestToCancelMeet(m.idincontro);
    //locale
    let newMeeting = [...props.partecipation];
    newMeeting = newMeeting.filter(
      (el) => el.idincontro !== m.idincontro && el.idstudente !== props.user.id
    );
    props.setPartecipation(() => newMeeting);
    props.setRenderList(() => false);
  };
  //funzione grafica che  stampa il nome solo se c'è un titolo
  function checkAtLeastAMeet() {
    for (let meet of props.allMeet) {
      if (meet.idcorso === props.course.id) {
        return true;
      }
    }
    return false;
  }

  const isAdminOfCourse = (idcorso) => {
    for (let c of props.allStudyGroupList) {
      if (c.idstudente === props.user.id && c.ruolo === 2 && c.id === idcorso) {
        return true;
      }
    }
    return false;
  };

  function checkPartecipation(idincontro) {
    for (let part of props.partecipation) {
      if (part.idincontro === idincontro && part.idstudente === props.user.id)
        return true;
    }
    return false;
  }

  return (
    <>
      {props.allMeet ? (
        checkAtLeastAMeet() ? (
          <div className={props.course.colore}>{props.course.nome}</div>
        ) : null
      ) : null}

      <ListGroup>
        {props.allMeet && props.partecipation && props.allStudyGroupList
          ? props.allMeet.map((m) => {
              if (
                m.idcorso === props.course.id &&
                (dayjs().valueOf() < dayjs(m.data.valueOf()) ||
                  isAdminOfCourse(props.course.id) ||
                  props.user.amministratore === 1)
              ) {
                //se è un admin può vedere tutto
                return (
                  <ListGroupItem key={"meeting-" + m.idincontro}>
                    <Row>
                      <Col className={props.course.colore}>{m.luogo}</Col>
                      <Col className={props.course.colore}>
                        {dayjs(m.data.valueOf()).format(
                          "dddd, MMMM D, YYYY h:mm A"
                        )}
                      </Col>
                      <Col className={props.course.colore}>{m.durata}h</Col>
                      <Col className={props.course.colore}>
                        {checkPartecipation(m.idincontro) ? (
                          <Button
                            variant="danger"
                            onClick={() => requestToCancelMeet(m)}
                          >
                            {" "}
                            Cancel{" "}
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            onClick={() => requestToJoinMeet(m)}
                          >
                            {" "}
                            Join Us
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </ListGroupItem>
                );
              }
              return null;
            })
          : null}
      </ListGroup>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Be Careful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Hei! You already have a meeting that day, are you sure you want to
          join this meet too?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={acceptToJoin}>
            Yes
          </Button>
          <Button variant="danger" onClick={rejectToJoin}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Calendar;
