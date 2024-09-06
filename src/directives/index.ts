import { ClickOutside as vClickOutside } from 'element-plus'
import vResize from './resize/index'
import hightLight from './hightLight'
import type { App } from 'vue'

const directives = {
  install(app: App) {
    app.directive('resize', vResize)
    app.directive('clickOutside', vClickOutside)
    app.directive('hightLight', hightLight)
  }
}

export function setupDirectives(app: App<Element>) {
  app.use(directives)
}
