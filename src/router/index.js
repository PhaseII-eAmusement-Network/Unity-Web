import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "@/stores/main";
import HomeView from '@/views/HomeView.vue';
import CreateView from '@/views/Team/CreateView.vue';
import AppCreateView from '@/views/App/CreateView.vue';

const routes = [
  {
    meta: {
      requiresAuth: true,
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: HomeView,
  },
  {
    meta: {
      requiresAuth: true,
      title: "Create Team",
    },
    path: "/team/create",
    name: "createTeam",
    component: CreateView,
  },
  {
    meta: {
      requiresAuth: true,
      title: "Team Overview",
    },
    path: "/team/view/:id",
    name: "team",
    component: () => import("@/views/Team/TeamView.vue"),
  },
  {
    meta: {
      requiresAuth: true,
      title: "Create App",
    },
    path: "/team/:teamId/app/create",
    name: "createApp",
    component: AppCreateView,
  },
  {
    meta: {
      requiresAuth: true,
      title: "App Overview",
    },
    path: "/team/:teamId/application/view/:appId",
    name: "app",
    component: () => import("@/views/App/ApplicationView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/auth/login",
    name: "login",
    component: () => import("@/views/Auth/LoginView.vue"),
  },
  {
    meta: {
      title: "Auth Callback",
    },
    path: "/auth/callback",
    name: "callback",
    component: () => import("@/views/Auth/CallbackView.vue"),
  },
  {
    meta: {
      requiresAuth: true,
      title: "Error",
    },
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: () => import("@/views/ErrorView.vue"),
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
  const mainStore = useMainStore();
  mainStore.errorCode = null;

  if (to.meta.requiresAuth) {
    const validSession = await mainStore.loadUser();

    if (!validSession) {
      mainStore.deleteUserSession();

      return {
        name: "login",
        query: { redirect: to.fullPath },
      };
    }
  }

  if (to.meta.requiresAdmin) {
    const validSession = await mainStore.loadUser();

    if (!validSession || !mainStore.userAdmin) {
      console.log("You're not an admin!");
      window.alert("You're not an admin!");
      return {
        name: "dashboard",
      };
    }
  }

  if (to.meta.requiresDev) {
    const validSession = await mainStore.loadUser();

    if (!validSession || !mainStore.userAdmin) {
      console.log("You're not a dev!");
      window.alert("You're not a dev!");
      return {
        name: "dashboard",
      };
    }
  }

  return true;
});


export default router;
