export interface ICronogramaHistorico {
    estacion:   Estacion;
    horaSalida: Date;
    ruta:       Ruta;
    codigoBus:  string;
}

export enum Estacion {
    Benavides = "Benavides",
    Canada = "Canada",
    JavierPrado = "Javier Prado",
    Teran = "Teran",
}

export enum Ruta {
    Expreso1 = "Expreso1",
    Regular = "Regular",
}

