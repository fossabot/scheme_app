<template>
  <div class="create_shift_options_container">
    <!-- Displaying templates -->
    <ToggleSlideDown title="Your saved templates" :center="false">
      <MoreInformation slot="titleContent" index="admin" instruction="create_template" />
      <div class="flex columns" v-if="templates.length > 0" v-loading="templateLoading">
        <el-input v-model="templateNamesSearch" placeholder="Seach Templates" size="mini"></el-input>
        <ShiftTemplate
          @deleteTemplate="deleteTemplate"
          v-for="template in templates"
          :key="template._id"
          :data="template"
        />
      </div>
      <div class="flex_center" v-else>
        <p>No template found, press more information for find out more.</p>
      </div>
    </ToggleSlideDown>

    <!-- Upload content -->
    <ToggleSlideDown title="Upload new timesheet">
      <MoreInformation slot="titleContent" index="admin" instruction="upload_timesheet" />
      <div class="upload_file_container columns">
        <Title
          defaultClass="m-0"
          subtitle="Select only CSV files that must have the following rows:"
        />
        <div class="flex_center">
          <UploadFile
            readMethod="readAsText"
            @removeContent="$emit('conponentChanges',{eventname:'removeContent',eventdata:null})"
            @fileContent="$emit('conponentChanges',{eventname:'uploadFileContent',eventdata:$event})"
            :buttonConfig="{text:'Select CSV File',round:true,icon:'el-icon-top',size:'small',type:'primary'}"
          />
        </div>
      </div>
    </ToggleSlideDown>
    <div class="template_container"></div>
  </div>
</template>

<script>
import ToggleSlideDown from "@/components/ToggleSlideDown";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
import Title from "@/components/Title";
import ShiftTemplate from "./ShiftTemplate";
import MoreInformation from "@/components/MoreInformation";
import { mapState, mapActions } from "vuex";
export default {
  name: "CreateShiftOptions",
  data() {
    return {
      templates: "",
      templateNamesSearch: "",
      templateLoading: false
    };
  },

  async mounted() {
    await this.getTemplates();
  },
  mixins: [uploadContent],
  computed: {
    ...mapState(["currentUser"]),
    shiftConfig() {
      return ["name", "assigned_to", "startDate", "endDate", "shift_type"];
    }
  },
  methods: {
    ...mapActions(["request"]),
    async getTemplates() {
      try {
        this.templates = await this.request({
          method: "GET",
          url: "templates/all"
        });
        this.loadingTemplates = false;
      } catch (error) {
        this.loadingTemplates = false;
      }
    },
    async deleteTemplate({ id, elem }) {
      try {
        this.templateLoading = true;
        let deleteRequest = await this.request({
          method: "DELETE",
          url: "templates/delete",
          data: { id }
        });
        await this.getTemplates();
      } catch (error) {
        this.templateLoading = false;
      }
    }
  },
  components: {
    ToggleSlideDown,
    UploadFile,
    Title,
    ShiftTemplate,
    MoreInformation
  }
};
</script>