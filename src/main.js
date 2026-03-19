import { createApp } from 'vue';
import { createPinia } from "pinia";
import './style.css';
import App from './App.vue';
import router from './router';

const pinia = createPinia();
const defaultDocumentTitle = "Unity Web";

createApp(App).use(router).use(pinia).mount('#app')

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
