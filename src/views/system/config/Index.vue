<!--
 * @Description:
 * @Autor: scyð
 * @Date: 2021-02-05 09:11:08
 * @LastEditors: scyð
 * @LastEditTime: 2021-02-05 10:09:09
-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item
        label="åæ°åç§°"
        prop="configName"
      >
        <el-input
          v-model="queryParams.configName"
          placeholder="è¯·è¾å¥åæ°åç§°"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="åæ°é®å"
        prop="configKey"
      >
        <el-input
          v-model="queryParams.configKey"
          placeholder="è¯·è¾å¥åæ°é®å"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="ç³»ç»åç½®"
        prop="configType"
      >
        <el-select
          v-model="queryParams.configType"
          placeholder="ç³»ç»åç½®"
          clearable
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="åå»ºæ¶é´">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="å¼å§æ¥æ"
          end-placeholder="ç»ææ¥æ"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >
          æç´¢
        </el-button>
        <el-button
          icon="el-icon-refresh"
          @click="resetQuery"
        >
          éç½®
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          @click="handleAdd"
        >
          æ°å¢
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
        >
          ä¿®æ¹
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          å é¤
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          @click="handleExport"
        >
          å¯¼åº
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          @click="handleClearCache"
        >
          æ¸çç¼å­
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      /> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="åæ°ä¸»é®"
        align="center"
        prop="configId"
      />
      <el-table-column
        label="åæ°åç§°"
        align="center"
        prop="configName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="åæ°é®å"
        align="center"
        prop="configKey"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="åæ°é®å¼"
        align="center"
        prop="configValue"
      />
      <el-table-column
        label="ç³»ç»åç½®"
        align="center"
        prop="configType"
        :formatter="typeFormat"
      />
      <el-table-column
        label="å¤æ³¨"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="åå»ºæ¶é´"
        align="center"
        prop="createTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime( scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="æä½"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >
            ä¿®æ¹
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            å é¤
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- æ·»å æä¿®æ¹åæ°éç½®å¯¹è¯æ¡ -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="formDialog"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="åæ°åç§°"
          prop="configName"
        >
          <el-input
            v-model="formData.configName"
            placeholder="è¯·è¾å¥åæ°åç§°"
          />
        </el-form-item>
        <el-form-item
          label="åæ°é®å"
          prop="configKey"
        >
          <el-input
            v-model="formData.configKey"
            placeholder="è¯·è¾å¥åæ°é®å"
          />
        </el-form-item>
        <el-form-item
          label="åæ°é®å¼"
          prop="configValue"
        >
          <el-input
            v-model="formData.configValue"
            placeholder="è¯·è¾å¥åæ°é®å¼"
          />
        </el-form-item>
        <el-form-item
          label="ç³»ç»åç½®"
          prop="configType"
        >
          <el-radio-group v-model="formData.configType">
            <el-radio
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="å¤æ³¨"
          prop="remark"
        >
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="è¯·è¾å¥åå®¹"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitForm"
          >
            ç¡® å®
          </el-button>
          <el-button @click="cancel">
            å æ¶
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
// import { listConfig, getConfig, delConfig, exportConfig, clearCache, getDicts } from '@/apis/system'
import { listConfig, getDicts, updateConfig, addConfig, getConfig, delConfig, exportConfig } from '@/apis/system/system'
import { defineComponent, onMounted, reactive, toRefs, ref, unref } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { download, parseTime } from '@/utils/ruoyi'
import pagination from '@/components/pagination/Index.vue'

