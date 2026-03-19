<script setup>
import { computed, ref, watch } from "vue";
import { RouterView } from "vue-router";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";

const mainStore = useMainStore();
const styleStore = useStyleStore();
</script>

<template>
  <div>
    <RouterView
      :key="$route.path"
    />
  </div>
</template>
