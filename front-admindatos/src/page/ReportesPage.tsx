import { useMiVendedor } from "../hooks/useMiVendedor";

export default function PerfilVendedor() {
  const { vendedor, loading, error } = useMiVendedor();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!vendedor) return <p>No se encontró información del vendedor.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        Bienvenido, {vendedor.nombre} {vendedor.apellido1}
      </h2>
       <p><b>Id Vendedor:</b> {vendedor.idVendedor}</p>
      <p><b>Correo:</b> {vendedor.correo}</p>
      <p><b>Teléfono:</b> {vendedor.telefono ?? "No registrado"}</p>
      <p><b>Estado:</b> {vendedor.estado ? "Activo ✅" : "Inactivo ❌"}</p>
    </div>
  );
}
