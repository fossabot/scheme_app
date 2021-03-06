import { instructions } from "@/stubs/instructions";
export default {
  isValidClient(state, getters) {
    return Object.keys(state["client"]).length > 0;
  },
  getEmployeeTypeLabel(state) {
    let { employee_type } = state["currentUser"];
    let label;
    switch (employee_type) {
      case 1: {
        label = "Admin";
        break;
      }
      case 2: {
        label = "General Employee";
        break;
      }
      case 3: {
        label = "Locumn";
        break;
      }

      default:
        break;
    }
    return label;
  },
  getSidebarColour(state) {
    return state.localSettings.colours.sidebar;
  },
  getClient(state, getters) {
    if (getters.isValidClient) {
      return state.client;
    } else {
      return {};
    }
  },
  getPreferences(state) {
    return state.currentUser.preferences;
  },
  getContentLoaded(state) {
    return false;
  },
  getIsAdmin(state) {
    const employee_type = state.currentUser.employee_type;
    return employee_type == 1 || employee_type == "Admin";
  },
  getCompanyColours(state) {
    let colours = state.client.company_colours;
    if (colours.length > 0) {
      return colours;
    } else {
      return [];
    }
  },
  getName(state) {
    return state.currentUser.name.trim().toLowerCase();
  },
  getInstructions() {
    return instructions;
  }
};
