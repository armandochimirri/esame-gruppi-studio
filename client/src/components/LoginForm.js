import { Form, Button, Alert, Col, Container,Row } from 'react-bootstrap';
import { useState } from 'react';
import { iconLogin } from './Icon';
import "./Color.css"

//this is the login component, need restyle
function LoginForm(props) {
  const [username, setUsername] = useState('test@prova.it');
  const [password, setPassword] = useState('testprova');
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      // SOME VALIDATION, ADD MORE!!!
      let valid = true;
      if(username === '' || password === '' || password.length < 6){
          valid = false;
          //password troppo corta stampa alert!!
      }
      
      if(valid)
      {
        props.login(credentials);
      }
      else {
        // show a better error message...
        setErrorMessage('Error(s) in the form, please fix it.')
      }
  };

  return (
    <>
    <Container className='mw-100 container-fluid '>
      <Row>
    <div className='vheight-100 align-items-sm-center align-content-center center'>{iconLogin}</div>
    </Row>
    <Row className='center'>
    <Form  className="align-content-center"style={{width: "50%"}}>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      {props.invalid ? <Alert variant='danger'>Incorrect Username or Password</Alert> : ''}
      <Form.Group controlId='username' >
          <Form.Label>Email</Form.Label>
          <Form.Control className='fw-300' type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control className='fw-300' type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Button onClick={handleSubmit}>Login</Button>
    </Form>
    </Row>
    </Container>
    </>
    )
}

function LogoutButton(props) {
  return(
    <Col>
      <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
    </Col>
  )
}

export { LoginForm, LogoutButton };