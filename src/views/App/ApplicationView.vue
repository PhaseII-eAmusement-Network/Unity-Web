<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  PhCloud,
  PhFileImage,
  PhGear,
  PhInfo,
  PhKeyhole,
  PhLinkSimple,
  PhWebhooksLogo,
} from "@phosphor-icons/vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/SectionTitleLine.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import PillTag from "@/components/PillTag.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import { APIGetApplication, APIUpdateApplication } from "@/stores/api/application";
import { applicationIntents } from "@/constants/developer";

const P2_URL = import.meta.env.VITE_PHASEII_BASE_URL;
const CDN_URL = import.meta.env.VITE_CDN_URL;
const $route = useRoute();
const $router = useRouter();
const teamId = $route.params.teamId;
const appId = $route.params.appId;
const appData = ref(null);
const newApp = ref(null);

onMounted(async () => {
  if (appId) {
    await getApp();
  } else {
    console.error("No team provided in parameters.");
  }
});

async function getApp() {
  const response = await APIGetApplication(teamId, appId);
  if (!response?.id) {
    window.alert('Failed to find app!')
    return;
  }

  if (!response.data) {
    response.data = {}
  }

  if (!response.data.intents) {
    response.data.intents = {}
  }

  appData.value = response;
  newApp.value = JSON.parse(JSON.stringify(response));
}

async function updateApp() {
  if (newApp.value == null) {
    return;
  }

  const response = await APIUpdateApplication(teamId, appId, newApp.value);

  if (response.clientSecret) {
    window.alert(`Your X-API-Key is\n\n${response.clientSecret}\n\nPlease save this as it will not be shown again!`)
  }

  if (response.status != "error") {
    newApp.value = null;
    getApp();
  }
}

