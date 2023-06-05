document
  .getElementById("btn-cadastrar")
  .addEventListener(
    "click",
    () => (window.location.href = "/pages/cadastro.html")
  );

fetch("/users")
  .then((response) => {
    if (response.status === 404) {
      throw new Error("Não foram encontrados usuários");
    }
    return response.json();
  })
  .then((data) => {
    var tableBody = document.getElementById("table-body");

    data.forEach((dadoUsuario) => {
      var newRow = document.createElement("tr");

      var id = document.createElement("td");
      id.textContent = dadoUsuario.id;
      newRow.appendChild(id);

      var nome = document.createElement("td");
      nome.textContent = dadoUsuario.nome;
      newRow.appendChild(nome);

      var endereco = document.createElement("td");
      endereco.textContent = dadoUsuario.endereco;
      newRow.appendChild(endereco);

      var telefone = document.createElement("td");
      telefone.textContent = dadoUsuario.telefone;
      newRow.appendChild(telefone);

      var foto = document.createElement("td");
      foto.textContent = dadoUsuario.foto.nome;
      newRow.appendChild(foto);

      var acoes = document.createElement("td");

      var btnApagar = document.createElement("button");
      var imgApagar = document.createElement("img");
      imgApagar.src = "../images/delete.png";
      btnApagar.classList.add("icone-apagar", "deletar");
      btnApagar.appendChild(imgApagar);
      acoes.appendChild(btnApagar);
      btnApagar.addEventListener("click", function(event) {
        var linha = event.target.closest("tr");
        var cells = Array.from(linha.cells);
        var valores = cells.map(cell => cell.textContent).slice(0, -1); // Remove o último elemento vazio
        
        var user = {
          nome: valores[1],
          endereco: valores[2],
          telefone: valores[3],
          foto: valores[4],
          id: valores[0],
        };
        
        fetch("/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
          .then((response) => {
            if (response.status === 500) {
              throw new Error("Falha ao excluir usuário");
            }
            return response.json();
          })
          .then(() => {
            alert("Usuário excluído com sucesso");
            window.location.href='/pages/portal.html'
          })
          .catch((err) => alert("Não foi possível excluir usuário: " + err));
      });
      
      newRow.appendChild(acoes);

      tableBody.appendChild(newRow);
    });
  })
  .catch((error) => alert("Falha ao obter usuários: " + error));
