const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema(
  {
    //权限名字
    department_name: {
      type: String,
      required: true,
    },
    //权限描述
    description: {
      type: String,
      required: true,
    },
    //权限的父id
    department_pid: {
      type: String,
      required: true,
    },
    //数据是否删除
    delete_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    created: {
      type: Number,
    },
    updated: {
      type: Number,
    },
  },
  {//跟踪文档的创建和更新时间
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated',
    },
  }
)

const department = mongoose.model('department', departmentSchema)
module.exports = department
