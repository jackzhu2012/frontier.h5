<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="classObj.mobile && sideBar.isOpen"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <SideBar class="sidebar-container" />
    <div :class="{ hasTagsView: showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
        <TagsView v-if="showTagsView" />
      </div>
      <AppMain />
      <RightPanel v-if="showSettings">
        <Settings />
      </RightPanel>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
} from "vue";
import { AppMain, SideBar, Settings, Navbar, TagsView } from "./components";
import { useStore } from "@/store";
import { useI18n } from "vue-i18n";
import { DeviceType } from "@/store/modules/app/state";
import { AppActionTypes } from "@/store/modules/app/action-types";
import RightPanel from "@/components/right_panel/Index.vue";
import resize from "./resize";

export default defineComponent({
  name: "Layout",
  components: {
    AppMain,
    SideBar,
    Navbar,
    TagsView,
    RightPanel,
    Settings,
  },
  setup() {
    const { t } = useI18n();
    const {
      sideBar,
      device,
      addEventListenerOnResize,
      resizeMounted,
      removeEventListenerResize,
      watchRouter,
    } = resize();
    const store = useStore();

    const state = reactive({
      handleClickOutside: () => {
        store.dispatch(AppActionTypes.ACTION_CLOSE_SIDEBAR, false);
      },
    });

    const classObj = computed(() => {
      return {
        hideSidebar: !sideBar.value.isOpen,
        openSidebar: sideBar.value.isOpen,
        withoutAnimation: sideBar.value.withoutAnimation,
        mobile: device.value === DeviceType.Mobile,
      };
    });

    const showSettings = computed(() => {
      return store.state.settings.showSettings;
    });
    const showTagsView = computed(() => {
      return store.state.settings.showTagsView;
    });
    const fixedHeader = computed(() => {
      return store.state.settings.fixedHeader;
    });
    watchRouter();
    onBeforeMount(() => {
      addEventListenerOnResize();
    });

    onMounted(() => {
      resizeMounted();
    });

    onBeforeUnmount(() => {
      removeEventListenerResize();
    });

    return {
      t,
      classObj,
      sideBar,
      showSettings,
      showTagsView,
      fixedHeader,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/mixins";
@import "@/styles/variables";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  background-color: #ffffff !important;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: $sideBarWidth !important;
  }

  .sidebar-container {
    width: $sideBarWidth;
  }

  .fixed-header {
    width: calc(100% - 54px);
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>