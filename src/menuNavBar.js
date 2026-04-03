import {
  PhUser,
  PhSignOut,
} from "@phosphor-icons/vue";

const P2_URL = import.meta.env.VITE_PHASEII_BASE_URL;

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: PhUser,
        label: "Open on PhaseII",
        href: `${P2_URL}/profile`,
        target: 'blank',
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
