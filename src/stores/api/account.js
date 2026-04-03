import { useMainStore } from "@/stores/main";

export async function APIGetUser(userId) {
  const mainStore = useMainStore();

  try {
    const user = await mainStore.callApi(`/user?userId=${userId}`);
    const userData = user.data;
    const data = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      admin: userData.admin,
      data: userData.data,
      discordRoles: userData.discordRoles,
      cardStyle: "time",
      profiles: userData.profiles,
      arcades: userData.arcades,
      customize: userData.data?.customize,
      userScoreStats: userData.scoreStats,
      public: userData.public,
      banned: userData.banned,
    };
    return data;
  } catch (error) {
    console.log("Error loading user:", error);
    throw error;
  }
}