export default defineComponent({
  components: {
    pagination
  },
  setup() {
    const queryForm = ref(ElForm)
    const formDialog = ref(ElForm)
    const dataMap = reactive({
      // é®ç½©å±
      loading: true,
      // éä¸­æ°ç»
      ids: [],
      // éåä¸ªç¦ç¨
      single: true,
      // éå¤ä¸ªç¦ç¨
      multiple: true,
      // æ¾ç¤ºæç´¢æ¡ä»¶
      showSearch: true,
      // æ»æ¡æ°
      total: 0,
      // åæ°è¡¨æ ¼æ°æ®
      configList: [],
      // å¼¹åºå±æ é¢
      title: '',
      // æ¯å¦æ¾ç¤ºå¼¹åºå±
      open: false,
      // ç±»åæ°æ®å­å¸
      typeOptions: [],
      // æ¥æèå´
      dateRange: [],
      formData: {
        remark: '',
        configType: '',
        configValue: '',
        configKey: '',
        configName: '',
        configId: ''
      },
      // æ¥è¯¢åæ°
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configName: undefined,
        configKey: undefined,
        configType: undefined
      },
      // è¡¨ååæ°
      // è¡¨åæ ¡éª
      rules: {
        configName: [
          { required: true, message: 'åæ°åç§°ä¸è½ä¸ºç©º', trigger: 'blur' }
        ],
        configKey: [
          { required: true, message: 'åæ°é®åä¸è½ä¸ºç©º', trigger: 'blur' }
        ],
        configValue: [
          { required: true, message: 'åæ°é®å¼ä¸è½ä¸ºç©º', trigger: 'blur' }
        ]
      }
    })

    const getList = async(data?: any) => {
      dataMap.loading = true

      console.log(data)
      const result = await listConfig(data)
      if (result?.code === 200) {
        dataMap.configList = result?.rows
        dataMap.total = result?.total
        dataMap.loading = false
      }
    }

    /** æç´¢æé®æä½ */
    const handleQuery = () => {
      dataMap.queryParams.pageNum = 1
      getList(dataMap.queryParams)
    }
    const resetTable = () => {
      const form = unref(queryForm)
      form.resetFields()
      dataMap.formData = {
        remark: '',
        configType: '',
        configValue: '',
        configKey: '',
        configName: '',
        configId: ''
      }
    }
    const resetQuery = () => {
      resetTable()
      handleQuery()
    }

    /** æ°å¢æé®æä½ */
    const handleAdd = () => {
      resetTable()
      dataMap.open = true
      dataMap.title = 'æ·»å åæ°'
    }

    /** æäº¤æé® */
    const submitForm = () => {
      const form = unref(formDialog)
      form.validate((valid: any) => {
        if (valid) {
          if (dataMap.formData.configId === '') {
            updateConfig(dataMap.formData).then((res) => {
              res?.code === 200 ? ElMessage.success('æ°å¢æå') : ElMessage.warning(res?.msg)
              dataMap.open = false
              getList()
            })
          } else {
            addConfig(dataMap.formData).then((res) => {
              if (res?.code === 200) {
                ElMessage.success('æ°å¢æå')
                dataMap.open = false
                getList()
              } else {
                dataMap.open = false
                ElMessage.warning(res?.msg)
              }
            })
          }
        }
      })
    }

    /** ä¿®æ¹æé®æä½ */
    const handleUpdate = (row: any) => {
      resetTable()
      const configId = row.configId || dataMap.ids
      getConfig(configId).then(response => {
        if (response?.code === 200) {
          dataMap.formData = response.data
          dataMap.open = true
          dataMap.title = 'ä¿®æ¹åæ°'
        }
      })
    }

    // å¤éæ¡éä¸­æ°æ®
    const handleSelectionChange = (selection: any) => {
      dataMap.ids = selection.map((item: any) => item.configId)
      dataMap.single = selection.length !== 1
      dataMap.multiple = !selection.length
    }

    /** å é¤æé®æä½ */
    const handleDelete = (row: any) => {
      const configIds = row.configId || dataMap.ids
      ElMessageBox.confirm('æ¯å¦ç¡®è®¤å é¤åæ°ç¼å·ä¸º"' + configIds + '"çæ°æ®é¡¹?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return delConfig(configIds)
      }).then((res) => {
        if (res?.code === 200) {
          getList()
          ElMessage.error('å é¤æå')
        } else {
          ElMessage.error(res?.msg)
        }
      })
    }

    /** å¯¼åºæé®æä½ */
    const handleExport = () => {
      const queryParams = dataMap.queryParams
      ElMessageBox.confirm('æ¯å¦ç¡®è®¤å¯¼åºææåæ°æ°æ®é¡¹?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return exportConfig(queryParams)
      }).then((response) => {
        download(response?.msg)
      })
    }
    onMounted(() => {
      getList()
      getDicts('sys_yes_no').then(response => {
        dataMap.typeOptions = response?.data
      })
    })
    return { ...toRefs(dataMap), parseTime, handleExport, formDialog, getList, handleQuery, resetQuery, queryForm, handleAdd, submitForm, handleUpdate, handleSelectionChange, handleDelete }
  }
})
</script>
