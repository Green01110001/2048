import Game2048 from "./Game2048.js";

export default class AI {
  constructor(brain = null) {
    this.game = new Game2048()
    this.score = 0

    if (brain) {
      this.brain = brain
    } else {
      this.brain = tf.sequential()
      this.brain.add(tf.layers.dense({units: 16, inputShape: [16], activation: "relu"}))
      this.brain.add(tf.layers.dense({units: 4, activation: "softmax"}))
    }
  }

  think() {
    const inputs = this.game.getNormalizedBoard()

    const output = tf.tidy(() => {
      const inputTensor = tf.tensor2d([inputs])
      const prediction = this.brain.predict(inputTensor)
      return prediction.dataSync()
    });

    let maxIndex = output.indexOf(Math.max(...output))
    const directions = ["up", "right", "down", "left"]
    let choice = directions[maxIndex]

    let result = this.game.move(choice)


    if (result.moved) {
      this.score = this.game.score
    } else {
      this.game.isGameOver = true

      this.score -= 5
    }
  }

  mutate(rate) {
    const newBrain = tf.sequential()
    const weights = this.brain.getWeights()
    const mutatedWeights = []

    for (let i = 0; i < weights.length; i++) {
      let tensor = weights[i]
      let values = tensor.dataSync().slice()
      let shape = tensor.shape

      for (let j = 0; j < values.length; j++) {
        if (Math.random() < rate) {
          let w = values[j]
          values[j] = w + (Math.random() * 2 - 1) * 0.5
          if (values[j] > 1) values[j] = 1
          if (values[j] < -1) values[j] = -1
        }
      }
      mutatedWeights.push(tf.tensor(values, shape))
    }

    newBrain.add(tf.layers.dense({units: 16, inputShape: [16], activation: "relu"}))
    newBrain.add(tf.layers.dense({units: 4, activation: "softmax"}))

    newBrain.setWeights(mutatedWeights)

    return new AI(newBrain)
  }
}