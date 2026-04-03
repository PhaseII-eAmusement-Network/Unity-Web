import { useMainStore } from "@/stores/main";

export async function APIOauthCallback(code) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/oauth/callback`, "POST", {
        code: code,
    });
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error loading user:", error);
    throw error;
  }
}
