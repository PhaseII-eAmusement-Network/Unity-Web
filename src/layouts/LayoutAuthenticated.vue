<script setup>
import {
  PhCaretDoubleLeft,
  PhDotsThreeCircle,
  PhMonitor,
  PhCrown,
  PhDiscordLogo,
  PhTextAa,
} from "@phosphor-icons/vue";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import menuNavBar from "@/menuNavBar.js";
import { useMainStore } from "@/stores/main.js";
import BaseIcon from "@/components/BaseIcon.vue";
import NavBar from "@/components/NavBar.vue";
import NavBarItemPlain from "@/components/NavBarItemPlain.vue";
import AsideMenu from "@/components/Menus/AsideMenu.vue";
import FooterBar from "@/components/FooterBar.vue";
import BaseButton from "@/components/BaseButton.vue";

const router = useRouter();
const route = useRoute();

const mainStore = useMainStore();

const userLoaded = true; //computed(() => mainStore.userLoaded);
const userCustomize = computed(() => mainStore.userCustomize);

const layoutAsidePadding = "xl:pl-60";

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

router.beforeEach(() => {
  isAsideMobileExpanded.value = false;
  isAsideLgActive.value = false;
});

const menuClick = (event, item) => {
  if (item.isLogout) {
    mainStore.deleteUserSession();
    router.push({
      name: "login",
    });
  }
};

const menuAside = computed(() => {
  // const sortedArcades = mainStore.userArcades.map((arcade) => ({
  //   label: arcade.name,
  //   to: `/arcade/${arcade.id}`,
  // }));

  const adminMenu = [
    {
      label: "Dashboard",
      to: "/admin",
    },
  ];

  var sideMenu = [{ to: "/", icon: PhMonitor, label: "Dashboard" }];

  if (mainStore.userAdmin) {
    sideMenu.push({
      label: "Admin",
      icon: PhCrown,
      menu: adminMenu,
    });
  }

  // if (sortedArcades.length) {
  //   sideMenu.push({
  //     label: "My Teams",
  //     icon: PhUsersThree,
  //     menu: sortedArcades,
  //   });
  // }

  return sideMenu;
});
</script>

<template>
  <div
    :key="route.fullPath"
    :class="{
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
    }"
  >
    <div
      v-if="userLoaded"
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen lg:w-auto bg-orchid-800 dark:text-slate-100 transition-position duration-150 ease-in-out"
    >
      <NavBar
        :menu="menuNavBar"
        :class="[
          layoutAsidePadding,
          { 'ml-60 lg:ml-0': isAsideMobileExpanded },
          'opacity-95',
        ]"
        @menu-click="menuClick"
      >
        <NavBarItemPlain
          display="flex lg:hidden"
          @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
        >
          <BaseIcon
            :icon="PhCaretDoubleLeft"
            :size="24"
            fill="bold"
            class="flex-none transition-transform duration-150 ease-in-out"
            :class="[isAsideMobileExpanded ? 'rotate-0' : 'rotate-180']"
          />
        </NavBarItemPlain>
        <NavBarItemPlain
          display="hidden lg:flex xl:hidden"
          @click.prevent="isAsideLgActive = true"
        >
          <BaseIcon :icon="PhDotsThreeCircle" size="24" />
        </NavBarItemPlain>

        <template v-if="!userCustomize.hideQuickLinks">
          <div class="h-full flex place-items-center ml-4 gap-4">
            <BaseButton
              small
              label="Discord"
              :icon="PhDiscordLogo"
              color="info"
              :href="DISCORD_URL"
              target="_blank"
            />
            <BaseButton
              small
              label="Docs"
              :icon="PhTextAa"
              color="info"
              :href="DOCS_URL"
              target="_blank"
            />
          </div>
        </template>
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />
      <div class="animated animatedFadeInUp fadeInUp">
        <slot />
        <FooterBar />
      </div>
    </div>
  </div>
</template>

<style>
/* Animation */

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 10px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@-webkit-keyframes fadeInUp {
  from {
    transform: translate3d(0, 10px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.animated {
  animation-duration: 0.7s;
  animation-fill-mode: both;
  -webkit-animation-duration: 0.7s;
  -webkit-animation-fill-mode: both;
}

.animatedFadeInUp {
  opacity: 0;
}

.fadeInUp {
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
}

.arrow {
  color: white;
}

.next-page__click-button {
  color: white;
}
</style>
