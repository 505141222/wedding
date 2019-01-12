// components/formList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formList:{
      type: Array,
      value: ()=>{
        return []
      }
    },
    flag:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      const that = this
      that.triggerEvent('closeFormlist')
    },
    
  }
})
