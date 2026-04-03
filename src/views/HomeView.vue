<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from "@/components/SectionMain.vue";
import UserCard from '@/components/UserCard.vue';
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
    <UserCard />
    </SectionMain>
  </LayoutAuthenticated>
</template>