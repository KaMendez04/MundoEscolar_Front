export interface Vendedor {
    idVendedor: number;
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    telefono: string | null;
    correo: string;
    clave: string;
    estado: boolean;
}

export interface VendedorPorRolDto {
    idVendedor: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    correo: string;
    estado: boolean;
}

export interface VendedorDto {
    idVendedor: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    telefono: string | null;
    correo: string;
    clave: string;
    estado: boolean;
}

export interface VendedorRol {
    idVendedor: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    telefono: string | null;
    correo: string;
    clave: string;
    estado: boolean;
    roles: string;
}

export interface VendedorPorCorreoDto {
    idVendedor: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    telefono: string | null;
    correo: string;
    clave: string;
    estado: boolean;
}

export interface AgregarVendedorDto {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    telefono: string | null;
    correo: string;
    clave: string;
}

export interface ActualizarVendedorRequest {
    nombre: string;
    apellido1: string;
    apellido2: string | null;
    telefono: string | null;
    correo: string;
    clave: string | null;
}

export interface VendedorListResult {
    items: VendedorDto[];
    total: number;
    page: number;
    pageSize: number;
}