import DefaultTheme from 'vitepress/theme-without-fonts'
import VersionDropdown from './components/VersionDropdown.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('VersionDropdown', VersionDropdown)
  }
}
