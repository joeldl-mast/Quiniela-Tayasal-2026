"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPanel() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('predicciones')
      .select(`
        id, created_at, nombre_usuario, telefono, numero_factura, campeon, subcampeon, goleador,
        tiendas ( nombre )
      `)
      .order('created_at', { ascending: false });

    if (!error) setRegistros(data);
    setCargando(false);
  };

  if (cargando) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando registros...</p>;

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1a365d' }}>📊 Panel de Administración - Quiniela</h1>
      <p>Lista total de clientes participantes y sus facturas.</p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#2b6cb0', color: 'white', textAlign: 'left' }}>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Sucursal</th>
              <th style={thStyle}>No. Factura</th>
              <th style={thStyle}>Campeón</th>
              <th style={thStyle}>Subcampeón</th>
              <th style={thStyle}>Goleador</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((reg) => (
              <tr key={reg.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={tdStyle}>{new Date(reg.created_at).toLocaleDateString()}</td>
                <td style={tdStyle}>{reg.nombre_usuario}</td>
                <td style={tdStyle}>{reg.telefono}</td>
                <td style={tdStyle}>{reg.tiendas?.nombre || 'General'}</td>
                <td style={tdStyle, { fontWeight: 'bold', color: '#b7791f' }}>{reg.numero_factura}</td>
                <td style={tdStyle}>{reg.campeon}</td>
                <td style={tdStyle}>{reg.subcampeon}</td>
                <td style={tdStyle}>{reg.goleador}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const thStyle = { padding: '12px', border: '1px solid #cbd5e0' };
const tdStyle = { padding: '12px', border: '1px solid #e2e8f0' };
