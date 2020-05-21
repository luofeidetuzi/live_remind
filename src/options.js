import {getTotalPage,attentionList} from './background'
//获取模板
var renderB = require('./body.art')
var renderF = require('./footer.art')
// 渲染基础布局
async function showBasic(){
    let totalPage = await getTotalPage()
    let numPage = []
    for(let i = 1;i<totalPage+1;i++){
        numPage.push(i)
    }
    const html = renderF({
        numPage,
        })
    //首次渲染到页面
    const footer = document.getElementById('footer')
    footer.innerHTML = html
}
// 保存和清空,onchange()好东西
function saveLocal(){
    var clear = document.getElementById("clear")
    var selectAll = document.getElementById("selectAll")
    var input = document.querySelectorAll('li>input')
    var type = document.getElementById("type")
    var save = document.getElementById("save")
    let storage = window.localStorage;
    // 输入与保存
    save.onclick = function(){
        storage.setItem(type.value, [type.value,false])
        isChecked()
        alert('保存成功，如果你没有写错的话(￣^￣)')
    }
    for(let i = 0; i< input.length; i++){
        input[i].onchange = function(){
            if(input[i].checked){
                storage.setItem(input[i].value, [input[i].value,false])
            }else{
                storage.removeItem(input[i].value)
            }
        }
    }
    // 清空
    clear.onclick = function(){
        for(let i = 0; i< input.length; i++){
            if(input[i].checked){
                input[i].checked = false
            }
        }
        storage.clear()
    }
    // 全选
    selectAll.onclick = function(){
        for(let i = 0; i< input.length; i++){
            input[i].checked = true
            storage.setItem(input[i].value, [input[i].value,false])
        }
    }
    // 遍历localStorage，读取checked的值
    isChecked()
}
// 遍历localStorage，读取checked的值
function isChecked(){
    var input = document.querySelectorAll('li>input')
    for(let i=0;i<localStorage.length;i++){
        let getKey=localStorage.key(i);  
        let getVal=localStorage.getItem(getKey);  
        for(let i = 0; i< input.length; i++){
            if(input[i].value == getVal.split(',')[0]){
                input[i].checked = true
            }
        }
    }
}
// 渲染整个页面
async function showAll(){
    await showBasic()
    await showData(1)
    saveLocal()
    // 这个this是坑
    var button = document.getElementsByClassName("page")
    // console.log(button)
    for(var i = 0;i<button.length+1;i++){
        if(button[i]){
            button[i].onclick = async function(){
                await showData(this.innerText)
                saveLocal()
            }
        }
    }
}
// 渲染数据
async function showData(n){
    let aList = await attentionList(n)
    let startTime = []
    let endTime = []
    for(let i = 0;i<24;i++){
        startTime.push(i)
    }
    for(let i = 1;i<25;i++){
        endTime.push(i)
    }
    const html = renderB({
        title:'选择你想提醒的b站直播',
        list: aList,
        startTime,
        endTime
        })
        //渲染到页面
        const body = document.getElementById('body')
        body.innerHTML = html
        var select = document.getElementsByTagName('select')
        if(!localStorage.getItem('start')&&!localStorage.getItem('end')){
            localStorage.setItem('start',0)
            localStorage.setItem('end',24)
        }
        select[0].options[0].text = localStorage.getItem('start')
        select[1].options[0].text = localStorage.getItem('end')
        select[0].onchange = function(){
        var index = this.selectedIndex; // 选中索引
        localStorage.setItem('start',this.options[index].text)
    }
        select[1].onchange = function(){
            var index = this.selectedIndex; 
            localStorage.setItem('end',this.options[index].text)
        }
}
showAll()
