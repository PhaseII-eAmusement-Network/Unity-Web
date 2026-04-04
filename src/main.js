import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue';
import router from './router';
import "./css/_base.css";

const pinia = createPinia();
const defaultDocumentTitle = "Unity Web";

createApp(App).use(router).use(pinia).mount('#app')

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
