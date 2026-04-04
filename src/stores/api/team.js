import { useMainStore } from "@/stores/main";

export async function APIGetTeam(teamId) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team/${teamId}`);
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error getting team:", error);
    throw error;
  }
}

export async function APIPutTeam(team) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team`, "PUT", team);
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error putting team:", error);
    throw error;
  }
}

export async function APIUpdateTeam(teamId, team) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team/${teamId}`, "POST", team);
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error updating team:", error);
    throw error;
  }
}

export async function APIPutTeamMember(teamId, username) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team/${teamId}/member`, "PUT", {username: username});
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error putting team member:", error);
    throw error;
  }
}

export async function APIDeleteTeamMember(teamId, userId) {
  const mainStore = useMainStore();

  try {
    const response = await mainStore.callApi(`/team/${teamId}/member`, "DELETE", {userId: userId});
    const data = response?.data;
    return data;
  } catch (error) {
    console.log("Error removing team member:", error);
    throw error;
  }
}
