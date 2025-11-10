import React, { useEffect, useState } from "react";
import { fetchConToken } from "./auth.jsx";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchConToken("http://localhost:3000/usuarios").then(setUsuarios);
  }, []);

  return (
    <div>
      <h2>Usuarios registrados</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>{u.nombre} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
