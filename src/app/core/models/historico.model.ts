export interface IEstacionesRutaDemanda {
    estacion:           Estacion;
    ruta:               Ruta;
    hora:               Date;
    buses:              number;
    pasajerosEsperando: number;
}

export enum Estacion {
    Benavides = "Benavides",
    Canada = "Canada",
    JavierPrado = "Javier Prado",
    Teran = "Teran",
}

export enum Ruta {
    B = "B",
    Exp1 = "EXP1",
}
