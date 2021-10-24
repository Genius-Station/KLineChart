import Overlay from './Overlay'

export default class CustomOverlay extends Overlay {
  constructor ({
    id, chartData, xAxis, yAxis, drawFn
  }) {
    super({ id, chartData, xAxis, yAxis })
    this.type = 'customOverlay'

    this.drawFn = drawFn
  }

  draw (...params) {
    this.drawFn && this.drawFn(...params)
  }
}