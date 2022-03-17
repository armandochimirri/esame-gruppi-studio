'use strict';

const express = require('express');
const session = require("express-session"); // enable sessions
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const { check, validationResult } = require("express-validator");
const userDao = require('./user-dao');
const dao = require('./dao');
const Course = require("./models/Course");
const Meet = require("./models/Meet");


/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}



// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());
/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});


app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});


//GET studygrouplist
app.get("/api/studygrouplist",isLoggedIn,
 async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getStudyGroupList()
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getStudyGroupList failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})

//GET ALLstudygrouplist
app.get("/api/allstudygrouplist",isLoggedIn,
 async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getAllStudyGroupList()
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getAllStudyGroupList failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})

//GET mystudygrouplist
app.get("/api/mystudygrouplist",isLoggedIn,
 async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getMyStudyGroupList(req.user.id)
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getMyStudyGroupList failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})


//GET partecipation
app.get("/api/partecipation",isLoggedIn, async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getPartecipation()
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getPartecipation failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})

//GET all meeting
app.get("/api/allmeet",isLoggedIn, async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getAllMeet()
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getAllMeet failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})

//GetAdministrator by Course ID
app.get("/api/getadministrator/:courseID",isLoggedIn, async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getAdministrators(req.params.courseID)
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getAdministrators failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})

