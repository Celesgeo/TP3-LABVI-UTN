import React, { useState } from "react";

export default function Contador() {
  const [numero, setNumero] = useState(0);

  return (
    <div>
      <h2>Contador</h2>
      <p>Valor actual: {numero}</p>
      <button onClick={() => setNumero(numero + 1)}>+</button>
      <button onClick={() => setNumero(numero - 1)}>-</button>
      <button onClick={() => setNumero(0)}>Reiniciar</button>
    </div>
  );
}
