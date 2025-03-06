import G6 from '@antv/g6'
import '@antv/g6/build/plugin.behaviour.analysis'

let graph
let guideIndex = 0

export function init(id, width, height, data) {
  G6.registerNode('root', {
    intersectBox: 'rect', draw(item) {
      const group = item.getGraphicGroup()
      let { radius } = item.getModel()
      const { name } = item.getModel()
      if (!radius) {
        radius = 5
      }
      const shape = root(group, 0, 0, radius)
      if (name) {
        group.addShape('text', {
          attrs: {
            x: 30,
            y: 16,
            textAlign: 'center',
            textBaseline: 'middle',
            text: name,
            fill: 'black'
          }
        })
      }
      return shape
    }
  })
  G6.registerNode('node', {
    intersectBox: 'rect', draw(item) {
      const group = item.getGraphicGroup()
      let { status } = item.getModel()
      const { name, animation } = item.getModel()
      status = getStatus(data.status, status).color
      const shape = node(group, 0, 0, status)
      let text
      if (name) {
        text = group.addShape('text', {
          attrs: {
            x: 30,
            y: 16,
            textAlign: 'center',
            textBaseline: 'middle',
            text: name,
            fill: status
          }
        })
      }
      if (animation && animation === 'flicker') {
        shape.animate({ opacity: 0.5, repeat: true }, 1000, 'easeCubic', null, 0)
        if (name) {
          text.animate({ opacity: 0.5, repeat: true }, 1000, 'easeCubic', null, 0)
        }
      } else if (animation && animation === 'wave') {
        const c1 = group.addShape('path', { attrs: { path: drawRect(0, 0, 60, 30), fill: '#47B2C4', opacity: 0.7 }})
        const c2 = group.addShape('path', { attrs: { path: drawRect(0, 0, 60, 30), fill: '#2AD77E', opacity: 0.7 }})
        const c3 = group.addShape('path', { attrs: { path: drawRect(0, 0, 60, 30), fill: '#FABD60', opacity: 0.7 }})
        c1.toBack()
        c2.toBack()
        c3.toBack()
        c1.animate({ path: drawRect(-10, -10, 80, 50), opacity: 0.1, repeat: true }, 3000, 'easeCubic', null, 0)
        c2.animate({ path: drawRect(-10, -10, 80, 50), opacity: 0.1, repeat: true }, 3000, 'easeCubic', null, 1000)
        c3.animate({ path: drawRect(-10, -10, 80, 50), opacity: 0.1, repeat: true }, 3000, 'easeCubic', null, 2000)
      }
      return shape
    }
  })
  const minNode = {}; const maxNode = {}
  let nodes = data.nodes.sort((a, b) => a.x - b.x)
  minNode.x = nodes[0].x
  maxNode.x = nodes[nodes.length - 1].x
  nodes = data.nodes.sort((a, b) => a.y - b.y)
  minNode.y = nodes[0].y
  maxNode.y = nodes[nodes.length - 1].y
  G6.registerGroup('lane', {
    draw(item) {
      const group = item.getGraphicGroup()
      let { label } = item.getModel()
      const childrenBox = item.getChildrenBBox()
      if (!label) {
        label = ''
      }
      group.addShape('text', {
        attrs: {
          x: childrenBox.x + (childrenBox.width - label.length * 12) / 2,
          y: minNode.y - 30,
          text: label,
          fill: 'black'
        }
      })
      group.addShape('rect', {
        attrs: {
          width: childrenBox.width + 40,
          height: 40,
          x: childrenBox.x - 20,
          y: minNode.y - 60,
          stroke: 'black'
        }
      })
      return group.addShape('rect', {
        attrs: {
          width: childrenBox.width + 40,
          height: maxNode.y - 20,
          x: childrenBox.x - 20,
          y: minNode.y - 20,
          stroke: 'black'
        }
      })
    }
  })
  G6.registerGuide('legend', {
    draw(item) {
      const group = item.getGraphicGroup()
      const { label } = item.getModel()
      if (label) {
        const x1 = maxNode.x + 100; const y1 = minNode.y + guideIndex * 5
        group.addShape('text', { attrs: { x: x1, y: y1 + guideIndex * 50, text: '图例说明：', fill: 'black' }})
        label.forEach(item => {
          if (item.shape === 'root') {
            group.addShape('text', {
              attrs: {
                x: x1 + 70,
                y: y1 + 32 + guideIndex * 50,
                text: item.name,
                fill: 'black'
              }
            })
            root(group, x1, y1 + 10 + guideIndex * 50, 15)
          } else if (item.shape === 'node') {
            group.addShape('text', {
              attrs: {
                x: x1 + 70,
                y: y1 + 32 + guideIndex * 50,
                text: item.name,
                fill: 'black'
              }
            })
            node(group, x1, y1 + 10 + guideIndex * 50, 'black')
          }
          guideIndex++
        })
      }
    }
  })
  G6.registerGuide('states', {
    draw(item) {
      const status = data.status
      if (status !== undefined && status.length > 0) {
        const group = item.getGraphicGroup()
        const x1 = maxNode.x + 100; const y1 = minNode.y + guideIndex * 50 + 10
        group.addShape('text', { attrs: { x: x1, y: y1 + 10, text: '图例说明：', fill: 'black' }})
        let t1 = 0
        for (let i = 0; i < status.length; i++) {
          if (i % 2 === 0) {
            group.addShape('circle', {
              attrs: {
                x: x1 + 10,
                y: y1 + t1 * 50 + 25,
                r: 5,
                text: status[i].name,
                fill: status[i].color
              }
            })
            group.addShape('text', { attrs: { x: x1 + 20, y: y1 + 31 + t1 * 50, text: status[i].name, fill: 'black' }})
          } else {
            group.addShape('circle', {
              attrs: {
                x: x1 + 90 + status[i - 1].name.length * 4,
                y: y1 + t1 * 50 + 25,
                r: 5,
                text: status[i].name,
                fill: status[i].color
              }
            })
            group.addShape('text', {
              attrs: {
                x: x1 + 100 + status[i - 1].name.length * 4,
                y: y1 + 31 + t1 * 50,
                text: status[i].name,
                fill: 'black'
              }
            })
            t1++
          }
        }
        guideIndex += t1
      }
    }
  })
  graph = new G6.Graph({
    container: id,
    width: width,
    height: height,
    fitView: 'autoZoom',
    modes: { default: ['panCanvas', 'wheelZoom'] }
  })
  graph.edge({ endArrow: true })
  graph.read(data)
}

