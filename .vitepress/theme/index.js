import DefaultTheme from 'vitepress/theme-without-fonts'
import VersionDropdown from './components/VersionDropdown.vue'
import PageLoader from "./components/PageLoader.vue";
import './custom.css'
import { h } from "vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('VersionDropdown', VersionDropdown)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(PageLoader),
    })
  }
}
