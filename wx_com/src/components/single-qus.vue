<!-- 单个问题模板 -->
<template>
  <div class="single-qus">
    <template v-if="obj.qustion">
      <p class="ask-title"> {{obj.qustion.stem}}
        <span class="select-type" v-if="selectType">{{selectType}}</span>
      </p>
      <!--type控制选项的显示方式-->
      <!--type为1显示单选框-->
      <div v-if="askType==1">
        <mt-radio v-model="radioVal" :options="choose">
        </mt-radio>
      </div>
      <!--type为2显示多选框-->
      <div v-if="askType==2">
        <mt-checklist v-model="checkVal" :options="choose">
        </mt-checklist>
      </div>
      <!--type为3显示单选框加文本-->
      <div v-if="askType==3">
        <mt-radio v-model="radioVal" :options="choose">
        </mt-radio>
        <div class="area-block">
          <textarea maxlength="1000" :disabled="!areaDisable" rows="4" cols="30" v-model.trim="areaVal" placeholder="请在此输入您的答案"></textarea>
          <p class="count-character">还剩{{500-areaVal.length}}字</p>
        </div>
      </div>
      <!--type为4显示多选框加文本-->
      <div v-if="askType==4">
        <mt-checklist v-model="checkVal" :options="choose">
        </mt-checklist>
        <div class="area-block">
          <textarea maxlength="1000" :disabled="!areaDisable" rows="4" cols="30" v-model.trim="areaVal" placeholder="请在此输入您的答案"></textarea>
          <p class="count-character">还剩{{500-areaVal.length}}字</p>
        </div>
      </div>
      <!--type为5显示文本-->
      <div v-if="askType==5" class="area-block">
        <p class="p-area">请输入您的回答</p>
        <textarea maxlength="1000" :disabled="!areaDisable" rows="4" cols="30" v-model.trim="areaVal" placeholder="请在此输入您的答案"></textarea>
        <p class="count-character">还剩{{500-areaVal.length}}字</p>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    name: "singleQus",
    props: {
      //对外获取的数据
      obj: Object,
      oldans: Object
    },
    computed: {
      //问题的类型
      askType() {
        return this.obj.qustion.type;
      },
      choose() {
        let arr = this.obj.options || [];
        arr.forEach(element => {
          element.label = element.content;
          element.value = element.id;
        });
        return arr;
      },
      qusId() {
        return (this.obj && this.obj.qustion && this.obj.qustion.id) || "";
      },
      selectType() {
        let type = this.obj.qustion.type;
        if (type == "1" || type == "3") {
          return "单选";
        } else if (type == "2" || type == "4") {
          return "多选";
        } else {
          return "";
        }
      },
      areaDisable() {
        if (this.radioVal == "other" && (this.askType == "1" || this.askType == "3")) {
          return true;
        }
        if (this.checkVal.indexOf("other") > -1 && (this.askType == "2" || this.askType == "4")) {
          return true;
        }
        if (this.askType == "5") {
          return true;
        }
        return false;
      }
    },
    data() {
      return {
        radioVal: "",
        checkVal: [],
        areaVal: ""
      }
    },
    mounted() {},
    methods: {
      getOptValue(oldValue) {
        let optAnswer = null;
        switch (oldValue.qustion.type) {
          case "1":
            optAnswer = this.radioVal
            break;
          case "2":
            optAnswer = this.checkVal.join(",")
            break;
          case "3":
            optAnswer = this.radioVal
            break;
          case "4":
            optAnswer = this.checkVal.join(",")
            break;
          case "5":
            optAnswer = ""
            break;
          default:
            optAnswer = ""
        }
        return optAnswer;
      },
      getRealVal(val) {

      },
      emitParent() {
        this.$emit(`preValueChange`,
          this.obj.qustion.id, // 问题ID
          this.getOptValue(this.obj), // 选项值
          this.areaVal); //文本值
      }
    },
    watch: {
      obj(newValue, oldValue) {
        if (this.qusId != "" && newValue.qustion && oldValue.qustion && (newValue.qustion.id != oldValue.qustion.id)) {
          //将当前的问题答案传给父级
          this.$emit(`preValueChange`,
            oldValue.qustion.id, // 问题ID
            this.getOptValue(oldValue), // 选项值
            this.areaVal); //文本值
          //新的问题时处理逻辑如下:
          let isHaveValue = this.oldans != undefined;
          let type = newValue.qustion.type;
          //获取新问题是否有答案
          this.areaVal = isHaveValue ? (this.oldans.textAnswer || "") : "";
          if (type == "1" || type == "3") {
            this.radioVal = isHaveValue ? (this.oldans.optAnswer || "") : "";
            if (type == "3") {
              if (newValue.options[newValue.options.length - 1].id != "other") {
                newValue.options.push({
                  content: "其他",
                  id: "other"
                })
              }

            }
            this.checkVal = [];
          } else if (type == "2" || type == "4") {
            this.checkVal = isHaveValue ? (this.oldans.optAnswer || "").split(',') : [];
            this.radioVal = "";
            if (type == "4") {
              if (newValue.options[newValue.options.length - 1].id != "other") {
                newValue.options.push({
                  content: "其他",
                  id: "other"
                })
              }
            }
          }
        };
      },
      radioVal() {
        if(this.radioVal!="other"&&this.askType=="3"){
          this.areaVal="";
        }
        this.emitParent();
      },
      checkVal() {
        if(this.checkVal.indexOf("other")<0&&this.askType=="4"){
          this.areaVal="";
        }
        this.emitParent();
      },
      areaVal() {
        this.emitParent();
      }

    },
  }
</script>
<style scoped>
  .ask-title {
    font-weight: bold;
    margin-left: 1rem;
  }

  textarea {
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    width: 100%;
    padding: 0.8rem;
    box-sizing: border-box;
  }

  .p-area {
    margin: 0.5rem 0;
  }

  .count-character {
    font-size: 1.3rem;
    color: cadetblue;
    text-align: right;
  }
</style>
<style>
  .tit-count.top-title .mint-badge.is-primary {
    color: #fff;
  }

  .single-qus .mint-cell-wrapper,
  .single-qus .mint-cell:last-child {
    background-image: none;
  }

  .single-qus .mint-radiolist-label,
  .single-qus .mint-checklist-label {
    padding: 0;
  }

  .single-qus .area-block {
    padding: 0 1rem;
  }

  .select-type {
    color: #38f;
    background: #fff;
    display: inline-block;
    padding: 2px 5px;
    line-height: normal;
    border-width: 1px;
    border-radius: 3px;
    font-size: 1rem;
    margin-left: 0.5rem;
    position: relative;
    top: -0.2rem;
    font-weight: normal;
  }

  .select-type::after {
    border-color: currentColor;
    border-radius: 4px;
    border-width: 1px;
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    transform: scale(0.5);
    pointer-events: none;
    box-sizing: border-box;
    border: 1px solid #38f;
  }
</style>
