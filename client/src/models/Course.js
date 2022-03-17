function Course(
    id,
    nome,
    crediti,
    colore,
    richiesta,
    ruolo,
    idstudente,
  ) {
    this.id = id;
    this.nome = nome;
    this.crediti = crediti;
    this.colore = colore;
    this.richiesta = richiesta;
    this.ruolo = ruolo;
    this.idstudente = idstudente
  }
  
  export default Course;