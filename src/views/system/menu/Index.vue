<!--
 * @Description: ่ๅ็ฎก็
 * @Author: ZY
 * @Date: 2021-02-23 15:09:41
 * @LastEditors: scy๐
 * @LastEditTime: 2021-02-26 14:21:13
-->

<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item
        label="่ๅๅ็งฐ"
        prop="menuName"
      >
        <el-input
          v-model="queryParams.menuName"
          placeholder="่ฏท่พๅฅ่ๅๅ็งฐ"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="็ถๆ"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          placeholder="่ๅ็ถๆ"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          ๆ็ดข
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >
          ้็ฝฎ
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
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:menu:add']"
        >
          ๆฐๅข
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="menuName"
        label="่ๅๅ็งฐ"
        :show-overflow-tooltip="true"
        width="160"
      />
      <el-table-column
        prop="icon"
        label="ๅพๆ?"
        align="center"
        width="100"
      >
        <template #default="scope">
          <svg
            class="icon"
            aria-hidden="true"
            font-size="20px"
          >
            <use :xlink:href="scope.row.icon" />
          </svg>
          <!-- <svg
            class="icon"
            aria-hidden="true"
            font-size="20px"
          >
            <use xlink:href="#icondashboard" />
          </svg> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="ๆๅบ"
        width="60"
      />
      <el-table-column
        prop="perms"
        label="ๆ้ๆ?่ฏ"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="component"
        label="็ปไปถ่ทฏๅพ"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="status"
        label="็ถๆ"
        :formatter="statusFormat"
        width="80"
      />
      <el-table-column
        label="ๅๅปบๆถ้ด"
        align="center"
        prop="createTime"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ๆไฝ"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']"
          >
            ไฟฎๆน
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >
            ๆฐๅข
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >
            ๅ?้ค
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ๆทปๅ?ๆไฟฎๆน่ๅๅฏน่ฏๆก -->
    <el-dialog
      :title="title"
      v-model="open"
      width="600px"
      append-to-body
      @opened="showDialog"
    >
      <el-form
        ref="dialogForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="ไธ็บง่ๅ">
              <Treeselect
                :treeProps="props"
                placeholder="่ฏท้ๆฉไธ็บง่ๅ"
                :defalut="form.parentId"
                :options="menuOptions"
                :originOptions="menuNoTreeList"
                :accordion="isAccordion"
                @getValue="getParentValue($event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="่ๅ็ฑปๅ"
              prop="menuType"
            >
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">
                  ็ฎๅฝ
                </el-radio>
                <el-radio label="C">
                  ่ๅ
                </el-radio>
                <el-radio label="F">
                  ๆ้ฎ
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.menuType !== 'F'"
              label="่ๅๅพๆ?"
            >
              <el-input
                v-model="form.icon"
                placeholder="่ฏทๅๅพiconfont ้ๆฉsymbolๅพๆ?็ฒ่ดด"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="่ๅๅ็งฐ"
              prop="menuName"
            >
              <el-input
                v-model="form.menuName"
                placeholder="่ฏท่พๅฅ่ๅๅ็งฐ"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="ๆพ็คบๆๅบ"
              prop="orderNum"
            >
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType !== 'F'"
              label="ๆฏๅฆๅค้พ"
            >
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">
                  ๆฏ
                </el-radio>
                <el-radio label="1">
                  ๅฆ
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType !== 'F'"
              label="่ทฏ็ฑๅฐๅ"
              prop="path"
            >
              <el-input
                v-model="form.path"
                placeholder="่ฏท่พๅฅ่ทฏ็ฑๅฐๅ"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType !== 'F'"
              label="ๆพ็คบ็ถๆ"
            >
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType !== 'F'"
              label="่ๅ็ถๆ"
            >
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="form.menuType === 'C'"
          >
            <el-form-item
              label="็ปไปถ่ทฏๅพ"
              prop="component"
            >
              <el-input
                v-model="form.component"
                placeholder="่ฏท่พๅฅ็ปไปถ่ทฏๅพ"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType !== 'M'"
              label="ๆ้ๆ?่ฏ"
            >
              <el-input
                v-model="form.perms"
                placeholder="่ฏทๆ้ๆ?่ฏ"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType === 'C'"
              label="ๆฏๅฆ็ผๅญ"
            >
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">
                  ็ผๅญ
                </el-radio>
                <el-radio label="1">
                  ไธ็ผๅญ
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitForm"
          >
            ็กฎ ๅฎ
          </el-button>
          <el-button @click="cancel">
            ๅ ๆถ
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, toRefs, getCurrentInstance } from 'vue'
import { listMenu, getMenu, delMenu, addMenu, updateMenu, getDicts } from '@/apis/system/system'
import { DictKey } from '@/constant/dictKey'
import { selectDictLabel, handleTree } from '@/utils/ruoyi'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MenuModel } from '@/model/system/menuModel'
import { parseTime } from '@/utils/index'
import Treeselect from '@/components/tree-select/Index.vue'
export default defineComponent({
  components: {
    Treeselect
  },
  setup() {
    const { ctx } = getCurrentInstance() as any
    // const queryForm = ref(null)
    const state = reactive({
      // ้ฎ็ฝฉๅฑ
      loading: true,
      // ๆพ็คบๆ็ดขๆกไปถ
      showSearch: true,
      // ่ๅ่กจๆ?ผๆ?ๆฐๆฎ
      menuNoTreeList: Array<MenuModel>(),
      // ่ๅ่กจๆ?ผๆ?ๆฐๆฎ
      menuList: Array<MenuModel>(),
      // ่ๅๆ?้้กน
      menuOptions: [],
      // ๆทปๅ?ไธป็ฑป็ฎ๏ผ้่ๅๆ?ๆฐๆฎๆบ
      menuMainSelectList: [],
      props: { // ้็ฝฎ้กน๏ผๅฟ้๏ผ
        value: 'menuId',
        label: 'menuName',
        children: 'children'
        // disabled:true
      },
      isClearable: true, // ๅฏๆธ็ฉบ๏ผๅฏ้๏ผ
      isAccordion: true, // ๅฏๆถ่ตท๏ผๅฏ้๏ผ
      // ๅผนๅบๅฑๆ?้ข
      title: '',
      // ๆฏๅฆๆพ็คบๅผนๅบๅฑ
      open: false,
      // ๆพ็คบ็ถๆๆฐๆฎๅญๅธ
      visibleOptions: Array<any>(),
      // ่ๅ็ถๆๆฐๆฎๅญๅธ
      statusOptions: Array<any>(),
      // ๆฅ่ฏขๅๆฐ
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // ่กจๅๅๆฐ
      form: {} as MenuModel,
      // ่กจๅๆ?ก้ช
      rules: {
        menuName: [
          { required: true, message: '่ๅๅ็งฐไธ่ฝไธบ็ฉบ', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '่ๅ้กบๅบไธ่ฝไธบ็ฉบ', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '่ทฏ็ฑๅฐๅไธ่ฝไธบ็ฉบ', trigger: 'blur' }
        ]
      }
    })

    const getParentValue = (e: any) => {
      console.log(e)
    }

    /** ๆฅ่ฏข่ๅๅ่กจ */
    const getList = () => {
      state.loading = true
      listMenu(state.queryParams).then((res) => {
        state.menuList = handleTree(res?.data, 'menuId')
        state.loading = false
      })
    }

    onBeforeMount(() => {
      getList()
      getDicts(DictKey.SYS_SHOW_HIDE).then((res) => {
        state.visibleOptions = res?.data
      })
      getDicts(DictKey.SYS_NORMAL_DISABLE).then((res) => {
        state.statusOptions = res?.data
      })
    })

    /** ่ฝฌๆข่ๅๆฐๆฎ็ปๆ */
    const normalizer = (node: any) => {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    }

    /** ๆฅ่ฏข่ๅไธๆๆ?็ปๆ */
    const getTreeselect = () => {
      listMenu({}).then(response => {
        state.menuOptions = []
        const menu = { menuId: 0, menuName: 'ไธป็ฑป็ฎ', children: [] }
        menu.children = response && handleTree(response.data, 'menuId');
        (state.menuOptions as any).push(menu)

        state.menuNoTreeList = response && response.data as any
      })
    }

    // ๆพ็คบ็ถๆๅญๅธ็ฟป่ฏ
    const visibleFormat = (row: MenuModel) => {
      if (row.menuType === 'F') {
        return ''
      }
      return selectDictLabel(state.visibleOptions as [], row.visible)
    }

    // ่ๅ็ถๆๅญๅธ็ฟป่ฏ
    const statusFormat = (row: MenuModel) => {
      if (row.menuType === 'F') {
        return ''
      }
      return selectDictLabel(state.statusOptions as [], row.status)
    }

    // ่กจๅ้็ฝฎ
    const reset = () => {
      state.form = {
        menuId: -1,
        parentId: 0,
        menuName: '',
        icon: '',
        menuType: 'M',
        orderNum: '',
        isFrame: '1',
        isCache: '0',
        visible: '0',
        status: '0'
      } as any

      // (ctx.$refs.dialogForm as any).resetFields()
    }

    // ๅๆถๆ้ฎ
    const cancel = () => {
      state.open = false
      reset()
    }

    /** ๆ็ดขๆ้ฎๆไฝ */
    const handleQuery = () => {
      getList()
    }

    /** ้็ฝฎๆ้ฎๆไฝ */
    const resetQuery = () => {
      (ctx.$refs.queryForm as any).resetFields()
      handleQuery()
    }

    /** ๆฐๅขๆ้ฎๆไฝ */
    const handleAdd = (row: MenuModel) => {
      reset()
      if (row !== null && row.menuId) {
        state.form.parentId = row.menuId
      } else {
        state.form.parentId = 0
      }
      state.open = true
      state.title = 'ๆทปๅ?่ๅ'
    }

    /** ไฟฎๆนๆ้ฎๆไฝ */
    const handleUpdate = (row: MenuModel) => {
      reset()
      getMenu(row.menuId.toString()).then(response => {
        state.form = response && response.data as any
        console.log(state.form)

        state.open = true
        state.title = 'ไฟฎๆน่ๅ'
      })
    }

    /** ๆไบคๆ้ฎ */
    const submitForm = () => {
      (ctx.$refs.dialogForm as any).validate((valid: Boolean) => {
        if (valid) {
          if (state.form.menuId !== undefined) {
            updateMenu(state.form).then(() => {
              ElMessage.success('ไฟฎๆนๆๅ')
              state.open = false
              getList()
            })
          } else {
            addMenu(state.form).then(() => {
              ElMessage.success('ๆฐๅขๆๅ')
              state.open = false
              getList()
            })
          }
        }
      })
    }

    /** ๅ?้คๆ้ฎๆไฝ */
    const handleDelete = (row: MenuModel) => {
      ElMessageBox.confirm('ๆฏๅฆ็กฎ่ฎคๅ?้คๅ็งฐไธบ"' + row.menuName + '"็ๆฐๆฎ้กน?', '่ญฆๅ', {
        confirmButtonText: '็กฎๅฎ',
        cancelButtonText: 'ๅๆถ',
        type: 'warning'
      }).then(() => {
        return delMenu(row.menuId.toString())
      }).then(() => {
        getList()
        ElMessage.success('ๅ?้คๆๅ')
      })
    }

    const showDialog = () => {
      getTreeselect()
    }

    return {
      ...toRefs(state),
      showDialog,
      getParentValue,
      normalizer,
      handleDelete,
      submitForm,
      handleUpdate,
      handleAdd,
      handleQuery,
      resetQuery,
      cancel,
      statusFormat,
      visibleFormat,
      parseTime
    }
  }
})

</script>
