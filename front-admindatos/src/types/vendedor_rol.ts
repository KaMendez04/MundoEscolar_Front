export interface Vendedor_Rol {
    idVendedorRol: number;
    idVendedor: number;
    idRol: number;
}

export interface Vendedor_RolDto {
    idVendedor: number;
    idRol: number;
}

export interface VendedorRolResult {
    idVendedorRol: number;
    idVendedor: number;
    nombreVendedor: string;
    idRol: number;
    nombreRol: string;
}