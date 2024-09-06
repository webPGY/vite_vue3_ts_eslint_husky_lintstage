import type { DirectiveBinding, VNode } from 'vue'
const hightLight = {
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    const { value } = binding
    if (value && typeof value === 'object') {
      const { hText, text, color } = value
      el.innerHTML = hText
        ? text.replace(new RegExp(hText, 'ig'), (t: string) => {
            return `<span style="color: ${color}">${t}</span>`
          })
        : text
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    const { value } = binding
    if (value && typeof value === 'object') {
      const { hText, text, color } = value
      el.innerHTML = hText
        ? text.replace(new RegExp(hText, 'ig'), (t: string) => {
            return `<span style="color: ${color}">${t}</span>`
          })
        : text
    }
  }
}

export default hightLight
