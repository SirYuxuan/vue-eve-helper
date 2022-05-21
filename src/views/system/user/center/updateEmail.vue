<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="475px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="新邮箱" prop="email">
          <el-input v-model="form.email" auto-complete="on" style="width: 200px;" />
          <el-button :loading="codeLoading" :disabled="isDisabled" size="small" @click="sendCode">{{ buttonName }}</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="form.code" max-length="6" style="width: 320px;" />
        </el-form-item>
        <el-form-item label="当前密码" prop="pass">
          <el-input v-model="form.pass" type="password" style="width: 320px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {encrypt} from '@/utils/encrypt'
import { isEmail,userValid } from '@/utils/validate'
import { sendUpdateMail, updateEmail } from '@/api/system/user'
import HeyUI from "heyui";
export default {
  props: {
    email: {
      type: String,
      required: false
    }
  },
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新邮箱不能为空'))
      } else if (value === this.email) {
        callback(new Error('新邮箱不能与旧邮箱相同'))
      } else if (isEmail(value)) {
        userValid(callback, 'email', value, '邮箱已经被使用')
      } else {
        callback(new Error('邮箱格式错误'))
      }
    }
    return {
      loading: false, dialog: false, title: '修改邮箱', form: { pass: '', email: '', code: '' },
      user: { email: '', password: '' }, codeLoading: false,
      buttonName: '获取验证码', isDisabled: false, time: 60,
      rules: {
        pass: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validMail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sendCode() {
        this.$refs['form'].validateField('email',(v)=>{
          if(!v){
            this.codeLoading = true
            this.buttonName = '验证码发送中'
            const _this = this
            sendUpdateMail(this.form.email).then(res => {
              HeyUI.$Message({
                text: '发送成功，验证码有效期30分钟',
                type: 'success',
              })
              this.codeLoading = false
              this.isDisabled = true
              this.buttonName = this.time-- + '秒后重新发送'
              this.timer = window.setInterval(function() {
                _this.buttonName = _this.time + '秒后重新发送'
                --_this.time
                if (_this.time < 0) {
                  _this.buttonName = '重新发送'
                  _this.time = 60
                  _this.isDisabled = false
                  window.clearInterval(_this.timer)
                }
              }, 1000)
            }).catch(err => {
              this.codeLoading = false
              window.clearInterval(this.timer)
              this.time = 60
              this.buttonName = '获取验证码'
              this.isDisabled = false
            })
          }
        })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          let email = this.form.email

          updateEmail(this.form).then(res => {
            this.loading = false
            this.resetForm()
            this.$emit('setEmail',email)
            HeyUI.$Message({
              text: '邮箱修改成功',
              type: 'success',
            })

          }).catch(err => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      window.clearInterval(this.timer)
      this.time = 60
      this.buttonName = '获取验证码'
      this.isDisabled = false
      this.form = { pass: '', email: '', code: '' }
    }
  }
}
</script>

<style scoped>

</style>
