import moment from "moment";

export default {
  computed: {
    isNotShiftOrHoliday() {
      let shiftType = this.eventData.shift_type;
      const isAdmin = this.getIsAdmin;
      return !isAdmin && shiftType > 3;
    },
    returnTeam() {
      return this.team.map(member => {
        return {
          text: member.name,
          value: member._id
        };
      });
    },
    validationUnitController() {
      return {
        success: {
          condition:
            this.timeSheetError == false && this.fileContent.length > 0,
          text:
            "Time sheet successfully validated please submit to add timesheet."
        },
        danger: {
          text: "Time sheet validation failed.",
          condition: this.timeSheetError == true && this.fileContent.length > 0
        },
        info: {
          text: "Timesheet not selected",
          condition: this.fileContent.length <= 0
        }
      };
    },
    returnShiftTypes() {
      let shiftTypes = this.shiftTypes;
      let shiftTypeOptions = [];

      for (let property in shiftTypes) {
        let shiftTypeText = shiftTypes[property];
        const append = () => {
          shiftTypeOptions.push({
            text: shiftTypeText,
            value: parseInt(property)
          });
        };
        switch (shiftTypeText) {
          case "Normal": {
            if (this.getIsAdmin) {
              append();
            }
            break;
          }
          case "Locumn": {
            if (this.currentUser.employee_type == 3) {
              append();
            }
            break;
          }
          default: {
            append();
            break;
          }
        }
      }
      return shiftTypeOptions;
    }
  },
  methods: {
    async getEmployeeID(name) {
      if (name.trim().toLowerCase() == this.getName) {
        return this.currentUser._id;
      } else if (!this.getIsAdmin) {
        return Promise.reject(
          "You cannot have other teammate names when you are not an admin"
        );
      } else {
        let foundTeamMember = this.team.find(member => {
          return member.name == name;
        });
        if (foundTeamMember) {
          return Promise.resolve(foundTeamMember._id);
        } else {
          return Promise.reject(
            "Could not find the ID of the team members please re-enter their names correctly"
          );
        }
      }
    },

    /**
     *  Adds one week to the content
     */
    addOneWeekData(data) {
      return data.map(elem => {
        return {
          ...elem,
          startDate: moment(
            moment(elem.startDate).add(1, "week")
          ).toISOString(),
          endDate: moment(moment(elem.endDate).add(1, "week")).toISOString()
        };
      });
    },

    async requestCreateScheduleTimesheet({ timesheet }) {
      // Add the timesheet content to the schedule
      try {
        await this.request({
          method: "POST",
          url: "shifts/timesheet",
          data: { timesheet }
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async submitOneShift() {
      try {
        await this.request({
          method: "POST",
          url: "shifts/create",
          data: { ...this.eventData }
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject();
      }
    },
    // Save template
    async requestSaveTemplate({ name, content }) {
      // Make request to save the template
      try {
        await this.request({
          method: "POST",
          url: "templates/create",
          data: { name, content }
        });
        this.view = false;
        this.resetData();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * Submit with new timesheet
     */
    async submitWithTimeSheet() {
      this.loading = true;
      try {
        let { value } = await this.createMessagePrompt();
        let savedTemplate = await this.requestSaveTemplate({
          name: value,
          content: this.timeSheetData
        });
        if (savedTemplate) {
          await this.requestCreateScheduleTimesheet({
            timesheet: this.timeSheetData
          });
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.resetData();
        console.error("REQUEST ERRORS:", error);
      }
    },
    async createMessagePrompt() {
      try {
        let templateName = await this.$prompt("Save Template", {
          confirmButtonText: "Save timesheet as template",
          roundButton: true,
          inputPlaceholder: `schedule_created ${new Date()}`
        });
        return Promise.resolve(templateName);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
};
