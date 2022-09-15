<template>
  <!--导航菜单 -->
  <div class="docked-nav-wrapper" :class="props.state.toLowerCase()">
    <button v-if="props.state === 'NORMAL'" @click="toggleState">-</button>
    <button v-if="props.state === 'MINI'" @click="toggleState">+</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { DockerPosition, DockerState } from "./types";

interface Props {
  items?: any[]; //菜单内容
  position?: DockerPosition; //位置：左或者右
  state?: DockerState; //状态
  draggable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: [],
  position: "LEFT",
  state: "NORMAL",
  draggable: false,
});

const emit = defineEmits<{
  DockerStateChanged: DockerState;
}>();

const toggleState = () => {
  emit("DockerStateChanged", props.state);
};
</script>

<style scoped>
.docked-nav-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  transition: all 300ms ease-in;
  background-color: black;
}
.docked-nav-wrapper.mini {
  width: 64px;
}
.docked-nav-wrapper.normal {
  width: 220px;
}
</style>