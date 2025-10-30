export interface Rol {
    idRol: number;
    nombre: string;
    descripcion: string | null;
    estado: boolean;
}

export interface AgregarRolDto {
    nombre: string;
    descripcion?: string | null;
}

export interface ActualizarRolDto {
    nombre: string;
    descripcion?: string | null;
}

export interface RolListResult {
    page: number;
    pageSize: number;
    total: number;
    items: Rol[];
}