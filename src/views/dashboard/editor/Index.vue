<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size: 20px; padding-top: 20px; display: inline-block"
          >Editor's Dashboard</span
        >
      </div>
    </div>
    <div>[{{ sideBar }}]</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
export default defineComponent({
  setup() {
    const store = useStore();
    const name = computed(() => {
      return store.state.user.name;
    });
    const avatar = computed(() => {
      return store.state.user.avatar;
    });
    const roles = computed(() => {
      return store.state.user.roles;
    });
    const sideBar = computed(() => {
      return store.state.app.sideBar;
    });

    return {
      name,
      avatar,
      roles,
      sideBar,
    };
  },
});
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;

  .info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }

  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;

    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
