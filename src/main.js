import AI from "./AI.js"

const POPULATION_SIZE = 1
let population = []
let generation = 1
const lBtn = document.getElementById("btn-light")
const dBtn = document.getElementById("btn-dark")
const body = document.body

function init() {
  for (let i = 0; i < POPULATION_SIZE; i++) {
    population.push(new AI())
  }
  loop()
}

function loop() {
  let allDead = true;

  for (let agent of population) {
    if (!agent.game.isGameOver) {
      agent.think()
      allDead = false
    }
  }

  if (allDead) {
    nextGeneration();
  } else {
    let bestAgent = population[0]
    let maxScore = -1

    for(let agent of population) {
      if (!agent.game.isGameOver && agent.game.score > maxScore) {
        maxScore = agent.game.score
        bestAgent = agent
      }
    }

    if (!bestAgent) bestAgent = population[0];

    drawGame(bestAgent.game)

    setTimeout(loop, 0)
  }
}

function nextGeneration() {
  console.log(`Поколение ${generation} завершено.`)
  console.log(`Макс счет: ${population[0].score}`)

  population.sort((a, b) => b.score - a.score)

  document.getElementById('score').innerText = population[0].score
  document.getElementById('gen').innerText = `${generation}`

  let newPopulation = []

  newPopulation.push(population[0].mutate(0))

  for (let i = 1; i < POPULATION_SIZE; i++) {
    let parentIndex = Math.floor(Math.random() * 5)
    if (parentIndex >= population.length) parentIndex = 0

    let parent = population[parentIndex]
    newPopulation.push(parent.mutate(0.1))
  }

  for (let agent of population) {
    agent.dispose
  }

  population = newPopulation
  generation++

  loop()
}

function drawGame(game) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = ""

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let tile = document.createElement("div");
      tile.classList.add("tile")
      let num = game.board[r][c]

      if (num > 0) {
        tile.innerText = num
        if (num <= 8192) {
          tile.classList.add("x" + num)
        } else {
          tile.classList.add("x8192")
        }
      }
      boardDiv.appendChild(tile)
    }
  }
}

function setTheme(themeName) {
  if (themeName === "dark") {
    body.classList.add("dark")
  } else {
    body.classList.remove("dark")
  }
  localStorage.setItem("selectedTheme", themeName)
  if (themeName === "dark"){
    dBtn.classList.add("active")
    dBtn.classList.remove("active")
  } else {
    lBtn.classList.add("active")
    lBtn.classList.remove("active")
  }
}

lBtn.addEventListener("click", () => setTheme("light"))
dBtn.addEventListener("click", () => setTheme("dark"))

const savedTheme = localStorage.getItem("selectedTheme") || "light"
setTheme(savedTheme)

window.onload = init