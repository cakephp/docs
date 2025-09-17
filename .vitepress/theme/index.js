import DefaultTheme from 'vitepress/theme'
import './custom.css'
import VersionDropdown from './components/VersionDropdown.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Register custom components
    app.component('VersionDropdown', VersionDropdown)
  }
}