export class Character {
  constructor(config) {
    const { name = '', describe = '' } = config || {}
    this.name = name
    this.describe = describe || name
    this.itemManger = new ItemManager(this)
  }

  useItem(itemName) {
    this.itemManger.use(itemName)
  }

  dropItem(itemName) {
    this.itemManger.drop(itemName)
  }
}

export class Attribute {
  constructor(config) {
    const { min = 0, max = 100 } = config || {}
    this.min = min
    this.max = max
    this.name = name
  }
}

export class Item {
  constructor(config) {
    const { name, effects = {} } = config || {}
    this.name = name
    this.effects = effects
  }
}

export class ItemManager {
  constructor(owner) {
    this.owner = owner
    this.items = new Map()
  }

  add(itemName) {
    let itemInfo = this.items.get(itemName)
    if (!itemInfo) {
      itemInfo = {
        name: itemName,
        count: 0,
      }
    }
    itemInfo.count += 1
  }

  remove(itemName) {
    let itemInfo = this.items.get(itemName)
    if (!itemInfo) return
    itemInfo.count -= 1
    return itemInfo
  }

  use(itemName) {
    const info = this.remove(itemName)
    this.owner.affect(info?.name)
  }

  drop(itemName) {
    const info = this.items.remove(itemName)
    return info?.name
  }

  destroy(itemName) {
    this.items.remove(itemName)
  }
}
