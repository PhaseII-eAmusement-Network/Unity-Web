<script setup>
import CardBox from "@/components/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

</script>

<template>
  <LayoutGuest>
    <div class="flex md:min-h-screen md:items-center md:justify-center">
      <CardBox
        class="w-full md:w-auto rounded-none md:rounded-xl md:drop-shadow-xl"
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
            <p class="text-lg relative bottom-0">Please log in.</p>
          </div>
          <div class="md:border-r" />
          <div class="grid text-center">
            <h1 class="text-xl wrap-break-word max-w-md">This application uses SSO with PhaseII for authentication</h1>
            <div class="flex flex-col gap-2 my-4">
              <BaseButton label="Log in with PhaseII" color="success" to="/auth/reset" />
            </div>
          </div>
        </div>
      </CardBox>
    </div>
  </LayoutGuest>
</template>