//GetMembers by Course ID
app.get("/api/getmembers/:courseID",isLoggedIn, async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try{
    const result = await dao.getMembers(req.params.courseID)
    if (result.error) res.status(404).json(result);

    return res.json(result);

  } catch (err) {
    console.log(
      "dao.getMembers failed with " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
})



//POST sending Request fo SG. It returns the courseId you requested to join
app.post(
  "/api/request",isLoggedIn,[
    check('idcorso').isInt({min: 1}),
    check('nomecorso').notEmpty(),
    check('crediti').isInt({min: 1,max:12}),
    check('colore').notEmpty(),
    check('richiesta').isInt({min:0,max:1}),
    check('ruolo').isInt({min:1,max:2})
  ],
async (req,res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(423).json({ errors: errors.array() });
  }

  const newCourseReq = new Course(
    req.body.idcorso,
    req.body.nomecorso,
    req.body.crediti,
    req.body.colore,
    req.body.richiesta,
    req.body.ruolo,
  );

  try {
    const courseId = await dao.sendRequest(newCourseReq,req.user.id);
    res.status(200).json({ courseId: courseId });
  } catch(err){
    console.error(
      "dao.sendRequest failed with: " + err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
}
);

//POST aggiungi un corso a tavola che c'è un amico in più
app.post(
  "/api/addcourse",isLoggedIn,[
    check('idcorso').isInt({min: 1}),
    check('nomecorso').notEmpty(),
    check('crediti').isInt({min: 1,max:12}),
    check('colore').notEmpty(),
  ],
async (req,res) =>{
  //serve la validazione dei dati
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(423).json({ errors: errors.array() });
  }

  const newCourseReq = new Course(
    req.body.idcorso,
    req.body.nomecorso,
    req.body.crediti,
    req.body.colore,
  );

  try {
    const courseId = await dao.addCourse(newCourseReq);
    res.status(200).json({ courseId: courseId });
  } catch(err){
    console.error(
      "dao.addCourse failed with: " + err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
}
);

//POST aggiungi un meet 
app.post(
  "/api/addmeet",isLoggedIn,[
    check('idcorso').isInt({min: 1}),
    check('idincontro').isInt({min: 1}),
    check('durata').isInt({min: 1}),
    check('luogo').notEmpty(),
  ],
async (req,res) =>{
  //serve la validazione dei dati
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(423).json({ errors: errors.array() });
  }

  const newMeet = new Meet(
    req.body.idcorso,
    req.body.data,
    req.body.idincontro,
    req.body.durata,
    req.body.luogo,
  );

  try {
    const meetId = await dao.addMeet(newMeet);
    res.status(200).json({ meetId: meetId });
  } catch(err){
    console.error(
      "dao.addMeet failed with: " + err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
}
);

//POST  mettiamo un entry in partecipanti
app.post(
  "/api/joinmeet",[
    check('idcorso').isInt({min: 1}),
    check('idincontro').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    try {
      let idincontro = await dao.joinMeet(req.body.idincontro,req.user.id,req.body.idcorso);
      res.status(200).json({ idincontro: idincontro });
    } catch (err) {
      // log error
      console.log(
        "dao.joinMeet(idincontro:",
        req.body.idincontro,
        ") failed with error: " + err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);



// PUT faccio diventare admin qualcuno in un gruppo passa da 1 a 2 il ruolo
app.put(
  "/api/becomeadmin",[
    check('idcorso').isInt({min: 1}),
    check('idstudente').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  
    try {
      let idcorso = await dao.makeAdmin(req.body.idstudente,req.body.idcorso);
      res.status(200).json({ idstudente: req.body.idstudente,idcorso:idcorso });
    } catch (err) {
      // log error
      console.log(
        "dao.makeAdmin(idcorso:",
        req.body.idcorso,
        ") failed with error: " + err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);

//Rimuove il ruolo ad un admin di un gruppo ruolo=1 
app.put(
  "/api/removeadmin",[
    check('idcorso').isInt({min: 1}),
    check('idstudente').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    try {
      let idcorso = await dao.removeAdmin(req.body.idstudente,req.body.idcorso);
      res.status(200).json({ idstudente: req.body.idstudente,idcorso:idcorso });
    } catch (err) {
      // log error
      console.log(
        "dao.removeAdmin(idcorso:",
        req.body.idcorso,
        ") failed with error: " + err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);

//PUT approve Request
app.put(
  "/api/approverequest",[
    check('idcorso').isInt({min: 1}),
    check('idstudente').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
  
    try {
      let idcorso = await dao.approveRequest(req.body.idstudente,req.body.idcorso);
      res.status(200).json({ idstudente: req.body.idstudente,idcorso:idcorso });
    } catch (err) {
      // log error
      console.log(
        "dao.approveRequest(idcorso:",
        req.body.idcorso,
        ") failed with error: " + err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);

//DELETE annullo la richiesta a un meeting
app.delete(
  "/api/cancelmeet/:idincontro",[
    check('idincontro').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    try {
      let idincontro = await dao.cancelMeet(req.params.idincontro,req.user.id);
      res.status(200).json({ idincontro: idincontro });
    } catch (err) {
      // log error
      console.log(
        "dao.cancelMeet(idincontro:",
        req.body.idincontro,
        ") failed with error: " + err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);


//DELETE request from gs
app.delete(
  "/api/rejectrequest/:idstudente/:idcorso",[
    check('idcorso').isInt({min: 1}),
    check('idstudente').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check if validation succeeds
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    try {
      await dao.rejectRequest(req.params.idstudente,req.params.idcorso);
      res.status(204).end();
    } catch (err) {
      console.error(
        "dao.deleteCourse(CourseId: " +
          req.params.courseId +
          ") failed with: " +
          err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);

//DELETE remove a member
app.delete(
  "/api/removemember/:idstudente/:idcorso",[
    check('idcorso').isInt({min: 1}),
    check('idstudente').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check if validation succeeds
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    try {
      await dao.rejectRequest(req.params.idstudente,req.params.idcorso);
      res.status(204).end();
    } catch (err) {
      console.error(
        "dao.deleteCourse(CourseId: " +
          req.params.courseId +
          ") failed with: " +
          err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);

//DELETE course
app.delete(
  "/api/deletecourse/:courseId",[
    check('courseId').isInt({min: 1}),
  ],
  isLoggedIn,
  async (req, res) => {
    // Check if validation succeeds
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    try {
      await dao.deleteCoursefromGs(req.params.courseId);
      await dao.deleteCoursefromSubjects(req.params.courseId);
      res.status(204).end();
    } catch (err) {
      console.error(
        "dao.deleteCourse(CourseId: " +
          req.params.courseId +
          ") failed with: " +
          err.message
      );
      res.status(500).json({ error: "Something wrong happened :(" });
    }
  }
);
// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});