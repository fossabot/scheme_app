<template>
  <el-dialog :visible.sync="view">
    <Title
      title="Create Employee"
      subtitle="Fill in the form below to create an employee, the employee will recieve an email for them to finalize their account details."
      slot="title"
    />
    <el-form
      label-position="left"
      v-loading="loading"
      :model="employeeForm"
      :rules="rules"
      ref="employeeForm"
    >
      <h4 style="text-align:center" class="light m-4 grey">
        Please note that the password for the new employee will be:
        <strong>{{ genPwd }}</strong>
      </h4>
      <el-form-item
        label="Upload Multiple Employees"
        class="p-4"
        style="background:rgb(250,250,250); border-radius:10px"
      >
        <el-switch v-model="uploadMultiple"></el-switch>
        <el-collapse-transition>
          <el-form-item v-if="uploadMultiple">
            <input type="file" @change="handleChange" />
            <!-- <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :limit="1"
              :on-change="handleChange"
            >
              <p slot="tip" class="el-upload__tip m-0 p-0 ">
                Only csv files are allowed.
              </p>
              <el-button size="small" type="primary" plain
                >Click to upload</el-button
              >
            </el-upload> -->
          </el-form-item>
        </el-collapse-transition>
      </el-form-item>

      <el-form-item
        v-for="(item, index) in formItems"
        :key="index"
        :prop="item.name"
        :label="item.placeholder"
      >
        <component
          style="width:95%"
          :is="
            item.type == 'date'
              ? 'el-date-picker'
              : item.type == 'select'
              ? 'el-select'
              : 'el-input'
          "
          v-model="employeeForm[item.model || item.name]"
          :clearable="item.clearable"
          :type="item.type"
          :placeholder="
            `Please enter the employee's ${item.placeholder.toLowerCase()}.`
          "
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
          ></el-option>
        </component>
      </el-form-item>
      <!-- TODO ADD ATTACHMENTS AND DOCUMENTATION LIKE CV's  -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="validateEmployeeForm"
        >Create</el-button
      >
      <el-button round @click="$emit('toggle', false)">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CreateEmployee',
  data() {
    return {
      uploadMultiple: false,
      loading: false,
      employeeForm: {
        name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        password: '',
        employee_type: '',
        admin_gen: true,
        gender: ''
      }
    }
  },

  props: {
    display: Boolean
  },
  computed: {
    genPwd() {
      return this.employeeForm.name
        .trim()
        .toLowerCase()
        .replace(' ', '')
    },
    isoDate() {
      return this.employeeForm.date_of_birth.toISOString()
    },
    rules() {
      let rules = {}
      for (let prop in this.employeeForm) {
        rules[prop] = [
          {
            required: true,
            message: `Please enter the employee's ${prop.toLowerCase()}.`,
            trigger: 'blur'
          }
        ]
      }
      return rules
    },
    formItems() {
      return [
        {
          name: 'employeeType',
          model: 'employee_type',
          placeholder: 'Employee type',
          type: 'select',
          options: [
            {
              value: '1',
              label: 'Admin'
            },
            {
              value: '2',
              label: 'Regular Staff'
            },
            {
              value: '3',
              label: 'Locumn'
            }
          ]
        },
        {
          name: 'name',
          type: 'text',
          clearable: true,
          placeholder: 'Name',
          model: 'name'
        },
        {
          name: 'gender',
          placeholder: 'Gender',
          type: 'select',
          options: [
            {
              value: 'male',
              label: 'Male'
            },
            {
              value: 'female',
              label: 'Female'
            },
            {
              value: 'other',
              label: 'Other'
            }
          ]
        },
        {
          name: 'email',
          type: 'email',
          clearable: true,
          placeholder: 'Email'
        },
        {
          name: 'phoneNumber',
          type: 'text',
          model: 'phone_number',
          clearable: true,
          placeholder: 'Phone Number'
        },
        {
          name: 'dateOfBirth',
          model: 'date_of_birth',

          type: 'date',
          clearable: true,
          placeholder: 'Date Of Birth'
        }
      ]
    },
    view: {
      get() {
        return this.display
      },
      set(toggle) {
        this.$emit('toggle', toggle)
      }
    }
  },
  methods: {
    handleChange(event) {
      var input = event.target

      var reader = new FileReader()
      console.log(input.files[0], reader.readAsText(input.files[0]))
    },
    reset() {
      this.$set(this, 'employeeForm', {
        name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        password: '',
        employee_type: '',
        admin_gen: true,
        gender: ''
      })
    },
    ...mapActions(['request']),
    createEmployee() {
      this.loading = true
      this.employeeForm.date_of_birth = this.isoDate
      this.employeeForm.password = this.genPwd
      const payload = {
        method: 'POST',
        url: '/users/register',
        data: this.employeeForm
      }
      this.request(payload)
        .then(response => {
          this.$emit('toggle', false)
          this.loading = false
          this.reset()
        })
        .catch(error => {
          this.$emit('toggle', false)

          this.loading = false
          this.reset()
        })
    },
    validateEmployeeForm() {
      this.$refs.employeeForm.validate(valid => {
        if (valid) {
          this.createEmployee()
        }
      })
    }
  },
  components: {
    Title: () => import('@/components/Title')
  }
}
</script>

<style></style>