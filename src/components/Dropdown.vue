<template>
  <el-dropdown
    trigger="click"
    class="dropdown_container"
    @command="emitCommand"
    :placement="position"
  >
    <span class="el-dropdown-link dropdown_wrapper">
      <slot></slot>
      <i v-if="icon" class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item,index) in items"
        :disabled="item.disabled"
        :divided="item.divided"
        :command="item.command"
        :icon="item.icon"
        :key="index"
      >{{item.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    commander: Boolean,
    position: {
      type: String,
      default: "bottom-end"
    },
    icon: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => {
        return [
          {
            name: "item",
            command: "item"
          }
        ];
      }
    }
  },
  methods: {
    emitCommand(e) {
      this.$emit("method", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown_container {
  cursor: pointer;
}
.dropdown_wrapper {
  display: flex;
  align-items: center;
}
</style>