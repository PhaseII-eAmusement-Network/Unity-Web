<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import {
  PhStackPlus,
  PhTextbox,
} from "@phosphor-icons/vue";
import SectionMain from "@/components/SectionMain.vue";
import PillTag from "@/components/PillTag.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/SectionTitleLine.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useMainStore } from "@/stores/main";
import { APIPutTeam } from "@/stores/api/team";

const mainStore = useMainStore();
const router = useRouter();

const teamForm = reactive({
  name: "",
  about: "",
});

async function submitTeam() {
  const response = await APIPutTeam(teamForm);
  if (!response?.teamId) {
    window.alert('Failed to create team!')
    return;
  }
  else {
    router.push(`/team/view/${response.teamId}`)
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLine
        :icon="PhStackPlus"
        title="Create a Team"
        main
      />
      <CardBox class="row-span-2 mb-6">
        <form @submit.prevent="submitTeam">
          <PillTag color="info" label="General" class="mb-2" />
          <FormField label="Name">
            <FormControl
              v-model="teamForm.name"
              :icon="PhTextbox"
              name="name"
              required
            />
          </FormField>
          <FormField label="About">
            <FormControl
              v-model="teamForm.about"
              name="about"
              type="textarea"
              required
            />
          </FormField>
          <template v-if="mainStore.userAdmin">
            <FormField label="Internal Team">
              <FormCheckRadio 
                  v-model="teamForm.internal"
                  name="internal"
                  :input-value="teamForm.internal ?? false"
                  type="switch"
                  />
            </FormField>
          </template>
          <BaseButton
            :small="false"
            label="Submit"
            color="success"
            type="submit"
          />
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
