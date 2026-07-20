import { useState, useEffect } from "react";

function ExemploUseEffect() {
  const [contador, setContador] = useState(0);
  const [nome, setNome] = useState("");

  console.log("Executa sempre");
  
  // O useEffect serve para executar ações quando algo acontece no componente.

  useEffect(() => {
    console.log("Componente carregado!");
  }, []); // array vazio = executa uma única vez no carregamento da página


  useEffect(() => {
    console.log("O contador mudou para:", contador);
  }, [contador]); // executa quando o contador mudar


  useEffect(() => {
    console.log("Nome digitado:", nome);
  }, [nome]); // executa quando o nome mudar

  

  return (
    <div>

      <h1>Entendendo o useEffect</h1>

      <br />
      <h4>1 - Carregamento da página</h4>

      <p>
        Abra o console do navegador.
        Ao entrar na página o useEffect é executado.
      </p>

      <br />
      <h4>2 - Alteração de estado</h4>

      <p>
        Contador: {contador}
      </p>

      <button onClick={() => setContador(contador + 1)} >
        Aumentar contador
      </button>

      <br /><br /><br />
      <h4>3 - Digitando um nome</h4>

      <input
        type="text"
        placeholder="Digite seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <p>
        Nome atual: {nome}
      </p>

    </div>
  );
}

export default ExemploUseEffect;