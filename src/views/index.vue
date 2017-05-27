<style lang="scss">
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
.game_box{
  width: 600px;
  height: 600px;
  margin: 0 auto;
  ul{
    li{
      float: left;
      width: 150px;
      height: 150px;
      font-size: 50px;
      font-weight: 700;
      border: 1px solid #666;
      box-sizing: border-box;
      margin-top: -1px;
      margin-left: -1px;
      cursor: pointer;
      color: #f00;
      background: url(../assets/ilove.jpg) no-repeat left top;
      background-size: 600px 600px;
      &.active{
        background: #ccc;
        cursor: default;
      }
    }
  }
}
.reset{
  margin-top: 30px;
  button{
    width: 100px;
    height: 40px;
    background-color: #f99;
    border: 0;
    cursor: pointer;
    border-radius: 6px;
  }
}
</style>

<template>
  <div class="app">
    <h1>{{ msg }}</h1>
    <img src="../assets/ilove.jpg" height="200" width="200" alt="" />
    <div class="game_num">
      <select v-model="puzzle_num" @change="initPulzz(puzzle_num)">
        <option value="3" checked>3 x 3</option>
        <option value="4">4 x 4</option>
        <option value="5">5 x 5</option>
      </select>
    </div>
    <div class="game_box">
      <ul>
        <li class="little" :class="{'active': puzzle == doub_num || puzzle == ''}" v-for="(puzzle,key) in puzzles" v-text="puzzle != doub_num ? puzzle : ''" @click="moveAction(puzzle,key)"></li>
      </ul>
    </div>
    <div class="reset">
      <button @click="initPulzz(puzzle_num)">重置游戏</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your puzzle game',
      // 初始数组
      puzzles: [],
      puzzle_num: 3,
      doub_num: null
    }
  },
  methods: {
    initPulzz (val){
      this.puzzles = [];
      this.puzzle_num = Number(this.puzzle_num);
      this.doub_num = val * val;

      for(let i = 0; i < this.doub_num; i++){
        this.puzzles.push(i+1);
      }
      this.puzzles.sort( () => { return Math.random() - 0.5 });
      this.hasSolve(this.puzzles);
    },
    moveAction (val,index){
      let gameBoxs = document.querySelectorAll('.little');
      let leftNum = this.puzzles[index - 1],
          rightNum = this.puzzles[index + 1],
          topNum = this.puzzles[index - this.puzzle_num],
          bottomNum = this.puzzles[index + this.puzzle_num];

      let str = '';
      // 判断上下左右数据交换位置
      if(leftNum === '' && index % this.puzzle_num){
        this.$set(this.puzzles,index - 1, val);
        this.$set(this.puzzles,index, '');

        str = gameBoxs[index].style.backgroundPosition;
        gameBoxs[index].style.backgroundPosition = gameBoxs[index-1].style.backgroundPosition;
        gameBoxs[index-1].style.backgroundPosition = str;
      }else if(rightNum === '' && index  % this.puzzle_num !== this.puzzle_num - 1){
        this.$set(this.puzzles,index + 1, val);
        this.$set(this.puzzles,index, '');

        str = gameBoxs[index].style.backgroundPosition;
        gameBoxs[index].style.backgroundPosition = gameBoxs[index+1].style.backgroundPosition;
        gameBoxs[index+1].style.backgroundPosition = str;
      }else if(topNum === ''){
        this.$set(this.puzzles,index - this.puzzle_num, val);
        this.$set(this.puzzles,index, '');

        str = gameBoxs[index].style.backgroundPosition;
        gameBoxs[index].style.backgroundPosition = gameBoxs[index-this.puzzle_num].style.backgroundPosition;
        gameBoxs[index-this.puzzle_num].style.backgroundPosition = str;
      }else if(bottomNum === ''){
        this.$set(this.puzzles,index + this.puzzle_num, val);
        this.$set(this.puzzles,index, '');

        str = gameBoxs[index].style.backgroundPosition;
        gameBoxs[index].style.backgroundPosition = gameBoxs[index+this.puzzle_num].style.backgroundPosition;
        gameBoxs[index+this.puzzle_num].style.backgroundPosition = str;
      }
      if(val){
        this.passFn();
      }
    },
    passFn (){
      let nums = this.puzzle_num * this.puzzle_num - 1;
      if(this.puzzles[nums] === ''){
        const puzzles = this.puzzles.slice(0, nums);
        // Array.every(),对每一个元素判断返回true或false，全为true时返回true
        const isPass = puzzles.every( (e, i) => e === i + 1 );
        if(isPass){
          let timer = setTimeout(() => {
            alert('YOU ARE WIN!');
            clearTimeout(timer);
          }, 100);
        }
      }
    },
    // 判断数组的逆序数和是否为偶数，为偶数时有解能还原
    // http://baike.baidu.com/link?url=ZqZpv_PbvAzwu9tqdJ_i4VgCh6Bn52VIPcQQpIias09XKdSZ-RJT_Ht44OmUwcPBuXJoUebJOaa66LvAMmLDl51-dCttzp6rIe0AoRnHFlM-CstIacIaxR2PzW0vmO74，逆序数和的概念和求法
    hasSolve (arr){
      let count = 0, len = arr.length;

      for(let i = 0;i < len - 1; i++){
        for(let j = i + 1; j < len; j++){
          if(arr[i] > arr[j]){
            count ++;
          }
        }
      }
      let array = arr;
      if(count % 2 == 0){
        // 将最后一个数置为空
        this.$nextTick( () => {
          let gameBoxs = document.querySelectorAll('.little');
          let wh = 600 / this.puzzle_num;
          let len = this.puzzles.length;

          for(let i = 0; i < len; i++){
            let e = this.puzzles[i] - 1;
            gameBoxs[i].style.cssText =  'width: '+ wh +'px;height: '+ wh +'px;line-height:'+ wh +'px';
            
            if(e < this.puzzle_num){
              gameBoxs[i].style.backgroundPosition = -e * wh +'px 0';
            }else if(e >= this.puzzle_num && e < this.puzzle_num * 2){
              gameBoxs[i].style.backgroundPosition = -(e % this.puzzle_num) * wh +'px '+ -(1 * wh) +'px';
            }else if(e >= this.puzzle_num * 2 && e < this.puzzle_num * 3){
              gameBoxs[i].style.backgroundPosition = -(e % this.puzzle_num) * wh +'px '+ -(2 * wh) +'px';
            }else if(e >= this.puzzle_num * 3 && e < this.puzzle_num * 4){
              gameBoxs[i].style.backgroundPosition = -(e % this.puzzle_num) * wh +'px '+ -(3 * wh) +'px';
            }else if(e >= this.puzzle_num * 4 && e < this.puzzle_num * 5){
              gameBoxs[i].style.backgroundPosition = -(e % this.puzzle_num) * wh +'px '+ -(4 * wh) +'px';
            }
            if((e + 1) === this.doub_num){
              this.puzzles[i] = '';
            }
          }
        })
      }else{
        this.initPulzz(this.puzzle_num);
      }
    }
  },
  mounted (){
    // 初始化数组个数
    this.initPulzz(this.puzzle_num);
  }
}
</script>


