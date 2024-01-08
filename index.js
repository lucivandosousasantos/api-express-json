const express = require("express")
const fs = require("fs")

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("API Express")
})

app.get("/produtos", async (req, res) => {
  const produtos = await JSON.parse(fs.readFileSync("db.json"))
  res.status(200).json(produtos)
})

app.get("/produtos/:id", async (req, res) => {
  const { id } = req.params
  const produtos = await JSON.parse(fs.readFileSync("db.json"))
  const produto = produtos.filter((item) => item.id == id)
  res.status(200).json(produto)
})

app.post("/produtos", async(req, res) => {
  const data = req.body
  const produtos = await JSON.parse(fs.readFileSync("db.json"))
  await fs.writeFileSync("db.json", JSON.stringify([...produtos, ...data]))
  res.status(201).json({message: "Produto adicionado com sucesso.", data: data})
})

app.put("/produtos/:id", async (req, res) => {
  const {id} = req.params
  const data = req.body
  const produtos = await JSON.parse(fs.readFileSync("db.json"))
  const index = produtos.findIndex((item) => item.id == id)
  produtos[index] = {...produtos[index], ...data}
  console.log(produtos[index])
  fs.writeFileSync("db.json", JSON.stringify(produtos))
  res.status(200).send("Produto atualizado com sucesso.")
})

app.delete("/produtos/:id", async (req, res) => {
  const {id} = req.params
  const produtos = await JSON.parse(fs.readFileSync("db.json"))
  const index = produtos.findIndex((item) => item.id == id)
  produtos.splice(index, 1)
  fs.writeFileSync("db.json", JSON.stringify(produtos))
  res.status(200).send("Produto excluído com sucesso.")
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
