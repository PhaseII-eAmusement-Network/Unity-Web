import {
  PhUser,
  PhSignOut,
} from "@phosphor-icons/vue";

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: PhUser,
        label: "Open on PhaseII",
        to: "/profile",
      },
    ],
  },
  {
    icon: PhSignOut,
    fill: "regular",
    label: "Log out",
    isLogout: true,
  },
];
