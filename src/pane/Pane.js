/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getPixelRatio } from '../utils/canvas'
import { createElement } from '../utils/element'

export default class Pane {
  constructor (props) {
    this._height = -1
    this._container = props.container
    this._chartData = props.chartData
    this._initBefore(props)
    this._initElement()
    this._mainWidget = this._createMainWidget(this._element, props)
    this._yAxisWidget = this._createYAxisWidget(this._element, props)
  }

  _initBefore (props) {}

  _initElement () {
    this._element = createElement('div', {
      width: '100%',
      margin: '0',
      padding: '0',
      position: 'relative',
      overflow: 'hidden'
    })
    const lastElement = this._container.lastChild
    if (lastElement) {
      this._container.insertBefore(this._element, lastElement)
    } else {
      this._container.appendChild(this._element)
    }
  }

  /**
   * 创建主组件
   * @param container
   * @param props
   * @private
   */
  _createMainWidget (container, props) {}

  /**
   * 创建y轴组件
   * @param container
   * @param props
   * @private
   */
  _createYAxisWidget (container, props) {}

  /**
   * 获取宽度
   * @returns {number}
   */
  width () {
    return this._element.offsetWidth
  }

  setWidth (mainWidgetWidth, yAxisWidgetWidth) {
    this._mainWidget.setWidth(mainWidgetWidth)
    this._yAxisWidget && this._yAxisWidget.setWidth(yAxisWidgetWidth)
  }

  /**
   * 获取高度
   */
  height () {
    return this._height
  }

  /**
   * 设置临时高度
   * @param height
   */
  setHeight (height) {
    this._height = height
    this._mainWidget.setHeight(height)
    this._yAxisWidget && this._yAxisWidget.setHeight(height)
  }

  setOffsetLeft (mainWidgetOffsetLeft, yAxisWidgetOffsetLeft) {
    this._mainWidget.setOffsetLeft(mainWidgetOffsetLeft)
    this._yAxisWidget && this._yAxisWidget.setOffsetLeft(yAxisWidgetOffsetLeft)
  }

  layout () {
    if (this._element.offsetHeight !== this._height) {
      this._element.style.height = `${this._height}px`
    }
    this._mainWidget.layout()
    this._yAxisWidget && this._yAxisWidget.layout()
  }

  /**
   * 刷新
   * @param level
   */
  invalidate (level) {
    this._yAxisWidget && this._yAxisWidget.invalidate(level)
    this._mainWidget.invalidate(level)
  }

  /**
   * 将canvas转换成图片
   * @param includeOverlay
   * @return {HTMLCanvasElement}
   */
  getImage (includeOverlay) {
    const width = this._element.offsetWidth
    const height = this._element.offsetHeight
    const canvas = createElement('canvas', {
      width: `${width}px`,
      height: `${height}px`
    })
    const ctx = canvas.getContext('2d')
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    const mainWidgetElement = this._mainWidget.getElement()
    const mainWidgetWidth = mainWidgetElement.offsetWidth
    const mainWidgetHeight = mainWidgetElement.offsetHeight
    const mainWidgetOffsetLeft = parseInt(mainWidgetElement.style.left, 10)

    ctx.drawImage(
      this._mainWidget.getImage(includeOverlay),
      mainWidgetOffsetLeft, 0,
      mainWidgetWidth, mainWidgetHeight
    )
    if (this._yAxisWidget) {
      const yAxisWidgetElement = this._yAxisWidget.getElement()
      const yAxisWidgetWidth = yAxisWidgetElement.offsetWidth
      const yAxisWidgetHeight = yAxisWidgetElement.offsetHeight
      const yAxisWidgetOffsetLeft = parseInt(yAxisWidgetElement.style.left, 10)
      ctx.drawImage(
        this._yAxisWidget.getImage(includeOverlay),
        yAxisWidgetOffsetLeft, 0,
        yAxisWidgetWidth, yAxisWidgetHeight
      )
    }
    return canvas
  }

  /**
   * 销毁
   */
  destroy () {
    this._container.removeChild(this._element)
  }
}
