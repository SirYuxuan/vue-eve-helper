<template>
  <div style="display: inline-block;">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false"  :title="title" append-to-body width="775px" @close="dialog=false">
      <el-steps   :active="active" finish-status="success" simple >
        <el-step title="验证原手机" ></el-step>
        <el-step title="绑定新手机" ></el-step>
        <el-step title="修改完成" ></el-step>
      </el-steps>
      <div style="width: 420px;margin: 10px auto auto;" v-if="active === 0">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="95px">
          <el-form-item label="手机号码" prop="phone">
            <el-input disabled v-model="form.phone" auto-complete="on" style="width: 320px;" />
<!--           -->
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="form.code" max-length="6" style="width: 200px;" />
            <img :src="code.img" style="width: 120px;height: 32px;vertical-align: middle;cursor: pointer;" @click="getCode">
          </el-form-item>
          <el-form-item label="手机验证码" prop="phoneCode">
            <el-input v-model="form.phoneCode" type="text" style="width: 200px;" />
            <el-button :loading="codeLoading" :disabled="isDisabled" size="small" @click="sendOldCode">{{ buttonName }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="width: 420px;margin: 10px auto auto;" v-if="active === 1">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="95px">
          <el-form-item label="手机号码" prop="phone">
            <el-input  v-model="form.phone" auto-complete="on" style="width: 320px;" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="form.code" max-length="6" style="width: 200px;" />
            <img :src="code.img" style="width: 120px;height: 32px;vertical-align: middle;cursor: pointer;" @click="getCode">
          </el-form-item>
          <el-form-item label="手机验证码" prop="phoneCode">
            <el-input v-model="form.phoneCode" type="text" style="width: 200px;" />
            <el-button :loading="codeLoading" :disabled="isDisabled" size="small" @click="sendOldCode">{{ buttonName }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="width: 420px;margin: 10px auto auto;" v-if="active === 3">
        <el-result icon="success" title="" subTitle="手机号修改成功">
          <template slot="extra">
          </template>
        </el-result>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="active--" v-show="(active !== 0) && (active === 0 && phone)">上一步</el-button>
        <el-button :loading="loading" type="primary" @click="next" :disabled="!isOk">{{nextBtn}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {sendPhoneCode, updatePhone} from '@/api/system/user'
import HeyUI from "heyui"
import {doGet} from "@/api/curd/crud";
import {isEmail, isPhone, userValid} from "@/utils/validate";
export default {
  props: {
    phone: {
      type: String,
      required: false
    }
  },
  computed:{
    nextBtn: vm=>{
      if(vm.active === 0 || vm.active === 1){
        return '下一步'
      }else{
        return '关闭'
      }
    },
    isOk : vm => vm.form.phoneCode
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('手机号不能为空'))
      } else if (value === this.phone) {
        callback(new Error('新手机号不能与旧手机号相同'))
      } else if (isPhone(value)) {
        userValid(callback, 'phone', value, '手机已经被使用')
      } else {
        callback(new Error('手机号格式错误'))
      }
    }
    return {
      code:{},
      active: 0,
      loading: false, dialog: false, title: '修改手机号', form: { code:null,  phone: this.phone, phoneCode: null },
      user: { email: '', password: '' }, codeLoading: false,
      buttonName: '获取验证码', isDisabled: false, time: 60,
      rules: {
        phone: [
          { required: true, validator: validPhone, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '短信验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch:{
    dialog(val){
      if(val){
        this.getCode()
        this.form.phone = this.phone
        this.form.phoneCode = null
        this.form.code = null
        if(this.$refs['form']){
          this.$refs['form'].clearValidate()
        }
        if(this.phone){
          this.active = 0
        }else{
          this.active = 1
        }
      }
    }
  },
  created() {

  },
  methods: {
    getCode(){
      doGet('/captchaImage',{}).then(res=>{
        this.code = res.data
      })
    },
    next(){
      if(this.active === 0){
        // 校验原始手机号
        doGet('user/checkPhoneCode',{phone:this.form.phone,code:this.form.phoneCode}).then(res=>{
          if(res.data){
            this.form.phoneCode = null
            this.form.phone = null
            this.form.code = null
            this.codeLoading = false
            window.clearInterval(this.timer)
            this.time = 60
            this.buttonName = '获取验证码'
            this.isDisabled = false
            this.active ++
            this.getCode()
          }else{
            HeyUI.$Message({text:'短信验证码输入错误',type:'error'})
          }
        })
      }else if(this.active === 1){
        // 修改手机号
        this.loading = true
        updatePhone({phone:this.form.phone,code:this.form.phoneCode}).then(res=>{
          window.clearInterval(this.timer)
          this.time = 60
          this.buttonName = '获取验证码'
          this.isDisabled = false
          this.$emit('setPhone',this.form.phone)
          this.active +=2
          this.loading = false
        }).catch(e=>{
          this.loading= false
        })


      }else{
        this.dialog = false
      }
    },
    cancel() {
    },
    sendOldCode() {
        this.$refs['form'].validateField('code',(v)=>{
          if(!v){
            this.codeLoading = true
            this.buttonName = '验证码发送中'
            const _this = this
            sendPhoneCode({phone:this.form.phone,uuid:this.code.uuid,code:this.form.code}).then(res => {
              HeyUI.$Message({
                text: '发送成功，验证码有效期30分钟',
                type: 'success',
              })
              this.getCode()
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
