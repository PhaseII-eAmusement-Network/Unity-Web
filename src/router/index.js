import { createRouter, createWebHistory } from "vue-router";

import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  {
    meta: {
      title: "Login",
    },
    path: "/auth/login",
    name: "login",
    component: () => import("@/views/Auth/LoginView.vue"),
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach(async (to) => {

  if (to.meta.requiresAuth) {
    // const validSession = await mainStore.loadUser();

    // if (!validSession) {
    //   mainStore.deleteUserSession();

    //   return {
    //     name: "login",
    //     query: { redirect: to.fullPath },
    //   };
    // }
  }

  if (to.meta.requiresAdmin) {
    // const validSession = await mainStore.loadUser();

    // if (!validSession || !mainStore.userAdmin) {
    //   console.log("You're not an admin!");
    //   window.alert("You're not an admin!");
    //   return {
    //     name: "dashboard",
    //   };
    // }
  }

  if (to.meta.requiresDev) {
    // const validSession = await mainStore.loadUser();

    // if (!validSession || !mainStore.userAdmin) {
    //   console.log("You're not a dev!");
    //   window.alert("You're not a dev!");
    //   return {
    //     name: "dashboard",
    //   };
    // }
  }

  return true;
});

export default router;
