export interface ICronogramaHistorico {
    codigoBus:  string;
    ruta:       Ruta;
    estacion:   Estacion;
    horaSalida: Date;
}

export enum Estacion {
    Benavides = "BENAVIDES",
    Canada = "Canada",
    JavierPrado = "JAVIER PRADO",
    Teran = "Teran",
}

export enum Ruta {
    Expreso1 = "Expreso1",
    Regular = "Regular",
}
