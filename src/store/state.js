import vars from "@/assets/_vars.scss";
export default {
  theme: localStorage.getItem("cssText"),
  client: {},
  environmentURL:
    process.env.NODE_ENV == "development"
      ? "http://localhost:7070/"
      : "https://schemeapi.now.sh/",
  token: localStorage.getItem("token"),
  currentUser: localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : {},
  globalLoader: false,
  notifications: [],
  critical_network_error: false,
  weeklyTimesheetUploaded: false,
  hasSeenNotifications: false,

  localSettings: {
    general: {
      live_schedule: true,
      live_notifications: true,
      live_dashboard: true,
      notifications: true
    },
    security: {},
    colours: {
      sidebar: vars.default
    }
  },
  viewNotificationsCenter: false,
  userNotifications: [],
  currentInterval: "",
  viewMobileMenu: false,
  defaultSize: { minFontSize: "10px", maxFontSize: "16px" },
  intervals: {
    clientInterval: null
  }
};
