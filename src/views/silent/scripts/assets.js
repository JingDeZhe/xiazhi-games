import { Attribute } from './game'

export const genAttributes = () => {
  return {
    energy: new Attribute('活力'),
    health: new Attribute('健康'),
    mood: new Attribute('心情'),
  }
}
