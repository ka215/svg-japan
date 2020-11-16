const presets = [
  [
    "@babel/preset-env",
    {
      modules: false,
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      "useBuiltIns": "usage",
      "corejs": "3.6.5",
    }
  ]
]

const env = {
  test: {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          }
        },
      ]
    ],
  }
}

module.exports = { presets, env }