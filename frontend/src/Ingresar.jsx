import React, { useState } from "react";

export default function Ingresar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [registrar, setRegistrar] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = registrar ? "register" : "login";
    const body = registrar
      ? { nombre, email, password }
      : { email, password };

    const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setMensaje("Login exitoso");
    } else {
      setMensaje(data.message || data.error || "Error en autenticación");
    }
  };

  return (
    <div className="form-container">
      <h2>{registrar ? "Registrar usuario" : "Iniciar sesión"}</h2>
      <form onSubmit={handleSubmit}>
        {registrar && (
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {registrar ? "Registrar" : "Ingresar"}
        </button>
      </form>
      <p className="mensaje">{mensaje}</p>
      <button onClick={() => setRegistrar(!registrar)}>
        {registrar ? "¿Ya tenés cuenta? Iniciar sesión" : "Crear cuenta nueva"}
      </button>
    </div>
  );
}