async function deleteApp() {
  const confirmed = window.confirm(
    "Are you really?\nThis will remove all webhooks, registrations, auth tokens.",
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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain v-if="appData !== null && newApp !== null">
      <SectionTitleLine
        :icon="PhCloud"
        title="Application Overview"
        main
      />
      <CardBox class="row-span-2 mb-6">
        <BaseLevel
          type="justify-around lg:justify-center md:space-x-4 lg:space-x-0"
          class="bg-white dark:bg-orchid-900/90 rounded-2xl p-3"
        >
          <img v-if="appData?.data?.img" class="rounded-full shadow-xl" :src="`${CDN_URL}/${appData?.data?.img}`" :width="150" />
          <div class="space-y-3 text-center md:text-left lg:mx-12">
            <h1 class="text-2xl font-bold">{{ appData?.name }}</h1>
            <span class="text-lg">{{ appData?.about }}</span>
          </div>
        </BaseLevel>
      </CardBox>

      <SectionTitleLine :icon="PhGear" title="App Administration" main />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardBox
            is-form
            class="lg:mb-6"
            @submit.prevent="updateApp"
          >
            <PillTag
              color="info"
              label="General Information"
              :icon="PhInfo"
              class="mb-2"
            />
            <FormField label="App Name">
              <FormControl
                v-model="newApp.name"
                :input-value="newApp?.name"
                name="name"
                required
              />
            </FormField>

            <FormField label="About">
              <FormControl
                v-model="newApp.about"
                name="about"
                type="textarea"
                required
              />
            </FormField>

            <FormField label="App Logo">
              <FormFilePicker
                v-model="newApp.image"
                label="Image Upload"
                accept="image/*"
                :icon="PhFileImage"
                required
              />
            </FormField>

            <div
              v-if="JSON.stringify(appData) !== JSON.stringify(newApp)"
              class="space-x-2 mt-6 mb-4"
            >
              <BaseButton color="success" label="Save" type="submit" />
              <BaseButton
                color="warning"
                label="Revert"
                @click="getApp()"
              />
            </div>
            <div>
              <BaseButton
                color="danger"
                label="Delete App"
                @click="deleteApp()"
              />
            </div>
          </CardBox>
          <CardBox
            is-form
            class="mb-6"
            @submit.prevent="updateApp"
          >
            <PillTag
              color="info"
              label="oAuth"
              :icon="PhKeyhole"
              class="mb-2"
            />
            <FormField label="Enable oAuth">
              <FormCheckRadio
                v-model="newApp.oauthEnable"
                :input-value="newApp?.oauthEnable"
                name="about"
                type="switch"
              />
            </FormField>

            <template v-if="newApp?.oauthEnable">
              <FormField
                label="Callback URI"
                help="The URL that the user will be redirected to from the authorization page (ex: input of https://mycoolapp.my.domain/callback/url will redirect user to https://address/callback/url?code= )"
              >
                <FormControl
                  v-model="newApp.data.callbackUri"
                  :icon="PhLinkSimple"
                  name="callback"
                  placeholder="https://my.domain/callback/url"
                />
              </FormField>

              <template v-if="appData.oauthId">
                <div class="text-md font-bold pb-4">
                  <span>Your oAuth ID is </span>
                  <a :href="`${P2_URL}/profile/authorize?client_id=${appData.oauthId}`" target="blank" class="text-orchid-100 hover:text-orchid-200 transition-colors">{{appData.oauthId}}</a>
                  <p class="font-normal">This goes in the header as <samp>X-AUTH-ID</samp>. You must send the header <samp>X-API-Key</samp> as well. This is the token you were given when you enabled oAuth. This is only given once and isn't stored so we cannot provide it again. If you forgot your token, turn oAuth off and then on again. Please note that your oAuth ID and URL will change!</p>
                </div>
                <div class="text-md font-bold pb-4">
                  <span>Your oAuth URL is </span>
                  <a :href="`${P2_URL}/profile/authorize?client_id=${appData.oauthId}`" target="blank" class="text-orchid-100 hover:text-orchid-200 transition-colors">{{P2_URL}}/profile/authorize?client_id={{appData.oauthId}}</a>
                </div>
              </template>

              <FormField
                label="Intents"
                help="Select what you'd like your app to do"
              >
                <template v-for="intent in applicationIntents" :key="intent.id">
                  <div class="grid md:flex justify-between">
                    <FormCheckRadio
                      v-model="newApp.data.intents[intent.id]"
                      :name="'intents'"
                      :label="intent.label"
                      :input-value="intent.id"
                      type="checkbox"
                    />
                    <span
                      class="text-slate-400 hover:text-slate-200 font-thin transition-all delay-0"
                    >
                      {{ intent.tip ?? "" }}
                    </span>
                  </div>
                  <hr class="border-r my-3 w-full" />
                </template>
              </FormField>
            </template>

            <div
              v-if="JSON.stringify(appData) !== JSON.stringify(newApp)"
              class="space-x-2 mt-6 mb-4"
            >
              <BaseButton color="success" label="Save" type="submit" />
              <BaseButton
                color="warning"
                label="Revert"
                @click="getApp()"
              />
            </div>
          </CardBox>
        </div>

      <SectionTitleLine
        :icon="PhWebhooksLogo"
        title="App Webhooks"
        main
      >
        <BaseButton
          label="Add Webhook"
          color="success"
          :to="`/team/${teamId}/application/${appId}/webhooks/create`"
        />
      </SectionTitleLine>
      <template v-if="appData?.webhooks?.length">
      <CardBox class="row-span-2 mb-6">
        <div class="grid grid-cols-3 gap-6">
          <div
            v-for="webhook of appData?.webhooks" :key="webhook.id"
            class="flex flex-col justify-center p-4 rounded-xl bg-orchid-700 hover:drop-shadow-xl transition-all"
          >
            <div class="mb-2 text-center">
              <h1 class="text-lg md:text-xl font-bold">
                {{ webhook.id }}
              </h1>
            </div>
          </div>
        </div>
      </CardBox>
      </template>
      <template v-else>
        <CardBox class="row-span-2 mb-6">
          <span class="text-xl">No webhooks ☹️</span>
        </CardBox>
      </template>
    </SectionMain>
  </LayoutAuthenticated>
</template>
