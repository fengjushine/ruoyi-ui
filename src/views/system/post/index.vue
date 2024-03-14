<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="评论统计" prop="comments">
        <el-input
          v-model="queryParams.comments"
          placeholder="请输入评论统计"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收藏统计" prop="collects">
        <el-input
          v-model="queryParams.collects"
          placeholder="请输入收藏统计"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览统计" prop="view">
        <el-input
          v-model="queryParams.view"
          placeholder="请输入浏览统计"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="是否置顶" prop="top">
        <el-input
          v-model="queryParams.top"
          placeholder="请输入是否置顶，1-是，0-否"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否加精" prop="essence">
        <el-input
          v-model="queryParams.essence"
          placeholder="请输入是否加精，1-是，0-否"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="修改时间" prop="modifyTime">
        <el-date-picker clearable
          v-model="queryParams.modifyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择修改时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="话题内容(MarkDown)" align="center" prop="content" :show-overflow-tooltip='true' />
      <el-table-column label="作者ID" align="center" prop="userId" />
      <el-table-column label="评论统计" align="center" prop="comments" />
      <el-table-column label="收藏统计" align="center" prop="collects" />
      <el-table-column label="浏览统计" align="center" prop="view" />
      <!-- <el-table-column label="是否置顶，1-是，0-否" align="center" prop="top" />
      <el-table-column label="是否加精，1-是，0-否" align="center" prop="essence" /> -->
      <el-table-column label="专栏ID" align="center" prop="sectionId" />
      <el-table-column label="修改时间" align="center" prop="modifyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改话题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键" />
        </el-form-item>
        <el-form-item label="markdown内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="作者ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入作者ID" />
        </el-form-item>
        <el-form-item label="评论统计" prop="comments">
          <el-input v-model="form.comments" placeholder="请输入评论统计" />
        </el-form-item>
        <el-form-item label="收藏统计" prop="collects">
          <el-input v-model="form.collects" placeholder="请输入收藏统计" />
        </el-form-item>
        <el-form-item label="浏览统计" prop="view">
          <el-input v-model="form.view" placeholder="请输入浏览统计" />
        </el-form-item>
        <el-form-item label="是否置顶，1-是，0-否" prop="top">
          <el-input v-model="form.top" placeholder="请输入是否置顶，1-是，0-否" />
        </el-form-item>
        <el-form-item label="是否加精，1-是，0-否" prop="essence">
          <el-input v-model="form.essence" placeholder="请输入是否加精，1-是，0-否" />
        </el-form-item>
        <el-form-item label="专栏ID" prop="sectionId">
          <el-input v-model="form.sectionId" placeholder="请输入专栏ID" />
        </el-form-item>
        <el-form-item label="修改时间" prop="modifyTime">
          <el-date-picker clearable
            v-model="form.modifyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择修改时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/system/post";

export default {
  name: "Post",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 话题表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: null,
        userId: null,
        comments: null,
        collects: null,
        view: null,
        top: null,
        essence: null,
        sectionId: null,
        modifyTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "作者ID不能为空", trigger: "blur" }
        ],
        comments: [
          { required: true, message: "评论统计不能为空", trigger: "blur" }
        ],
        collects: [
          { required: true, message: "收藏统计不能为空", trigger: "blur" }
        ],
        view: [
          { required: true, message: "浏览统计不能为空", trigger: "blur" }
        ],
        top: [
          { required: true, message: "是否置顶，1-是，0-否不能为空", trigger: "blur" }
        ],
        essence: [
          { required: true, message: "是否加精，1-是，0-否不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "发布时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询话题列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        content: null,
        userId: null,
        comments: null,
        collects: null,
        view: null,
        top: null,
        essence: null,
        sectionId: null,
        createTime: null,
        modifyTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.title)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加话题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const title = row.title || this.ids
      getPost(title).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改话题";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.title != null) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const titles = row.title || this.ids;
      this.$modal.confirm('是否确认删除话题编号为"' + titles + '"的数据项？').then(function() {
        return delPost(titles);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
