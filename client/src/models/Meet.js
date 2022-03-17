function Meet(
    idcorso,
    data,
    idincontro,
    durata,
    luogo,
    idstudente,
  ) {
    this.idcorso = idcorso;
    this.idstudente = idstudente;
    this.data = data;
    this.idincontro = idincontro;
    this.durata = durata;
    this.luogo = luogo;
  }
  
  export default Meet;