"use strict";
const db = require('./db');

exports.getStudyGroupList = () => {
    let query = "SELECT idcorso, nomecorso, crediti, colore  FROM subjects"
    return new Promise((resolve,reject) => {
    let param = [];  
        db.all(query,param,(err,rows) => {
            if(err){
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

exports.getAllStudyGroupList = () => {
  let query = "SELECT *  FROM gs"
  return new Promise((resolve,reject) => {
  let param = [];  
      db.all(query,param,(err,rows) => {
          if(err){
              reject(err);
              return;
          }
          resolve(rows);
      })
  })
}

exports.getMyStudyGroupList = (id) => {
    let query = "SELECT idcorso, nomecorso, crediti, colore, richiesta, ruolo,idstudente  FROM gs where idstudente = ?"
    return new Promise((resolve,reject) => {
    let param = [id];  
        db.all(query,param,(err,rows) => {
            if(err){
                reject(err);
                return;
            }
            resolve(rows);
        })
    })
}

exports.getPartecipation = () => {
  let query = "SELECT idstudente, idcorso, idincontro FROM partecipanti"
  return new Promise((resolve,reject) => {
  let param = [];  
      db.all(query,param,(err,rows) => {
          if(err){
              reject(err);
              return;
          }
          resolve(rows);
      })
  })
}

exports.getAllMeet = () => {
  let query = "SELECT idcorso, data, idincontro, durata, luogo FROM incontri"
  return new Promise((resolve,reject) => {
  let param = [];  
      db.all(query,param,(err,rows) => {
          if(err){
              reject(err);
              return;
          }
          resolve(rows);
      })
  })
}

exports.getAdministrators = (id) => {
  let query = "SELECT idstudente FROM gs where idcorso = ? AND ruolo = ? "
  return new Promise((resolve,reject) => {
  let param = [id,2];  
      db.all(query,param,(err,rows) => {
          if(err){
              reject(err);
              return;
          }
          resolve(rows);
      })
  })
}

exports.getMembers = (id) => {
  let query = "SELECT idstudente FROM gs where idcorso = ? "
  return new Promise((resolve,reject) => {
  let param = [id];  
      db.all(query,param,(err,rows) => {
          if(err){
              reject(err);
              return;
          }
          resolve(rows);
      })
  })
}

exports.joinMeet = (idincontro,idstudente,idcorso) => {
    return new Promise((resolve, reject) => {
  let param = [idstudente,idcorso,idincontro]
  let query = "INSERT INTO partecipanti (idstudente,idcorso,idincontro) VALUES(?,?,?);"
      db.run(query, param, (err) => {
        if (err) {
          reject(err);
        }
        resolve(idincontro);
      });
    });
  };

  exports.cancelMeet = (idincontro,idstudente) => {
    return new Promise((resolve, reject) => {
  let param = [idincontro,idstudente]
  let query = "DELETE FROM partecipanti WHERE idincontro = ? AND idstudente = ?"
      db.run(query, param, (err) => {
        if (err) {
          reject(err);
        }
        resolve(idincontro);
      });
    });
  };

  exports.makeAdmin = (idstudente,idcorso) => {
    return new Promise((resolve, reject) => {
  let param = [2,idstudente,idcorso]
  let query = "UPDATE gs SET ruolo=? WHERE idstudente =? AND idcorso=?"
      db.run(query, param, (err) => {
        if (err) {
          reject(err);
        }
        resolve(idcorso);
      });
    });
  };

  exports.approveRequest = (idstudente,idcorso) => {
    return new Promise((resolve, reject) => {
  let param = [0,idstudente,idcorso]
  let query = "UPDATE gs SET richiesta=? WHERE idstudente =? AND idcorso=?"
      db.run(query, param, (err) => {
        if (err) {
          reject(err);
        }
        resolve(idcorso);
      });
    });
  };

  exports.removeAdmin = (idstudente,idcorso) => {
    return new Promise((resolve, reject) => {
  let param = [1,idstudente,idcorso]
  let query = "UPDATE gs SET ruolo=? WHERE idstudente =? AND idcorso=?"
      db.run(query, param, (err) => {
        if (err) {
          reject(err);
        }
        resolve(idcorso);
      });
    });
  };

exports.sendRequest = (course,userid) => {
    return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO gs (idcorso,nomecorso,crediti,idstudente,ruolo,colore,richiesta) VALUES(?,?,?,?,?,?,?);";
    
        db.run(
          query,
          course.id,
          course.nome,
          course.crediti,
          userid,
          course.ruolo,
          course.colore,
          course.richiesta,
          function (err) {
            if (err) {
              reject(err);
            }
            resolve(course.id);
          }
        );
      });
}

exports.addCourse = (course) => {
  return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO subjects (idcorso,nomecorso,crediti,colore) VALUES(?,?,?,?);";
  
      db.run(
        query,
        course.id,
        course.nome,
        course.crediti,
        course.colore,
        function (err) {
          if (err) {
            reject(err);
          }
          resolve(course.id);
        }
      );
    });
}

exports.addMeet = (meet) => {
  return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO incontri (idcorso,data,durata,luogo) VALUES(?,?,?,?);";
  
      db.run(
        query,
        meet.idcorso,
        meet.data,
        meet.durata,
        meet.luogo,
        function (err) {
          if (err) {
            reject(err);
          }
          resolve(meet.id);
        }
      );
    });
}

exports.rejectRequest = (idstudente,idcorso) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM gs WHERE idstudente = ? AND idcorso = ?";

    db.run(query, [idstudente,idcorso], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.deleteCoursefromSubjects = (courseId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM subjects WHERE idcorso = ?";

    db.run(query, [courseId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.deleteCoursefromGs = (courseId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM gs WHERE idcorso = ?";

    db.run(query, [courseId], (err) => {
       if (err) {
         reject(err);
         return;
       }
      resolve();
    });
  });
};
