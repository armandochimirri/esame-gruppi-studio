function Course(
    id,
    nome,
    crediti,
    colore,
    richiesta,
    ruolo,
  ) {
    this.id = id;
    this.nome = nome;
    this.crediti = crediti;
    this.colore = colore;
    this.richiesta = richiesta;
    this.ruolo = ruolo;
  }
  
module.exports = Course;