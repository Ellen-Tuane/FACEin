document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault() 

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch("/loginUsers", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({username, password})})
      .then((response) => {
        if(response.status === 403) {
          throw new Error("Usuário e/ou senha incorretos")
        } else if (response.status === 500) {
          throw new Error("Erro do sistema.")
        }

        return response.json()
      })
      .then(() => {
        alert("Login realizado com sucesso!")
        window.location.href = "/pages/portal.html"
      })
      .catch((error) => {
        alert("Falha ao logar: " + error);
      });
  });
