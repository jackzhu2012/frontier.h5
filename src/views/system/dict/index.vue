<!--
 * @Description:
 * @Autor: scyð
 * @Date: 2021-02-03 16:48:44
 * @LastEditors: scyð
 * @LastEditTime: 2021-02-04 10:03:35
-->
<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item
        label="å­å¸åç§°"
        prop="dictName"
      >
        <el-input
          v-model="queryParams.dictName"
          placeholder="è¯·è¾å¥å­å¸åç§°"
          size="small"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="å­å¸ç±»å"
        prop="dictType"
      >
        <el-input
          v-model="queryParams.dictType"
          placeholder="è¯·è¾å¥å­å¸ç±»å"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="ç¶æ"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          placeholder="å­å¸ç¶æ"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="åå»ºæ¶é´">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="å¼å§æ¥æ"
          end-placeholder="ç»ææ¥æ"
        />
      </el-form-item>
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
          v-hasPermi="['system:dict:add']"
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
          v-hasPermi="['system:dict:edit']"
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
          v-hasPermi="['system:dict:remove']"
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
          v-hasPermi="['system:dict:export']"
        >
          å¯¼åº
        </el-button>
      </el-col>
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="typeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="å­å¸ç¼å·"
        align="center"
        prop="dictId"
      />
      <el-table-column
        label="å­å¸åç§°"
        align="center"
        prop="dictName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="å­å¸ç±»å"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <router-link
            :to="'/system/dict/type/data/' + scope.row.dictId"
            class="link-type"
          >
            <span>{{ scope.row.dictType }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="ç¶æ"
        align="center"
        prop="status"
        :formatter="statusFormat"
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
          <span>{{ scope.row.createTime }}</span>
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
            v-hasPermi="['system:dict:edit']"
          >
            ä¿®æ¹
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
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
        ref="postFormNode"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="å­å¸åç§°"
          prop="dictName"
        >
          <el-input
            v-model="formData.dictName"
            placeholder="è¯·è¾å¥å­å¸åç§°"
          />
        </el-form-item>
        <el-form-item
          label="å­å¸ç±»å"
          prop="dictType"
        >
          <el-input
            v-model="formData.dictType"
            placeholder="è¯·è¾å¥å­å¸ç±»å"
          />
        </el-form-item>
        <el-form-item
          label="ç¶æ"
          prop="status"
        >
          <el-radio-group v-model="formData.status">
            <el-radio
              v-for="dict in statusOptions"
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
        <div class="dialog-footer">
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

<script lang="ts">
import { reactive, toRefs, defineComponent, onMounted, ref, unref } from 'vue'
import { listType, getType, addType, updateType, getDicts, delType, exportType } from '@/apis/system/system'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
// import { ElMessage } from 'element-plus'
import { download } from '@/utils/ruoyi'
import pagination from '@/components/pagination/Index.vue'

export default defineComponent({
  components: {
    pagination
  },
  name: 'App',
  setup() {
    const postFormNode = ref(ElForm)
    const queryForm = ref(ElForm)
    const data = reactive({
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
      // å­å¸è¡¨æ ¼æ°æ®
      typeList: [],
      // å¼¹åºå±æ é¢
      title: '',
      // æ¯å¦æ¾ç¤ºå¼¹åºå±
      open: false,
      // ç¶ææ°æ®å­å¸
      statusOptions: [],
      // æ¥æèå´
      dateRange: [],
      // æ¥è¯¢åæ°
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        dictName: '',
        dictType: undefined,
        status: undefined
      },
      // è¡¨ååæ°
      formData: {
        dictId: '',
        dictName: '',
        dictType: '',
        status: '0',
        remark: ''
      },
      // è¡¨åæ ¡éª
      rules: {
        dictName: [
          { required: true, message: 'å­å¸åç§°ä¸è½ä¸ºç©º', trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: 'å­å¸ç±»åä¸è½ä¸ºç©º', trigger: 'blur' }
        ]
      }
    })

    /** æ¥è¯¢å­å¸ç±»ååè¡¨ */
    const getList = () => {
      data.loading = true
      listType(data.queryParams).then(response => {
        if (response) {
          data.typeList = response.rows ?? []
          data.total = response.total
          data.loading = false
        }
      }
      )
    }
    //   // å­å¸ç¶æå­å¸ç¿»è¯
    //  const  statusFormat = (row)=> {
    //     return this.selectDictLabel(this.statusOptions, row.status)
    //   }

    // è¡¨åéç½®
    const reset = () => {
      data.formData = {
        dictId: '',
        dictName: '',
        dictType: '',
        status: '0',
        remark: ''
      }
      // this.resetForm('form')
    }
    const statusFormat = (row: any) => {
      return row.status === 0 ? 'åç¨' : ' æ­£å¸¸'
    }
    // åæ¶æé®
    const cancel = () => {
      data.open = false
      reset()
    }
    /** æç´¢æé®æä½ */
    const handleQuery = () => {
      data.queryParams.pageNum = 1
      getList()
    }
    /** éç½®æé®æä½ */
    const resetQuery = () => {
      const form = unref(queryForm)
      form.resetFields()
      data.dateRange = []
      handleQuery()
    }

    /** æ°å¢æé®æä½ */
    const handleAdd = () => {
      reset()
      data.open = true
      data.title = 'æ·»å å­å¸ç±»å'
    }
    // å¤éæ¡éä¸­æ°æ®
    const handleSelectionChange = (selection: any) => {
      data.ids = selection.map((item: any) => item.dictId)
      data.single = selection.length !== 1
      data.multiple = !selection.length
    }
    /** ä¿®æ¹æé®æä½ */
    const handleUpdate = (row: any) => {
      reset()
      const dictId = row.dictId || data.ids
      getType(dictId).then(response => {
        if (response) {
          data.formData = response.data
          data.open = true
          data.title = 'ä¿®æ¹å­å¸ç±»å'
        }
      })
    }
    /** æäº¤æé® */
    const submitForm = () => {
      const form = unref(postFormNode)
      form.validate((valid: Boolean) => {
        if (valid) {
          if (data.formData?.dictId !== undefined) {
            updateType(data.formData).then((res: {[key: string]: any} | null) => {
              res?.code === 0 ? ElMessage.success('ä¿®æ¹æå') : ElMessage.error(res?.msg)
            })
          } else {
            addType(data.formData).then((res: {[key: string]: any} | null) => {
              res?.code === 0 ? ElMessage.success('æ°å¢æå') : ElMessage.error(res?.msg)
            })
          }
          data.open = false
          getList()
        }
      })
    }
    /** å é¤æé®æä½ */
    const handleDelete = async(row: {[key: string]: any}) => {
      const dictIds = row.dictId || data.ids
      ElMessageBox.confirm('æ¯å¦ç¡®è®¤å é¤å­å¸ç¼å·ä¸º"' + dictIds + '"çæ°æ®é¡¹?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return delType(dictIds)
      }).then((response: {[key: string]: any} |null) => {
        if (response?.code === 0) {
          getList()
          ElMessage.success('å é¤æå')
        } else {
          ElMessage.error(response?.msg)
        }
      })
    }
    /** å¯¼åºæé®æä½ */
    const handleExport = () => {
      const queryParams = data.queryParams
      ElMessageBox.confirm('æ¯å¦ç¡®è®¤å¯¼åºææç±»åæ°æ®é¡¹?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return exportType(queryParams)
      }).then((response: any) => {
        download(response.msg)
      })
    }
    onMounted(() => {
      getList()
      getDicts('sys_normal_disable').then((response: any) => {
        data.statusOptions = response.data
      })
    })
    return { ...toRefs(data), queryForm, statusFormat, postFormNode, getList, cancel, reset, handleQuery, handleExport, handleDelete, submitForm, resetQuery, handleAdd, handleSelectionChange, handleUpdate }
  }
})
</script>

<style lang="scss" scoped>
</style>
