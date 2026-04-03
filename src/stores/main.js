import { defineStore } from "pinia";
import axios from "axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    /* App Information */
    appVersion: import.meta.env.VITE_APP_VERSION,

    /* User */
    userId: null,
    userName: null,
    userEmail: null,
    userAvatar: null,
    userAdmin: false,
    userCardStyle: null,
    userData: null,
    discordRoles: null,
    userProfiles: [],
    userArcades: [],
    profiles: {},
    userCustomize: {},
    userScoreStats: {},
    userPublic: false,
    userBanned: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Loading state */
    isSaving: false,
    activeRequests: 0,
    activeSavingRequests: 0,
    errorCode: null,
    continueLoad: false,

    /* User Loaded state */
    userLoaded: false,

    /* Save news state */
    loadedNews: null,
    loadedArticles: {},
  }),
  actions: {
    setUser(payload) {
      if (payload.id) {
        this.userId = payload.id;
      }
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
      if (payload.admin) {
        this.userAdmin = payload.admin;
      }
      if (payload.public) {
        this.userPublic = payload.public;
      }
      if (payload.banned) {
        this.userBanned = payload.banned;
      }
      if (payload.data) {
        this.userData = payload.data;
      }
      if (payload.discordRoles) {
        this.discordRoles = payload.discordRoles;
      }
      if (payload.cardStyle) {
        this.userCardStyle = payload.cardStyle;
      }
      if (payload.profiles) {
        this.userProfiles = payload.profiles;
      }
      if (payload.arcades) {
        this.userArcades = payload.arcades;
      }
      if (payload.customize) {
        this.userCustomize = payload.customize;
      }
      if (payload.userScoreStats) {
        this.userScoreStats = payload.userScoreStats;
      }
    },

    fetch(sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data;
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },

    incrementLoading() {
      this.activeRequests++;
    },
    decrementLoading() {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    },
    incrementSaving() {
      this.activeSavingRequests++;
      this.isSaving = true;
      this.incrementLoading();
    },
    decrementSaving() {
      this.activeSavingRequests = Math.max(0, this.activeSavingRequests - 1);
      this.isSaving = this.activeSavingRequests > 0;
      this.decrementLoading();
    },

    async callApi(endpoint, method = "GET", data = null, extraHeaders = {}) {
      const apiServer = import.meta.env.VITE_UNITY_URL;
      const apiKey = import.meta.env.VITE_UNITY_KEY;

      if (method === "GET") {
        this.incrementLoading();
      } else if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        this.incrementSaving();
      }

      const baseHeaders = {
        "App-Auth-Key": apiKey,
      };
      const headers = { ...baseHeaders, ...extraHeaders };
      const url = `${apiServer}/v1${endpoint}`;

      const config = {
        method,
        url,
        headers,
        withCredentials: true,
      };
      if (data) config.data = data;

      try {
        const response = await axios(config);

        if (response.data.status === "error") {
          this.errorCode = response.data.error_code;
          return null;
        }

        return response.data;
      } catch (error) {
        this.errorCode = error.message || "Network Error";
        throw error;
      } finally {
        // Always decrement in finally block
        if (method === "GET") {
          this.decrementLoading();
        } else if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
          this.decrementSaving();
        }
      }
    },

    async checkUserSession() {
      try {
        const data = await this.callApi(`/auth/session`, "GET");
        return data;
      } catch (error) {
        console.log("Error checking session:", error);
        throw error;
      }
    },

    async deleteUserSession() {
      try {
        const data = await this.callApi(`/auth/session`, "DELETE");
        this.userLoaded = false;
        return data;
      } catch (error) {
        console.log("Error deleting session:", error);
        throw error;
      }
    },

    async loadUser() {
      try {
        const validSession = await this.checkUserSession();
        if (validSession && validSession.activeSession && !this.userLoaded) {
          const userId = validSession.userId;
          if (userId) {
            const response = await this.callApi(`/user`);
            var user = response.data;
            this.setUser({
              id: userId,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              admin: user.admin,
              data: user.data,
              discordRoles: user.discordRoles,
              profiles: user.profiles,
              arcades: user.arcades,
              customize: user.data?.customize,
              userScoreStats: user.scoreStats,
              public: user.public,
            });
            this.userLoaded = true;
            return true;
          }
        } else if (this.userLoaded) {
          // User cache is up to date. Don't load.
          return true;
        }
        return false;
      } catch (error) {
        console.log("Error loading user:", error);
        throw error;
      }
    },

    async getUser(userId) {
      try {
        const data = await this.callApi(`/user/${userId}`);
        return data.user;
      } catch (error) {
        console.log("Error fetching user:", error);
        throw error;
      }
    },
  },
});
