// components/form/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [{
      name: '自己出席', value: '自己出席', checked: true
    }, {
      name: '两人出席', value: '两人出席', checked: false
    }, {
      name: '三人出席', value: '三人出席', checked: false
    }, {
      name: '三人以上', value: '三人以上', checked: false
    }],
    desc: '',
    name: '',
    phone: '',
    count: '自己出席',
    phoneFlag: false
  },

  /**
   * 组件的方法列表
   */ 
  methods: {
    inputDesc(e) {
      this.setData({
        desc: e.detail.value
      })
    },
    inputName(e) {
      console.log('name')
      this.setData({
        name: e.detail.value
      })
    },
    inputPhone(e) {
      this.setData({
        phone: e.detail.value
      })
    },
    cancel() {
      const that = this
      this.triggerEvent('closeForm')
    },

    radioChange(e) {
      const that = this
      console.log(e)
      const count = e.detail.value
      let list = this.data.list
      list.forEach(item => {
        if (item.name === count) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.setData({
        count,
        list
      })
    },

    submit() {
      const that = this
      const {name, phoneFlag} = this.data
      if (name) {
        if (phoneFlag) {
          that.addPresent()
        } else {
          wx.showToast({
            title: '请正确输入您的手机号码',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '请填写您的姓名',
          icon: 'none'
        })
      }
    },

    checkPhone(e) {
      let that = this
      const phone = e.detail.value
      let reg = /^(1[3-9][0-9])\d{8}$/
      let phoneFlag = false
      if (phone.length === 11) {
        phoneFlag = reg.test(phone)
      }
      that.setData({
        phoneFlag: phoneFlag
      })
      if (!phoneFlag) {
        wx.showToast({
          title: '手机号码格式不正确',
          icon: 'none'
        })
      }
      console.log('phoneFlag', phoneFlag)
    },

    addPresent() {
      const that = this
      const {name, phone, count, desc} = this.data
      const db = wx.cloud.database()
      const present = db.collection('present')
      present.add({
        data: {
          name,
          phone,
          count,
          desc
        }
      }).then(res => {
        that.setData({
          name: '',
          phone: '',
          count: '自己出席',
          desc: '',
        })
        that.cancel()
      })
    }
  }
 
  
})
