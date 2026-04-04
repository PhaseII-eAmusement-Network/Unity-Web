<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  PhCloud,
  PhUsersThree,
  PhGear,
  PhInfo,
} from "@phosphor-icons/vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/SectionTitleLine.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import PillTag from "@/components/PillTag.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { useMainStore } from "@/stores/main";
import { APIGetTeam, APIUpdateTeam, APIPutTeamMember, APIDeleteTeamMember } from "@/stores/api/team";
const P2_URL = import.meta.env.VITE_PHASEII_BASE_URL;

const mainStore = useMainStore();
const $route = useRoute();
const $router = useRouter();
const teamId = $route.params.id;
const teamData = ref(null);
const newTeam = ref(null);
const newMember = ref(null);

onMounted(async () => {
  if (teamId) {
    await getTeam();
  } else {
    console.error("No team provided in parameters.");
  }
});

async function getTeam() {
  const response = await APIGetTeam(teamId);
  if (!response?.id) {
    window.alert('Failed to find team!')
    return;
  }
  teamData.value = response;
  newTeam.value = JSON.parse(JSON.stringify(response));
}

async function updateTeam() {
  if (newTeam.value == null) {
    return;
  }

  const formattedTeam = {
    name: newTeam.value?.name,
    about: newTeam.value?.data?.about
  }

  const response = await APIUpdateTeam(teamId, formattedTeam);

  if (response.status != "error") {
    newMember.value = null;
    getTeam();
  }
}

async function addMember() {
  if (newMember.value == null) {
    return;
  }

  const response = await APIPutTeamMember(teamId, newMember.value);

  if (response.status != "error") {
    newMember.value = null;
    getTeam();
  }
}

async function removeMember(userId) {
  if (!userId) {
    return;
  }

  const response = await APIDeleteTeamMember(teamId, userId);

  if (response?.status != "error") {
    getTeam();
  }
}

async function deleteTeam() {
  const confirmed = window.confirm(
    "Are you really?\nThis will remove all webhooks, registrations, apps, auth tokens, and more.",
  );
  if (confirmed) {
    const response = null // await APIAdminDeleteArcade(arcadeId);

    if (response?.status != "error") {
      await $router.push({
        name: "admin_arcades",
      });
    }
  }
}

const navigateToProfile = (userID) => {
  window.open(`${P2_URL}/profiles/${userID}`, '_blank');
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain v-if="teamData != null">
      <SectionTitleLine
        :icon="PhUsersThree"
        title="Team Overview"
        main
      />
      <CardBox class="row-span-2 mb-6">
        <h1 class="text-2xl font-bold">{{ teamData.name }}</h1>
        <span class="text-lg">{{ teamData?.data?.about }}</span>
      </CardBox>

      <template v-if="(teamData.owner === mainStore.userId) || (mainStore.userAdmin)">
      <SectionTitleLine :icon="PhGear" title="Team Administration" main />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardBox
            is-form
            class="lg:mb-6"
            @submit.prevent="updateTeam"
          >
            <PillTag
              color="info"
              label="General Information"
              :icon="PhInfo"
              class="mb-2"
            />
            <FormField label="Team Name">
              <FormControl
                v-model="newTeam.name"
                :input-value="newTeam.name"
                name="name"
                required
              />
            </FormField>

            <FormField label="About">
              <FormControl
                v-model="newTeam.data.about"
                name="about"
                type="textarea"
                required
              />
            </FormField>

            <div
              v-if="JSON.stringify(teamData) !== JSON.stringify(newTeam)"
              class="space-x-2 mt-6 mb-4"
            >
              <BaseButton color="success" label="Save" type="submit" />
              <BaseButton
                color="warning"
                label="Revert"
                @click="getTeam()"
              />
            </div>
            <div>
              <BaseButton
                color="danger"
                label="Delete Team"
                @click="deleteTeam()"
              />
            </div>
          </CardBox>

          <CardBox class="mb-6">
            <div class="mb-4">
              <PillTag
                color="info"
                label="Add Member"
                :icon="PhInfo"
                class="mb-2"
              />
              <form class="h-full" @submit.prevent="addMember">
                <FormField label="Username">
                  <FormControl
                    v-model="newMember"
                    name="username"
                    required
                  />
                </FormField>

                <BaseButton
                  color="success"
                  type="submit"
                  label="Add Member"
                />
              </form>
            </div>

            <BaseDivider />

            <div class="mb-4">
              <PillTag color="warning" label="Members" class="mb-4" />
              <div class="grid gap-4">
                <CardBox
                  v-for="member of teamData.members"
                  :key="member"
                  color-prop="bg-orchid-800 dark:bg-orchid-800"
                >
                  <div class="flex justify-between items-center">
                    <div class="-m-1.25 md:flex items-center gap-2">
                      <div class="w-8 md:w-12">
                        <UserAvatar
                          :username="member?.name"
                          :avatar="member?.avatar"
                        />
                      </div>
                      <h1 class="text-lg lg:text-xl font-bold">
                        {{ member?.name }}
                      </h1>
                    </div>
                    <BaseButtons>
                      <BaseButton
                        label="Open Profile"
                        color="info"
                        @click="navigateToProfile(member.id)"
                      />
                      <BaseButton
                        color="danger"
                        label="Remove"
                        @click="removeMember(member.id)"
                      />
                    </BaseButtons>
                  </div>
                </CardBox>
              </div>
            </div>
          </CardBox>
        </div>
      </template>

      <SectionTitleLine
        :icon="PhCloud"
        title="Team Applications"
        main
      >
        <BaseButton
          label="Add Application"
          color="success"
          :to="`/team/${teamData.id}/app/create`"
        />
      </SectionTitleLine>
      <CardBox class="row-span-2 mb-6">
        <h1 class="text-2xl font-bold">{{ teamData.name }}</h1>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
