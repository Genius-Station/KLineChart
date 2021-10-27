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

export default class OverlayStore {
  constructor (chartData) {
    this._chartData = chartData
    this._overlays = new Map()
  }

  add (overlay, paneId) {
    if (!this._overlays.has(paneId)) {
      this._overlays.set(paneId, new Map())
    }
    const idOverlay = this._overlays.get(paneId)
    idOverlay.set(overlay.id, overlay)
  }

  removeAll () {
    this._overlays.clear()
  }

  get (paneId) {
    return this._overlays.get(paneId) || new Map()
  }

  getByPaneIdAndId (paneId, id) {
    const paneOverlays = this._overlays.get(paneId)
    if (paneOverlays) {
      return paneOverlays.get(id)
    }
    return null
  }

  getAllOverlays() {
    const overlays = []
    this._overlays.forEach((overlay, key, map) => {
      overlays.push(...overlay.values())
    })
    return overlays
  }

  isEmpty () {
    return this._overlays.size === 0
  }
}
