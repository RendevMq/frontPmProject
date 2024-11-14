// https://app.quicktype.io/

export interface IDemanda {
    id: number;
    estacionRuta: EstacionRuta;
    numeroPasajeros: number;
    hora: Date;
    dia: Dia;
    clima: Clima;
    eventoEspecial: EventoEspecial;
  }
  
  export enum Clima {
    Nublado = "Nublado",
  }
  
  export enum Dia {
    Lunes = "Lunes",
  }
  
  export interface EstacionRuta {
    id: number;
    estacion: Estacion;
    ruta: Ruta;
    numeroPasajeros: number;
  }
  
  export interface Estacion {
    codigo: EstacionCodigo;
    nombre: EstacionNombre;
    direccion: Direccion;
    estado: number;
  }
  
  export enum EstacionCodigo {
    M01 = "M01",
    M02 = "M02",
    M03 = "M03",
    M05 = "M05",
  }
  
  export enum Direccion {
    CentroDeLima = "Centro de lima",
    Chorrillos = "Chorrillos",
    Miraflores = "MIRAFLORES",
    SANIsidro = "SAN ISIDRO",
  }
  
  export enum EstacionNombre {
    Benavides = "BENAVIDES",
    Canada = "Canada",
    JavierPrado = "JAVIER PRADO",
    Teran = "Teran",
  }
  
  export interface Ruta {
    codigo: RutaCodigo;
    nombre: RutaNombre;
    descripcion: Descripcion;
    initialHour: Date;
    finalHour: Date;
  }
  
  export enum RutaCodigo {
    B = "B",
    Exp1 = "EXP1",
  }
  
  export enum Descripcion {
    ServicioExpreso = "servicio expreso",
    ServicioRegular = "servicio regular",
  }
  
  export enum RutaNombre {
    Expreso1 = "Expreso1",
    Regular = "Regular",
  }
  
  export enum EventoEspecial {
    Ninguno = "ninguno",
  }
  