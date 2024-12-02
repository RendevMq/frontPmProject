export interface IEstacionesRutaDemanda {
    hora:               Date;
    clima:              Clima;
    dia:                Dia;
    ruta:               Ruta;
    estacion:           Estacion;
    eventoEspecial:     EventoEspecial;
    pasajerosEsperando: number;
    buses:              number;
}

export enum Clima {
    Soleado = "Soleado",
    Templado = "Templado",
    Lluvia = "Lluvia",           // Nuevo clima
    Niebla = "Niebla",           // Nuevo clima
    Tormenta = "Tormenta",       // Nuevo clima
}

export enum Dia {
    Lunes = "Lunes",
    Martes = "Martes",           // Nuevo día
    Miércoles = "Miércoles",     // Nuevo día
    Jueves = "Jueves",           // Nuevo día
    Viernes = "Viernes",
    Sábado = "Sábado",           // Nuevo día
    Domingo = "Domingo",         // Nuevo día
}

export enum Estacion {
    Benavides = "Benavides",
    Canada = "Canada",
    JavierPrado = "Javier Prado",
    Teran = "Teran",
}

export enum EventoEspecial {
    Ninguno = "ninguno",
    Partido = "Partido",
    Concierto = "Concierto",     // Nuevo evento especial
    Feria = "Feria",             // Nuevo evento especial
    Manifestacion = "Manifestación", // Nuevo evento especial
}

export enum Ruta {
    B = "B",
    Exp1 = "EXP1",
}
