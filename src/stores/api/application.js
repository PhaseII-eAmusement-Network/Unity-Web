import { useMainStore } from "@/stores/main";

export async function APIGetApplication(teamId, appId) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team/${teamId}/application/${appId}`);
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error getting app:", error);
    throw error;
  }
}

export async function APIPutApplication(teamId, appData) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team/${teamId}/application`, "PUT", appData);
    const data = response?.data;

    if (data?.appId) {
      if (appData.image && appData.image instanceof File) {
        await APIUpdateApplicationImage(teamId, data.appId, appData);
      }
    }
    return data;
  } catch (error) {
    console.log("Error putting app:", error);
    throw error;
  }
}

export async function APIUpdateApplication(teamId, appId, appData) {
  const mainStore = useMainStore();

  try {
    if (appData.image && appData.image instanceof File) {
      await APIUpdateApplicationImage(teamId, appId, appData);
    }

    const response = await mainStore.callApi(`/team/${teamId}/application/${appId}`, "POST", appData);
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error updating app:", error);
    throw error;
  }
}

export async function APIUpdateApplicationImage(teamId, appId, appData) {
  const mainStore = useMainStore();
  try {
    if (appData.image && appData.image instanceof File) {
      const imageFormData = new FormData();
      imageFormData.append('file', appData.image);
      await mainStore.callApi(
        `/team/${teamId}/application/${appId}/image`, 
        "POST", 
        imageFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    }
  } catch (error) {
    console.log("Error updating app image:", error);
    throw error;
  }
}
