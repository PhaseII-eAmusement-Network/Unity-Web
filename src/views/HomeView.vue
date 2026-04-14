<script setup>
import { useRouter } from "vue-router";
import { PhDatabase, PhFlagCheckered, PhUsersThree } from "@phosphor-icons/vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import BaseButton from "@/components/BaseButton.vue";
import UserCard from "@/components/UserCard.vue";
import CardBox from "@/components/CardBox.vue";
import SectionTitleLine from "@/components/SectionTitleLine.vue";
import { useMainStore } from "@/stores/main";
const DOCS_URL = import.meta.env.VITE_DOCS_URL;
const router = useRouter();
const mainStore = useMainStore();
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <UserCard />
        <CardBox class="row-span-2 mt-8 mb-6">
          <h1 class="text-xl md:text-2xl">
            Welcome to the <samp>Unity</samp> Developer Platform!
          </h1>

          <p>
            If you're just now getting started, please read the
            <a
              class="text-blue-400 hover:text-blue-600"
              :href="`${DOCS_URL}/developer`"
              target="_blank"
            >
              developer docs
            </a>
          </p>
        </CardBox>

        <template v-if="mainStore.userAdmin">
          <SectionTitleLine :icon="PhDatabase" title="Internal Teams" main>
            <BaseButton
              label="Add Team"
              color="success"
              to="/team/create"
            />
          </SectionTitleLine>
          <template v-if="mainStore.adminTeams">
            <CardBox class="row-span-2 mb-6">
              <div class="grid md:grid-cols-3 gap-6">
                <span
                  v-for="team of mainStore.adminTeams"
                  :key="team.id"
                  class="flex flex-col justify-center p-4 rounded-xl bg-orchid-700 hover:bg-orchid-800 hover:cursor-pointer hover:text-shadow-orchid-100 hover:drop-shadow-xl transition-all"
                  @click="router.push(`/team/view/${team.id}`)"
                >
                  <span class="text-xl font-bold">{{ team.name }}</span>
                  <span class="text-lg">{{ team?.data?.about }}</span>
              </span>
              </div>
            </CardBox>
          </template>
          <template v-else>
            <CardBox class="row-span-2 mb-6">
              <span class="text-2xl">No teams ☹️</span>
            </CardBox>
          </template>
        </template>

        <SectionTitleLine :icon="PhUsersThree" title="My Teams" main>
          <BaseButton
            label="Add Team"
            color="success"
            to="/team/create"
          />
        </SectionTitleLine>
        <template v-if="mainStore.userTeams?.length">
          <CardBox class="row-span-2 mb-6">
            <div class="grid md:grid-cols-3 gap-6">
              <span
                v-for="team of mainStore.userTeams"
                :key="team.id"
                class="flex flex-col justify-center p-4 rounded-xl bg-orchid-700 hover:bg-orchid-800 hover:cursor-pointer hover:text-shadow-orchid-100 hover:drop-shadow-xl transition-all"
                @click="router.push(`/team/view/${team.id}`)"
              >
                <span class="text-xl font-bold">{{ team.name }}</span>
                <span class="text-lg">{{ team?.data?.about }}</span>
            </span>
            </div>
          </CardBox>
        </template>
        <template v-else>
          <CardBox class="row-span-2 mb-6">
            <span class="text-xl">No teams ☹️</span>
          </CardBox>
        </template>

        <SectionTitleLine :icon="PhUsersThree" title="Joined Teams" main />
        <template v-if="mainStore.joinedTeams?.length">
          <CardBox class="row-span-2 mb-6">
            <div class="grid md:grid-cols-3 gap-6">
              <span
                v-for="team of mainStore.joinedTeams"
                :key="team.id"
                class="flex flex-col justify-center p-4 rounded-xl bg-orchid-700 hover:bg-orchid-800 hover:cursor-pointer hover:text-shadow-orchid-100 hover:drop-shadow-xl transition-all"
                @click="router.push(`/team/view/${team.id}`)"
              >
                <span class="text-xl font-bold">{{ team.name }}</span>
                <span class="text-lg">{{ team?.data?.about }}</span>
            </span>
            </div>
          </CardBox>
        </template>
        <template v-else>
          <CardBox class="row-span-2 mb-6">
            <span class="text-xl">No teams ☹️</span>
          </CardBox>
        </template>

        <SectionTitleLine :icon="PhFlagCheckered" title="Recent Events" main />
        <CardBox class="row-span-2 mb-6">
          <div class="flex">
            <div
              class="flex flex-col justify-center p-4 rounded-xl bg-orchid-700 hover:drop-shadow-xl transition-all"
            >

            </div>
          </div>
        </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>