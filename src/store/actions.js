import axios from "axios";
if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "http://localhost:7070/";
} else {
  axios.defaults.baseURL = "https://dev-schemapi.now.sh/";
}

const sortPayload = (state, payload) => {
  const token = state.token;
  if (token) {
    payload.headers = { authorisation: token };
  }
  return payload;
};

export default {
  checkServerHealth(context) {
    context
      .dispatch("request", {
        method: "GET",
        url: "/healthcheck"
      })
      .then(response => {
        context.commit("UPDATE_SERVER_HEALTH_STATUS", response);
      })
      .catch(error => {
        return error;
      });
  },
  updateTheme(context, content) {
    context.dispatch("request", {
      method: "POST",
      url: "clients/update",
      data: { update: content }
    });
  },

  updateSettings(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch("request", {
          method: "POST",
          url: "settings/update",
          data: context.state.localSettings
        })
        .then(response => {
          context.commit("UPDATE_NOTIFICATIONS", response);
          resolve(response);
        })
        .catch(error => {
          context.commit("UPDATE_NOTIFICATIONS", error);
          reject(error);
        });
    });
  },

  getNotifications(context) {
    context
      .dispatch("request", {
        url: "/notifications/all",
        method: "GET"
      })
      .then(response => {
        context.commit("UPDATE_USER_NOTIFICATIONS", response);
      })
      .catch(error => {
        return error;
      });
  },

  request(context, payload, disableNotification) {
    payload = sortPayload(context.state, payload);

    return axios(payload)
      .then(response => {
        response = response.data;

        if (response.hasOwnProperty("success")) {
          if (typeof response.content == "string") {
            context.commit("UPDATE_NOTIFICATIONS", {
              message: response.content,
              type: "success"
            });
          }
          return Promise.resolve(response.content);
        } else if (response.hasOwnProperty("error")) {
          return Promise.reject(response.content);
        }
      })
      .catch(error => {
        if (error.hasOwnProperty("data")) {
          error = error.data.content;
        }
        if (!disableNotification) {
          context.commit("UPDATE_NOTIFICATIONS", {
            message: error,
            type: "error"
          });
        }
        return Promise.reject(error);
      });
  }
};
