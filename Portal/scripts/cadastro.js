document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault()
  var nome = document.getElementById("nome").value
  var endereco = document.getElementById("endereco").value
  var telefone = document.getElementById("telefone").value
  var file = document.getElementById("foto").files[0]

  const reader = new FileReader()
  reader.onloadend = () => {
    const imageDataUrl = reader.result

    const foto = {
      nome: file.name,
      arquivo: imageDataUrl
    }

    fetch("/register", 
    {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({nome, endereco, telefone, foto})
    }).then((response) => {if(response.status === 500) {throw new Error("Falha ao salvar usuário")} return response.json()}).then(() => alert("Usuário cadastrado")).catch((err) => alert("Não foi possível cadastrar usuário: " + err))
  }

  reader.readAsDataURL(file)
})