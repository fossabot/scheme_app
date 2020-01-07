export default {
  getNotifications(context) {
    const payload = {
      method: "GET",
      url: "/notifications/all"
    };
    context.dispatch("request", payload, { root: true }).then(response => {
      context.commit("UPDATE_USER_NOTIFICATIONS", response, { root: true });
    });
  },
  getShifts(context) {
    const payload = {
      method: "GET",
      url: "/shifts/all"
    };
    context.dispatch("request", payload, { root: true }).then(response => {
      context.commit("UPDATE_SHIFTS", response);
    });
  },

  getTeam(context) {
    const payload = {
      method: "GET",
      url: "/users/all"
    };
    context.dispatch("request", payload, { root: true }).then(response => {
      context.commit("UPDATE_TEAM", response);
    });
  }
};
