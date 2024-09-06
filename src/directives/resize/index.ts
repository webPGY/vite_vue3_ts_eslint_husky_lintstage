import type { Directive } from 'vue'
const INSTANCE_KEY = Symbol('Resize')

export interface CustomerResize extends HTMLElement {
  [INSTANCE_KEY]: {
    instance: InstanceType<any>
  }
}

const vResize: Directive<CustomerResize, boolean> = {
  mounted(el, binding) {
    const oriCur = el.style.cursor
    const bindingValue = binding.value as unknown as {
      direct: 'left' | 'right' | 'top' | 'bottom'
      min: number
      max: number
    }
    const { direct, max, min } = bindingValue
    const errmsg = 'resizable needs object value of: direct, min, max'
    const dragSize = 5
    let dragSide = ''
    let dragging = false

    if (Object.keys(bindingValue).length === 0 || typeof bindingValue !== 'object') {
      throw errmsg
    }

    el.addEventListener('mousemove', (e: MouseEvent) => {
      if (dragging) return

      if (direct === 'right' && el.offsetWidth - e.offsetX < dragSize) {
        el.style.cursor = 'col-resize'
        dragSide = 'right'
      } else if (direct === 'left' && e.offsetX < dragSize) {
        el.style.cursor = 'col-resize'
        dragSide = 'left'
      } else if (direct === 'top' && e.offsetY < dragSize) {
        el.style.cursor = 'row-resize'
        dragSide = 'top'
      } else if (direct === 'bottom' && el.offsetHeight - e.offsetY < dragSize) {
        el.style.cursor = 'row-resize'
        dragSide = 'bottom'
      } else {
        el.style.cursor = oriCur
        dragSide = ''
      }
    })

    el.addEventListener('mousedown', (e: MouseEvent) => {
      if (!dragSide) return

      dragging = true
      const cstyle = window.getComputedStyle(el)
      const width = Number.parseInt(cstyle.width)
      const height = Number.parseInt(cstyle.height)
      const elW = width > 0 ? width : el.offsetWidth
      const elH = height > 0 ? height : el.offsetHeight
      const clientX = e.clientX
      const clientY = e.clientY

      const movefun = (e: MouseEvent) => {
        e.preventDefault()
        if (['left', 'right'].includes(direct)) {
          if (e.clientX > clientX && el.offsetWidth >= min && el.offsetWidth <= max) {
            el.style.width =
              elW + (e.clientX - clientX) <= max ? elW + (e.clientX - clientX) + 'px' : max + 'px'
          }
          if (e.clientX < clientX && el.offsetWidth >= min && el.offsetWidth <= max) {
            el.style.width =
              elW - (clientX - e.clientX) >= min ? elW - (clientX - e.clientX) + 'px' : min + 'px'
          }
        }
        if (['top', 'bottom'].includes(direct)) {
          if (e.clientY > clientY && el.offsetHeight >= min && el.offsetHeight <= max) {
            el.style.height =
              elH + (e.clientY - clientY) <= max ? elH + (e.clientY - clientY) + 'px' : max + 'px'
          }
          if (e.clientY < clientY && el.offsetHeight >= min && el.offsetHeight <= max) {
            el.style.height =
              elH - (clientY - e.clientY) >= min ? elH - (clientY - e.clientY) + 'px' : min + 'px'
          }
        }
      }
      const removefun = () => {
        dragging = false
        document.removeEventListener('mousemove', movefun)
        document.removeEventListener('mouseup', removefun)
      }

      document.addEventListener('mousemove', movefun)
      document.addEventListener('mouseup', removefun)
    })
  }
}

export default vResize
