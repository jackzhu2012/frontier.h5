<template>
  <div class="app-container">
    <el-input
      v-model="inputData"
      placeholder="Please input"
      style="width: 400px; max-width: 100%"
    />
    <el-button
      type="primary"
      icon="el-icon-document"
      @click="handleClipboard(inputData, $event)"
    >
      copy
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { handleClipboard, clipboardSuccess } from "@/utils/clipboard"; // use clipboard directly

export default defineComponent({
  setup() {
    const dataMap = reactive({
      inputData: "abc",
      clipboardSuccess: clipboardSuccess,
      handleClipboard: handleClipboard,
    });

    return { ...toRefs(dataMap) };
  },
});
</script>
