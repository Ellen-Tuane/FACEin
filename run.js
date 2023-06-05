const express = require("express");
const bodyParser = require("body-parser");
const dataUriToBuffer = require("data-uri-to-buffer")
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.use(bodyParser.json());

app.use(express.static("Portal"));

app.listen(3000, () => console.log("Servidor iniciado..."));

const fs = require("fs");

getUsers = () => {
  return JSON.parse(fs.readFileSync("logs/users.json", "utf-8"));
};

getLoginUsers = () => {
  return JSON.parse(fs.readFileSync("logs/loginUsers.json", "utf-8"));
};

saveUsersJsonFile = (usersArray) => {
  fs.writeFileSync(
    "logs/users.json",
    JSON.stringify(usersArray, null, 2),
    "utf-8"
  );
};

app.post("/register", (req, res) => {
  try {
    const body = req.body;

    const users = getUsers();

    let id = 1;

    if (users.length > 0) {
      id = users[users.length - 1].id + 1;
    }

    const usersArrayWithNewUser = [...users, { ...body, id }];

    saveUsersJsonFile(usersArrayWithNewUser);

    const buffer = dataUriToBuffer.dataUriToBuffer(body.foto.arquivo)

    fs.writeFileSync(`people/${body.foto.nome}`, buffer)

    return res.status(201).json(usersArrayWithNewUser);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
});

app.post("/loginUsers", (req, res) => {
  try {
    const users = getLoginUsers();

    if (users.length < 1) {
      return res.status(404).json({ error: "Não foram encontrados usuários" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



app.get("/users", (req, res) => {
  try {
    const users = getUsers();

    if (users.length < 1) {
      return res.status(404).json({ error: "Não foram encontrados usuários" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/register", (req, res) => {
  try {
    const body = req.body;

    const users = getUsers();

    let id = 1;

    if (users.length > 0) {
      id = users[users.length - 1].id + 1;
    }

    const usersArrayWithNewUser = [...users, { ...body, id }];

    saveUsersJsonFile(usersArrayWithNewUser);

    return res.status(201).json(usersArrayWithNewUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put("/update", (req, res) => {
  try {
    const body = req.body;

    const users = getUsers();

    const arrayWithUpdatedUser = users.map((user) => {
      if (user.id === body.id) {
        return body;
      }
      return user;
    });

    saveUsersJsonFile(arrayWithUpdatedUser);

    return res.status(204).json({});
  } catch {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/delete", (req, res) => {
  try {
    const body = req.body;

    const users = getUsers();

    const arrayWithoutTheDeletedUser = users.filter(
      (user) => Number(user.id) !== Number(body.id)
    );

    saveUsersJsonFile(arrayWithoutTheDeletedUser);

    return res.status(201).json(arrayWithoutTheDeletedUser);
  } catch {
    return res.status(500).json({ error: error.message });
  }
});
