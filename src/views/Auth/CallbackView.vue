<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardBox from "@/components/CardBox.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { APIOauthCallback } from "@/stores/api/oauth";

const $route = useRoute();
const $router = useRouter();
const code = $route.query.code;
const redirectPath = $route.query.redirect || "/";

const userId = ref(null);

onMounted(async () => {
  if (code) {
    await getToken();
  } else {
    console.error("No code provided in query parameters.");
  }
});

async function getToken() {
  const data = await APIOauthCallback(code);
  if (data?.userId) {
    userId.value = data.userId
    $router.push(redirectPath);
  }
}

</script>

<template>
  <LayoutGuest>
    <div class="flex md:min-h-screen md:items-center md:justify-center">
      <CardBox
        class="w-full md:w-auto rounded-none md:rounded-xl md:drop-shadow-xl z-10 h-screen md:h-auto"
        has-table
        is-auth
      >
        <div
          class="p-4 flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-4"
        >
          <div class="flex flex-col items-center text-wrap h-full md:mt-5">
            <img src="/favicon.png" :width="75" class="rounded-full shadow-lg mb-2" />
            <h1 class="text-xl"><samp>Unity</samp></h1>
            <span
              class="text-sm text-gray-700 dark:text-white/75"
            >
              The PhaseII developer platform
            </span>
            <hr class="border-r my-1 w-full" />
            <p class="text-lg relative bottom-0">Please wait</p>
          </div>
          <div class="md:border-r" />
          <div class="grid text-center justify-center">
            <h1 v-if="userId" class="text-xl wrap-break-word max-w-md">Welcome back! Please wait while we make your session.</h1>
            <h1 v-else class="text-xl wrap-break-word max-w-md">OAuth verification failed! Please try again.</h1>
          </div>
        </div>
      </CardBox>
    </div>
  </LayoutGuest>
</template>
