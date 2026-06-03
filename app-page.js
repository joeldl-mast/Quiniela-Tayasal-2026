"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [formData, setFormData] = useState({
    nombre: '', telefono: '', tienda: '1', factura: '', campeon: '', subcampeon: '', goleador: ''
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    const { error } = await supabase.from('predicciones').insert([{
      nombre_usuario: formData.nombre,
      telefono: formData.telefono,
      tienda_origen: parseInt(formData.tienda),
      numero_factura: formData.factura.trim().toUpperCase(),
      campeon: formData.campeon,
      subcampeon: formData.subcampeon,
      goleador: formData.goleador
    }]);

    if (error) {
      if (error.code === '23505') { // Código de error de duplicado en PostgreSQL
        setMensaje({ tipo: 'error', texto: '❌ Este número de factura ya fue registrado.' });
      } else {
        setMensaje({ tipo: 'error', texto: '❌ Ocurrió un error. Intenta de nuevo.' });
      }
    } else {
      setMensaje({ tipo: 'exito', texto: '⚽ ¡Predicción registrada con éxito! Buena suerte.' });
      setFormData({ nombre: '', telefono: '', tienda: '1', factura: '', campeon: '', subcampeon: '', goleador: '' });
    }
  };

  return (
    <main style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f7f9fc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#1a365d' }}>🏆 Quiniela Mundial 2026</h1>
      <p style={{ textAlign: 'center', color: '#4a5568' }}>Registra tu factura de compra y participa por grandes premios ferreteros.</p>
      
      {mensaje.texto && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: mensaje.tipo === 'error' ? '#fed7d7' : '#c6f6d5', color: mensaje.tipo === 'error' ? '#9b2c2c' : '#22543d', fontWeight: 'bold', textAlign: 'center' }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>Nombre Completo:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>Teléfono de Contacto:
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>¿En qué ferretería compraste?:
          <select name="tienda" value={formData.tienda} onChange={handleChange} style={inputStyle}>
            <option value="1">Ferretería El Tornillo</option>
            <option value="2">Ferretería El Clavo</option>
            <option value="3">Ferremax</option>
            <option value="4">Todo Construcción</option>
            <option value="5">El Palacio del Pintor</option>
            <option value="6">Ferrecentro</option>
          </select>
        </label>
        <label>Número de Factura:
          <input type="text" name="factura" value={formData.factura} onChange={handleChange} required style={inputStyle} placeholder="Ej: FAC-12345" />
        </label>

        <h3 style={{ margin: '10px 0 5px 0', color: '#2b6cb0' }}>⚽ Tus Predicciones</h3>
        <label>País Campeón:
          <input type="text" name="campeon" value={formData.campeon} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>País Subcampeón:
          <input type="text" name="subcampeon" value={formData.subcampeon} onChange={handleChange} required style={inputStyle} />
        </label>
        <label>Goleador del Mundial:
          <input type="text" name="goleador" value={formData.goleador} onChange={handleChange} required style={inputStyle} />
        </label>

        <button type="submit" style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Enviar Predicción
        </button>
      </form>
    </main>
  );
}

const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' };