export function update(data) {
  guideIndex = 0
  const minNode = {}; const maxNode = {}
  let nodes = data.nodes.sort((a, b) => a.x - b.x)
  minNode.x = nodes[0].x
  maxNode.x = nodes[nodes.length - 1].x
  nodes = data.nodes.sort((a, b) => a.y - b.y)
  minNode.y = nodes[0].y
  maxNode.y = nodes[nodes.length - 1].y
  if (data.guides) {
    data.guides.forEach(item => {
      if (item.shape === 'states') {
        G6.registerGuide('states', {
          draw(item) {
            const status = data.status
            if (status !== undefined && status.length > 0) {
              const group = item.getGraphicGroup()
              const x1 = maxNode.x + 100; const y1 = minNode.y + guideIndex * 50 + 10
              group.addShape('text', { attrs: { x: x1, y: y1 + 10, text: '图例说明：', fill: 'black' }})
              let t1 = 0
              for (let i = 0; i < status.length; i++) {
                if (i % 2 === 0) {
                  group.addShape('circle', {
                    attrs: {
                      x: x1 + 10,
                      y: y1 + t1 * 50 + 25,
                      r: 5,
                      text: status[i].name,
                      fill: status[i].color
                    }
                  })
                  group.addShape('text', {
                    attrs: {
                      x: x1 + 20,
                      y: y1 + 31 + t1 * 50,
                      text: status[i].name,
                      fill: 'black'
                    }
                  })
                } else {
                  group.addShape('circle', {
                    attrs: {
                      x: x1 + 90 + status[i - 1].name.length * 4,
                      y: y1 + t1 * 50 + 25,
                      r: 5,
                      text: status[i].name,
                      fill: status[i].color
                    }
                  })
                  group.addShape('text', {
                    attrs: {
                      x: x1 + 100 + status[i - 1].name.length * 4,
                      y: y1 + 31 + t1 * 50,
                      text: status[i].name,
                      fill: 'black'
                    }
                  })
                  t1++
                }
              }
              guideIndex += t1
            }
          }
        })
      }
      if (item.shape === 'legend') {
        G6.registerGuide('legend', {
          draw(item) {
            const group = item.getGraphicGroup()
            const { label } = item.getModel()
            if (label) {
              const x1 = maxNode.x + 100; const y1 = minNode.y + guideIndex * 5
              group.addShape('text', { attrs: { x: x1, y: y1 + guideIndex * 50, text: '图例说明：', fill: 'black' }})
              label.forEach(item => {
                if (item.shape === 'root') {
                  group.addShape('text', {
                    attrs: {
                      x: x1 + 70,
                      y: y1 + 32 + guideIndex * 50,
                      text: item.name,
                      fill: 'black'
                    }
                  })
                  root(group, x1, y1 + 10 + guideIndex * 50, 15)
                } else if (item.shape === 'node') {
                  group.addShape('text', {
                    attrs: {
                      x: x1 + 70,
                      y: y1 + 32 + guideIndex * 50,
                      text: item.name,
                      fill: 'black'
                    }
                  })
                  node(group, x1, y1 + 10 + guideIndex * 50, 'black')
                }
                guideIndex++
              })
            }
          }
        })
      }
    })
  }
  G6.registerGroup('lane', {
    draw(item) {
      const group = item.getGraphicGroup()
      const { label } = item.getModel()
      const childrenBox = item.getChildrenBBox()
      group.addShape('text', {
        attrs: {
          x: childrenBox.x + (childrenBox.width - label.length * 12) / 2,
          y: minNode.y - 30,
          text: label,
          fill: 'black'
        }
      })
      group.addShape('rect', {
        attrs: {
          width: childrenBox.width + 40,
          height: 40,
          x: childrenBox.x - 20,
          y: minNode.y - 60,
          stroke: 'black'
        }
      })
      return group.addShape('rect', {
        attrs: {
          width: childrenBox.width + 40,
          height: maxNode.y - 20,
          x: childrenBox.x - 20,
          y: minNode.y - 20,
          stroke: 'black'
        }
      })
    }
  })
  graph.read(data)
}

