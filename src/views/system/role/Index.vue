<!--
 * @Description:
 * @Autor: scyð
 * @Date: 2021-02-22 11:11:04
 * @LastEditors: scyð
 * @LastEditTime: 2021-02-22 11:19:18
-->
<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
    >
      <el-form-item
        label="è§è²åç§°"
        prop="roleName"
      >
        <el-input
          v-model="queryParams.roleName"
          placeholder="è¯·è¾å¥è§è²åç§°"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="æéå­ç¬¦"
        prop="roleKey"
      >
        <el-input
          v-model="queryParams.roleKey"
          placeholder="è¯·è¾å¥æéå­ç¬¦"
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
          placeholder="è§è²ç¶æ"
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
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="å¼å§æ¥æ"
          end-placeholder="ç»ææ¥æ"
          format="YYYY-MM-DD"
          @change="changeDate"
        >
          />
        </el-date-picker>
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
      <right-toolbar
        v-model:show-search="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <!-- <el-table-column
        label="ç¶æ"
        align="center"
        width="100"
      >
        <template #default="{row}">
          <el-switch
            :value="row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        label="è§è²ç¼å·"
        prop="roleId"
        width="120"
      />
      <el-table-column
        label="è§è²åç§°"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="æéå­ç¬¦"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="æ¾ç¤ºé¡ºåº"
        prop="roleSort"
        width="100"
      />

      <el-table-column
        label="åå»ºæ¶é´"
        align="center"
        prop="createTime"
        width="180"
      >
        <template #default="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="æä½"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="{row}">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            ä¿®æ¹
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(row)"
          >
            æ°æ®æé
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(row)"
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

    <!-- æ·»å æä¿®æ¹è§è²éç½®å¯¹è¯æ¡ -->
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="formVal"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="è§è²åç§°"
          prop="roleName"
        >
          <el-input
            v-model="formVal.roleName"
            placeholder="è¯·è¾å¥è§è²åç§°"
          />
        </el-form-item>
        <el-form-item
          label="æéå­ç¬¦"
          prop="roleKey"
        >
          <el-input
            v-model="formVal.roleKey"
            placeholder="è¯·è¾å¥æéå­ç¬¦"
          />
        </el-form-item>
        <el-form-item
          label="è§è²é¡ºåº"
          prop="roleSort"
        >
          <el-input-number
            v-model="roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="ç¶æ">
          <el-radio-group v-model="formVal.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="èåæé">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
          >
            å±å¼/æå 
          </el-checkbox>
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
          >
            å¨é/å¨ä¸é
          </el-checkbox>
          <el-checkbox
            v-model="formVal.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
          >
            ç¶å­èå¨
          </el-checkbox>
          <el-tree
            ref="menuTreeData"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            :check-strictly="!formVal.menuCheckStrictly"
            empty-text="å è½½ä¸­ï¼è¯·ç¨å"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item label="å¤æ³¨">
          <el-input
            v-model="formVal.remark"
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

    <!-- åéè§è²æ°æ®æéå¯¹è¯æ¡ -->
    <el-dialog
      :title="title"
      v-model="openDataScope"
      width="500px"
      append-to-body
    >
      <el-form
        :model="form"
        label-width="80px"
      >
        <el-form-item label="è§è²åç§°">
          <el-input
            v-model="formVal.roleName"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="æéå­ç¬¦">
          <el-input
            v-model="formVal.roleKey"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="æéèå´">
          <el-select v-model="formVal.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="formVal.dataScope === 2"
          label="æ°æ®æé"
        >
          <el-checkbox
            v-model="deptExpand"
            @change="handleCheckedTreeExpand($event, 'dept')"
          >
            å±å¼/æå 
          </el-checkbox>
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
          >
            å¨é/å¨ä¸é
          </el-checkbox>
          <el-checkbox
            v-model="formVal.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
          >
            ç¶å­èå¨
          </el-checkbox>
          <el-tree
            ref="deptRef"
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            node-key="id"
            :check-strictly="!formVal.deptCheckStrictly"
            empty-text="å è½½ä¸­ï¼è¯·ç¨å"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitDataScope"
          >
            ç¡® å®
          </el-button>
          <el-button @click="cancelDataScope">
            å æ¶
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs, ref, unref, nextTick } from 'vue'
import { listRole, getRole, exportRole, delRole, dataScope, changeRoleStatus, updateRole, addRole } from '@/apis/system/role'
import { getDicts } from '@/apis/system/system'
import { download } from '@/utils/ruoyi'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/apis/system/Treeselect'
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/apis/system/dept'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import pagination from '@/components/pagination/Index.vue'
export default defineComponent({
  components: {
    pagination
  },
  setup() {
    const roleSort = ref('1')
    const formRef = ref(ElForm)
    const deptRef = ref<HTMLInputElement | null>(null)
    const menuTreeData = ref<HTMLInputElement | null>(null)
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
      // è§è²è¡¨æ ¼æ°æ®
      roleList: [],
      // å¼¹åºå±æ é¢
      title: '',
      // æ¯å¦æ¾ç¤ºå¼¹åºå±
      open: false,
      // æ¯å¦æ¾ç¤ºå¼¹åºå±ï¼æ°æ®æéï¼
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // æ¥æèå´
      dateRange: [],
      // ç¶ææ°æ®å­å¸
      statusOptions: [],
      // æ°æ®èå´éé¡¹
      dataScopeOptions: [
        {
          value: '1',
          label: 'å¨é¨æ°æ®æé'
        },
        {
          value: '2',
          label: 'èªå®æ°æ®æé'
        },
        {
          value: '3',
          label: 'æ¬é¨é¨æ°æ®æé'
        },
        {
          value: '4',
          label: 'æ¬é¨é¨åä»¥ä¸æ°æ®æé'
        },
        {
          value: '5',
          label: 'ä»æ¬äººæ°æ®æé'
        }
      ],
      // èååè¡¨
      menuOptions: [],
      // é¨é¨åè¡¨
      deptOptions: [],
      // æ¥è¯¢åæ°
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // è¡¨ååæ°
      formVal: {
        roleId: '',
        roleName: '',
        roleKey: '',
        roleSort: '0',
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // è¡¨åæ ¡éª
      rules: {
        roleName: [
          { required: true, message: 'è§è²åç§°ä¸è½ä¸ºç©º', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: 'æéå­ç¬¦ä¸è½ä¸ºç©º', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: 'è§è²é¡ºåºä¸è½ä¸ºç©º', trigger: 'blur' }
        ]
      }
    })
    /** æ¥è¯¢è§è²åè¡¨ */
    const getList = () => {
      dataMap.loading = true
      // addDateRange(dataMap.queryParams, dataMap.dateRange)
      listRole(dataMap.queryParams).then(
      // listRole(addDateRange(dataMap.queryParams, dataMap.dateRange)).then(
        (response: any) => {
          dataMap.roleList = response.rows
          dataMap.total = response.total
          dataMap.loading = false
        }
      )
    }

    /** æ¥è¯¢èåæ ç»æ */
    const getMenuTreeselect = () => {
      menuTreeselect().then((response: any) => {
        dataMap.menuOptions = response.data
      })
    }
    /** æ¥è¯¢é¨é¨æ ç»æ */
    const getDeptTreeselect = () => {
      deptTreeselect().then((response: any) => {
        dataMap.deptOptions = response.data
      })
    }

    /** æ ¹æ®è§è²IDæ¥è¯¢èåæ ç»æ */
    const getRoleMenuTreeselect = (roleId: any) => {
      return roleMenuTreeselect(roleId).then(response => {
        if (response) {
          dataMap.menuOptions = response.menus

          console.log(response)
          return response
        }
      })
    }
    /** æ ¹æ®è§è²IDæ¥è¯¢é¨é¨æ ç»æ */
    const getRoleDeptTreeselect = (roleId: any) => {
      return roleDeptTreeselect(roleId).then(response => {
        console.log(response)
        dataMap.deptOptions = response?.depts
        return response
      })
    }

    const formReset = () => {
      if (menuTreeData.value) {
        (menuTreeData.value as any).setCheckedKeys([])
      }
      dataMap.menuExpand = false
      dataMap.menuNodeAll = false
      dataMap.deptExpand = true
      dataMap.deptNodeAll = false
      dataMap.formVal = {
        roleId: '',
        roleName: '',
        roleKey: '',
        roleSort: '',
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: ''
      }
      // dataMap.resetForm('form')
    }

    /** æ°å¢æé®æä½ */
    const handleAdd = () => {
      getMenuTreeselect()
      dataMap.open = true
      dataMap.title = 'æ·»å è§è²'
    }

    /** ä¿®æ¹æé®æä½ */
    const handleUpdate = async(row: any) => {
      formReset()
      const roleId = row.roleId || dataMap.ids
      const roleMenu = getRoleMenuTreeselect(roleId)
      const result = await getRole(roleId)
      if (result?.code === 200) {
        dataMap.formVal = result?.data
        roleSort.value = result.data.roleSort

        nextTick(() => {
          dataMap.open = true
          roleMenu.then((res: any) => {
            const checkedKeys = res.checkedKeys
            checkedKeys.forEach((v: any) => {
              nextTick(() => {
                (menuTreeData.value as any).setChecked(v, true, false)
              })
            })
          })
        })
        dataMap.title = 'ä¿®æ¹è§è²'
      }
    }

    // å¤éæ¡éä¸­æ°æ®
    const handleSelectionChange = (selection: any) => {
      dataMap.ids = selection.map((item: any) => item.roleId)
      dataMap.single = selection.length !== 1
      dataMap.multiple = !selection.length
    }

    // æ æéï¼å±å¼/æå ï¼
    const handleCheckedTreeExpand = (value: any, type: any) => {
      if (type === 'menu') {
        const treeList = dataMap.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          (menuTreeData.value as any).store.nodesMap[(treeList[i] as any).id].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = dataMap.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          (deptRef.value as any).store.nodesMap[(treeList[i] as any).id].expanded = value
        }
      }
    }
    // æ æéï¼å¨é/å¨ä¸éï¼
    const handleCheckedTreeNodeAll = (value: any, type: any) => {
      if (type === 'menu') {
        (menuTreeData.value as any).setCheckedNodes(value ? dataMap.menuOptions : [])
      } else if (type === 'dept') {
        (deptRef.value as any).setCheckedNodes(value ? dataMap.deptOptions : [])
      }
    }
    // æ æéï¼ç¶å­èå¨ï¼
    const handleCheckedTreeConnect = (value: any, type: any) => {
      if (type === 'menu') {
        dataMap.formVal.menuCheckStrictly = !!value
      } else if (type === 'dept') {
        dataMap.formVal.deptCheckStrictly = !!value
      }
    }
    /** å¯¼åºæé®æä½ */
    const handleExport = () => {
      const queryParams = dataMap.queryParams
      ElMessageBox.confirm('æ¯å¦ç¡®è®¤å¯¼åºææè§è²æ°æ®é¡¹?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams)
      }).then(response => {
        download(response?.msg)
      })
    }

    //     /** å é¤æé®æä½ */
    const handleDelete = (row: any) => {
      const roleIds = row.roleId || dataMap.ids
      ElMessageBox.confirm('æ¯å¦ç¡®è®¤å é¤è§è²ç¼å·ä¸º"' + roleIds + '"çæ°æ®é¡¹?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        getList()
        ElMessage.success('å é¤æå')
      })
    }

    /** åéæ°æ®æéæä½ */
    const handleDataScope = (row: any) => {
      formReset()

      const roleDeptTreeselect = getRoleDeptTreeselect(row.roleId)
      getRole(row.roleId).then(response => {
        dataMap.formVal = response?.data
        dataMap.openDataScope = true
        nextTick(() => {
          roleDeptTreeselect.then((res: any) => {
            (deptRef.value as any).setCheckedKeys(res?.checkedKeys)
          })
        })
        dataMap.title = 'åéæ°æ®æé'
      })
    }

    // åæ¶æé®
    const cancel = () => {
      dataMap.open = false
      formReset()
    }
    // åæ¶æé®ï¼æ°æ®æéï¼
    const cancelDataScope = () => {
      dataMap.openDataScope = false
      formReset()
    }
    // ææé¨é¨èç¹æ°æ®
    const getDeptAllCheckedKeys = () => {
      // ç®åè¢«éä¸­çé¨é¨èç¹
      const checkedKeys = (deptRef.value as any).getCheckedKeys()
      // åéä¸­çé¨é¨èç¹
      const halfCheckedKeys = (deptRef.value as any).getHalfCheckedKeys()
      checkedKeys.unshift.bind(checkedKeys, halfCheckedKeys)
      return checkedKeys
    }
    /** æäº¤æé®ï¼æ°æ®æéï¼ */
    const submitDataScope = () => {
      if (dataMap.formVal.roleId !== undefined) {
        dataMap.formVal.deptIds = getDeptAllCheckedKeys()
        dataScope(dataMap.formVal).then(() => {
          ElMessage.success('ä¿®æ¹æå')
          dataMap.openDataScope = false
          getList()
        })
      }
    }
    // è§è²ç¶æä¿®æ¹
    const handleStatusChange = (row: any) => {
      const text = row.status === '0' ? 'å¯ç¨' : 'åç¨'
      ElMessageBox.confirm('ç¡®è®¤è¦"' + text + '""' + row.roleName + '"è§è²å?', 'è­¦å', {
        confirmButtonText: 'ç¡®å®',
        cancelButtonText: 'åæ¶',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.roleId, row.status)
      }).then(() => {
        ElMessage.success(text + 'æå')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    }

    // ææèåèç¹æ°æ®
    const getMenuAllCheckedKeys = () => {
      // ç®åè¢«éä¸­çèåèç¹
      const checkedKeys = (menuTreeData.value as any).getCheckedKeys()
      // åéä¸­çèåèç¹
      const halfCheckedKeys = (menuTreeData.value as any).getHalfCheckedKeys()
      checkedKeys.unshift.bind(checkedKeys, halfCheckedKeys)
      return checkedKeys
    }
    /** æç´¢æé®æä½ */
    const handleQuery = () => {
      dataMap.queryParams.pageNum = 1
      getList()
    }

    /** éç½®æé®æä½ */
    const resetQuery = () => {
      dataMap.dateRange = []
      // this.resetForm('queryForm')
      handleQuery()
    }
    /** æäº¤æé® */
    const submitForm = () => {
      const form = unref(formRef)
      form.validate((valid: any) => {
        if (valid) {
          if (dataMap.formVal.roleId !== undefined) {
            dataMap.formVal.menuIds = getMenuAllCheckedKeys()
            updateRole(dataMap.formVal).then(() => {
              ElMessage.success('ä¿®æ¹æå')
              dataMap.open = false
              getList()
            })
          } else {
            dataMap.formVal.menuIds = getMenuAllCheckedKeys()
            addRole(dataMap.formVal).then(() => {
              ElMessage.success('ä¿®æ¹æå')
              dataMap.open = false
              getList()
            })
          }
        }
      })
    }

    const changeDate = (e: {[key: string]: any}) => {
      console.log(e.target.value)
    }
    onMounted(() => {
      getList()

      getDicts('sys_normal_disable').then(response => {
        dataMap.statusOptions = response?.data
      })
    })
    return { ...toRefs(dataMap), roleSort, changeDate, resetQuery, handleQuery, submitForm, getMenuAllCheckedKeys, handleStatusChange, submitDataScope, cancelDataScope, cancel, handleDataScope, handleDelete, handleExport, deptRef, handleCheckedTreeConnect, handleCheckedTreeNodeAll, handleCheckedTreeExpand, menuTreeData, formRef, formReset, getList, getMenuTreeselect, getDeptTreeselect, getRoleMenuTreeselect, getRoleDeptTreeselect, handleAdd, handleUpdate, handleSelectionChange }
  }

})
</script>
