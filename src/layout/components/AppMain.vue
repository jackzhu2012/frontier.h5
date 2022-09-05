<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();

    const cachedViews = () => {
      return store.state.tagViews.cachedViews;
    };

    return {
      cachedViews,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