function circleMath(r, x) {
  return Math.sqrt(r * r - x * x)
}

function getStatus(arr, value) {
  let re = {}
  if (value === undefined || value === '' || value === null) {
    value = 'default'
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].title === value) {
      re = arr[i]
      break
    }
  }
  if (JSON.stringify(re) === '{}') {
    re = arr[arr.length - 1]
  }
  return re
}

function node(group, X, Y, status) {
  const width = 60; const height = 30
  const path = drawRect(X, Y, width, height)
  return group.addShape('path', { attrs: { path: path, fill: 'white', stroke: status }})
}

function root(group, X, Y, radius) {
  const width = 60
  const height = 30
  const path = [['M', width / 2 + X, Y], ['L', width - radius + X, Y]]
  for (let i = 0; i <= radius; i++) {
    const y = radius - circleMath(radius, i)
    const x = width - radius + i
    path.push(['L', x + X, y + Y])
  }
  path.push(['L', width + X, height - radius + Y])
  for (let i = radius; i >= 0; i--) {
    const y = height + circleMath(radius, i) - radius
    const x = width - radius + i
    path.push(['L', x + X, y + Y])
  }
  path.push(['L', radius + X, height + Y])
  for (let i = 0; i >= -radius; i--) {
    const y = height + circleMath(radius, i) - radius
    const x = i + radius
    path.push(['L', x + X, y + Y])
  }
  path.push(['L', X, radius + Y])
  for (let i = -radius; i <= 0; i++) {
    const y = -circleMath(radius, i) + radius
    const x = i + radius
    path.push(['L', x + X, y + Y])
  }
  path.push(['Z'])
  return group.addShape('path', { attrs: { path: path, fill: '#FFCCCC', stroke: 'black' }})
}

function drawRect(X, Y, Width, Height) {
  return [['M', X, Y], ['L', Width + X, Y], ['L', Width + X, Height + Y], ['L', X, Height + Y], ['Z']]
}
