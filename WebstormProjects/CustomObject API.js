/**
 * Created by kim on 2017-02-04.
 */
/** Created "CustomObjectAPI.js" File From JetBrains WebStorm 2016.3.3 **/
/** Author : DongYeong Kim **/
/** ReEngineered Since 2017-02-02 For Making IDE TOOL(Graduation Stuff And Writing) And Some Applying New Feature. */

/** Changed Simple Feature Note
 *
 *  1. Refined Displaying, Collision Detecting Algorithm.
 *  [Previous]
 *  -> Used Infinite Timer To Display All Objects(Non-Moving Objects Drawing Included)
 *  -> Supported Only CustomObject.IsObjectIn(object) Method.
 *
 *  [Newly Changed]
 *  -> Alert Object to call its Image Using Some Function Instantly.
 *  -> Added CustomObject.IsObjectOut(object) Method to Detect Collision From outer Object.
 *
 *
 *
 *  2. Added New(Changed, Previous Version Not Supported) Internal CustomObject Storage Structure.
 *  Note : I've got to Solve changing dead chain(dangled from origin pointer address) variable to default value to recognize disappeared Object because of javascript's call by reference.
 *  [Previous]
 *  -> variable
 *
 *  [Newly Changed]
 *  ->
 *
 *
 *
 *  3. Added New Default Design Objects for Fast Making Briefing Program.
 *  [Previous]
 *  -> Just Create Default Object Using AddCustomObject(); Global Function.
 *
 *  [Newly Changed]
 *  -> Added Rectangle, Circle, Cube, ETC... Pre-Manufactured Functions(Creation Function)
 *  -> Added Default Pre-Manufactured Form Functions.
 *
 *
 *
 *  4. Changed CustomObject's Object Variable Usage. (Not Preciously Determined)
 *  [Previous]
 *  AddCustomObject();
 *
 *  [Newly Changed]
 *  var foo = AddCustomObject(name="",x=0,y=0,z=0,width,height,length,name);
 *
 *
 *
 *  5. Added Conceptional Class And Methods
 *  [Newly Changed]
 *  -> Added Frame, Panel, LinearLayout, FlowLayout, And So on.
 *
 *
 *
 *  6. To Be Continued....
 *
 *
 *  [2017-03-21 Changelog]
 *  Property originX, originY included CustomObject Object Are Added To Remember Origin Position.
 * **/


//CustomObject Class declaration


/**
 *  Notice!!
 *
 *  this.FunctionName=function(Arguments...)
 *  {
         *  }// Means Public Function (You Can Access)
 *
 *  function FunctionName(Arguments...)
 *  {
         *  }// Means Private Function (You Can't Access, Only Used ForInner Object)
 *
 *
 */

//Global Data-Structure Declaration
{
    var CustomObjectList=[];//Stack-Structure Data
    var CustomObjectList_Wait=[];//only stored as Object index
    var CustomObjectList_Pointer=[];//Sorted By Index, Just Pointing For Viewing, Event, Etc.
}

// Class Declaration.
{
    var CustomObject=function(){
        this.constructor=CustomObject;
        this.id=0;
        this.name="undefined";
        this.type="undefined";
        this.hp=1;
        this.lineWidth=0.5;
        this.x=0;
        this.y=0;
        this.z=0;
        this.speed_x=0;
        this.speed_y=0;
        this.width=0;
        this.height=0;
        this.imgSrc="";
        this.fillStyle="red";
        this.strokeStyle="black";
        this.display=false;/* D*/
        this.visibility=false;/* Hide Object, Existed*/
        this.direction=1;
        this.deadsign=undefined;
        this.left=this.x-this.width/2;
        this.right=this.x+this.width/2;
        this.top=this.y-this.height/2;
        this.bottom=this.y+this.height/2;
        this.property=undefined;
        this.shadowOffsetX=0;
        this.shadowOffsetY=0;
        this.shadowBlur=0;
        this.shadowColor="transparent";
        this.globalAlpha=1;
        this.text=this.name;
        this.font="14pt 궁서체"
        this.attackcool=0
        this.movePatternHandler=undefined;
        this.zIndex=undefined;
        this.eventTransparent=false;
        this.originX;       /* Appended At 2017-03-21 For Saving Temporary Origin Position Data When Moved To Another To Remember. */
        this.originY;       /* Appended At 2017-03-21 For Saving Temporary Origin Position Data When Moved To Another To Remember. */
        this.displayName=function(context) {
            var str="name : "+this.name+" id : "+this.id + "("+Math.round(this.x)+", "+Math.round(this.y)+")"+" hp : "+this.hp;
            var top=this.y-this.height/2;
            context.font=this.font;
            context.textAlign="center";
            context.textBaseline="bottom";
            context.strokeStyle="rgb(192,192,192)"
            context.fillStyle="green";
            context.lineWidth=1;
            context.fillText(str,this.x,top);
            context.strokeText(str,this.x,top);
        }
        this.objectPoint=new Array();
        function objectPointClear(){
            console.log(this.name+" : objectPoint Clear Function Activated!!");
            var i=this.objectPoint.length;
            for(;i>0;i++)
                this.objectPoint.pop();
            console.log(this.name+" : objectPoint Clear Function Finished!!")
        }
        this.move=function(time){
            time/=1000;
            this.x+=this.speed_x*time;
            this.y+=this.speed_y*time;
        }
        this.isObjectIn=function(x,y,width,height,closePathTrue){
            //x : Center of CustomObject XPosition
            //y : Center of CustomObject YPosition
            //width : all of CustomObject Width (left : x-width/2, right : x+width/2)
            //height : all of CustomObject Height (top : y-height/2). bottom : y+height/2)
            //closePathTrue : Consider All Paths Boundaries Are Surrounded(like context.closePath();, context.fill();), false is default.
            //              if(this.objectPoint.length<2)return;
            var idx;
            var isIn=false;
            var left=x-width/2;
            var right=x+width/2;
            var top=y-height/2;
            var bottom=y+height/2;
            //               alert("left : "+x +"\n"+"right : "+right+"\n"+"top : "+top+"\n"+"bottom : "+bottom);
            /*                if(closePathTrue==true);
             else {
             for (idx = 1; idx < this.objectPoint.length; idx++) {

             }
             }*/
            //check isIn
            if((Math.abs(this.x-x)<=Math.abs(this.width/2+width/2)&&(Math.abs(this.y-y)<=Math.abs(this.height/2+height/2)))&&isIn==false)isIn=true;
            else isIn=false;
            return isIn;
        }
        this.draw=function(context,drawType){
            if(this.display==false)return;
            if(drawType=="image"){
                context.beginPath();
                var direction=this.direction/Math.abs(this.direction);
                var image=new Image();
                image.src=this.imgSrc;
                context.save();//must written
                context.scale(direction,1);
                context.drawImage(image,(this.x-this.width/2)*direction,this.y-this.height/2,this.width*direction,this.height);
                context.scale(1,1);//restore origin state
                context.restore();//must written
            }
            else {
                var idx = 0;
                if (this.objectPoint.length <= 0)return;
                context.beginPath();
                context.fillStyle = this.fillStyle;
                context.strokeStyle = this.strokeStyle;
                context.lineWidth = this.lineWidth;
                context.moveTo(this.objectPoint[0].x, this.objectPoint[0].y);
                context.LineTo(this.objectPoint[0].x, this.objectPoint[0].y);
                for (idx = 1; idx < this.objectPoint.length; idx++) {
                    context.LineTo(this.objectPoint[idx].x, this.objectPoint[idx].y);
                }
                context.stroke();
            }
        }
        this.setMovePattern=function(myFunc,time){
            if(this.movePatternHandler!==undefined){
                console.log("Error : movePatternHandler Setting Failed(Already Exist!!)");
                return;
            }
            else {
                this.movePatternHandler=setInterval(myFunc,time);
            }
        }
        this.removeMovePatternHandler=function(){
            if(this.movePatternHandler===undefined){
                console.log("Error : removeMovePatternHandler Setting Failed!!(Alreay Exist!!)");
                return;
            }
            else{
                clearInterval(this.movePatternHandler);
                this.movePatternHandler=undefined;
            }
        }
        //abstract event functions(about Objects), THESE EVENT FUNCTION ARE MUST BE OVERRIDDEN!!(replaced only one function)
        this.onclick=function(event){
            console.log(this.name +"(id : "+this.id+")"+ " : onclick EventListener Occured!! ("+event.offsetX+","+event.offsetY+")");
        }
        this.onmousemove=function(event){

        }
        this.onmousedown=function(event){

        }
        this.onmouseup=function(event){

        }
        this.onobjectin() = function(){};
        this.addCustomObjectEventListener=function(eventType,enrollFunc){
            switch(eventType)
            {
                case "click":
                    this.onclick=enrollFunc;
                    break;
                case "mousemove":
                    this.onmousemove=enrollFunc;
                    break;
                case "mousedown":
                    this.onmousedown=enrollFunc;
                    break;
                case "mouseup":
                    this.onmouseup=enrollFunc;
                    break;
                case "objectin":
                    this.onobjectin = enrollFunc;
                    break;

            }
        }
        this.removeCustomObjectEventListener=function(eventType){
            switch(eventType)
            {
                case "click":
                    this.onclick=undefined;
                    break;
                case "mousemove":
                    this.onmousemove=undefined;
                    break;
                case "mousedown":
                    this.onmousedown=undefined;
                    break;
                case "mouseup":
                    this.onmouseup=undefined;
                    break;
                case "objectin":
                    this.onobjectin = undefined;
                    break;
            }
        }
        this.removeCustomObject=function(){
            DeleteCustomObject(CustomObjectList,CustomObjectList_Wait,this.id);
        }
    }
    var CustomScreen=function(CanvasName){
        this.constructor=CustomScreen
        var width=1024;
        var height=800;
        var time=30;
        var CanvasName=CanvasName;
        var canvas=document.getElementById(CanvasName);
        var context=canvas.getContext("2d");
        var screenLoad=null;//EventListener Handle Check Variable
        var timerLoad=null;//Timer Handler Check Variable
        var TimerFunctionList=[];/* Timer(CustomTimer, Interval) Handle Stored Array, Linear Variant Queue */
        var handler_OnclickListener=null;
        this.mouseEvent=undefined;
        function CustomWM_PAINT()
        {
            context.clearRect(0,0,width,height);
            context.beginPath();
            context.globalComopsiteOperation="source-over";//set Deafault GlobalCompositeOperation
            var temp_obj;
            //context.fillRect(100,100,100,100);
            var idx;
            for(idx=0;idx<CustomObjectList.length;idx++)
            {
                if(CustomObjectList[idx]!=undefined){
                    context.globalAlpha=CustomObjectList[idx].globalAlpha;
                    context.shadowOffsetX=CustomObjectList[idx].shadowOffsetX;
                    context.shadowOffsetY=CustomObjectList[idx].shadowOffsetY;
                    context.shadowBlur=CustomObjectList[idx].shadowBlur;
                    context.shadowColor=CustomObjectList[idx].shadowColor;
                    CustomObjectList[idx].draw(context,"image");
                                           CustomObjectList[idx].displayName(context);
                }
            }
        }
        function CustomObjectMove(){
            var temp_obj;
            var idx;
            for(idx=0;idx<CustomObjectList.length;idx++)
            {
                if(CustomObjectList[idx]!=undefined){
                    CustomObjectList[idx].move(time);
                    //                       patternMosquito(CustomObjectList[idx]);
                }
            }
        }
        this.StartLoadScreen=function(){
            if(screenLoad==null) {
                screenLoad = setInterval(CustomWM_PAINT, time);
                timerLoad = setInterval(CustomObjectMove, time);
            }
            else console.log("Display Already Loaded!!");
        }
        this.CloseLoadScreen=function(){
            if(screenLoad==null)console.log("Don't Have to Close this Screen!!");
            else{
                clearInterval(screenLoad);
                clearInterval(timerLoad);
                screenLoad=null;
            }
        }
        this.addCustomScreenEventListener=function(){
            var canvas=document.getElementById(CanvasName);
            canvas.addEventListener("click",this.onclick);
            canvas.addEventListener("mousemove",this.onmousemove);
            canvas.addEventListener("mousedown",this.onmousedown);
            canvas.addEventListener("mouseup",this.onmouseup);
        }
        this.removeCustomScreenEventListener=function(){
            var canvas=document.getElementById(CanvasName);
            canvas.removeEventListener("click",this.onclick);
            canvas.removeEventListener("mousemove",this.onmousemove);
            canvas.removeEventListener("mousedown",this.onmousedown);
            canvas.removeEventListener("mouseup",this.onmouseup);
        }
        this.onclick=function(event){
//                alert(event.offsetX+" , "+event.offsetY);

            var mouse_x=event.offsetX;
            var mouse_y=event.offsetY;
            var mouse_pointer=findCustomObjectByName("MOUSE_POINTER");
            if(mouse_pointer!==undefined){
                mouse_pointer.x=event.offsetX;
                mouse_pointer.y=event.offsetY;
            }
//                alert(CustomObjectList[3].isObjectIn(mouse_x,mouse_y,10,10)+ " , "+CustomObjectList[3].x+" , "+CustomObjectList[3].y+" , "+CustomObjectList[3].width+" , "+CustomObjectList[3].height+" , "+mouse_x+" , "+mouse_y);
            var idx=0;
            var eventActivated=false;
            for(idx=CustomObjectList.length-1;idx>=0;idx--)
            {
                if(CustomObjectList[idx]==undefined||(CustomObjectList[idx].onclick==undefined||CustomObjectList[idx].onclick==null||(CustomObjectList[idx].eventTransparent!==true&&eventActivated==true)))continue;
                if(CustomObjectList[idx].isObjectIn(mouse_x,mouse_y,10,10)==true)
                {
//                        alert(CustomObjectList[idx].name+" 이벤트 발생");
                    if(CustomObjectList[idx].eventTransparent!==true)eventActivated=true;
                    CustomObjectList[idx].onclick(event);

//                        if(CustomObjectList[idx]===undefined||CustomObjectList[idx].name!=="MOUSE_POINTER")break;
                }
            }
        }
        this.onmousemove=function(event){
            var mouse_x=event.offsetX;
            var mouse_y=event.offsetY;
            var mouse_pointer=findCustomObjectByName("MOUSE_POINTER");
            if(mouse_pointer!==undefined){
                mouse_pointer.x=event.offsetX;
                mouse_pointer.y=event.offsetY;
            }
//                alert(CustomObjectList[3].isObjectIn(mouse_x,mouse_y,10,10)+ " , "+CustomObjectList[3].x+" , "+CustomObjectList[3].y+" , "+CustomObjectList[3].width+" , "+CustomObjectList[3].height+" , "+mouse_x+" , "+mouse_y);
            var idx=0;
            var eventActivated=false;
            for(idx=CustomObjectList.length-1;idx>=0;idx--)
            {
                if(CustomObjectList[idx]==undefined||(CustomObjectList[idx].onclick==undefined||CustomObjectList[idx].onclick==null||(CustomObjectList[idx].eventTransparent!==true&&eventActivated==true)))continue;
                if(CustomObjectList[idx].isObjectIn(mouse_x,mouse_y,10,10)==true)
                {
//                        alert(CustomObjectList[idx].name+" 이벤트 발생");
                    if(CustomObjectList[idx].eventTransparent!==true)eventActivated=true;
                    CustomObjectList[idx].onmousemove(event);
//                        if(CustomObjectList[idx]===undefined||CustomObjectList[idx].name!=="MOUSE_POINTER")break;
                }
            }
        }
        this.onmousedown=function(event){
            var mouse_x=event.offsetX;
            var mouse_y=event.offsetY;
            var mouse_pointer=findCustomObjectByName("MOUSE_POINTER");
            if(mouse_pointer!==undefined){
                mouse_pointer.x=event.offsetX;
                mouse_pointer.y=event.offsetY;
            }
//                alert(CustomObjectList[3].isObjectIn(mouse_x,mouse_y,10,10)+ " , "+CustomObjectList[3].x+" , "+CustomObjectList[3].y+" , "+CustomObjectList[3].width+" , "+CustomObjectList[3].height+" , "+mouse_x+" , "+mouse_y);
            var idx=0;
            var eventActivated=false;
            for(idx=CustomObjectList.length-1;idx>=0;idx--)
            {
                if(CustomObjectList[idx]==undefined||(CustomObjectList[idx].onclick==undefined||CustomObjectList[idx].onclick==null||(CustomObjectList[idx].eventTransparent!==true&&eventActivated==true)))continue;
                if(CustomObjectList[idx].isObjectIn(mouse_x,mouse_y,10,10)==true)
                {
//                        alert(CustomObjectList[idx].name+" 이벤트 발생");
                    if(CustomObjectList[idx].eventTransparent!==true)eventActivated=true;
                    CustomObjectList[idx].onmousedown(event);
//                        if(CustomObjectList[idx]===undefined||CustomObjectList[idx].name!=="MOUSE_POINTER")break;
                }
            }
        }
        this.onmouseup=function(event){
            var mouse_x=event.offsetX;
            var mouse_y=event.offsetY;
            var mouse_pointer=findCustomObjectByName("MOUSE_POINTER");
            if(mouse_pointer!==undefined){
                mouse_pointer.x=event.offsetX;
                mouse_pointer.y=event.offsetY;
            }

//                alert(CustomObjectList[3].isObjectIn(mouse_x,mouse_y,10,10)+ " , "+CustomObjectList[3].x+" , "+CustomObjectList[3].y+" , "+CustomObjectList[3].width+" , "+CustomObjectList[3].height+" , "+mouse_x+" , "+mouse_y);
            var idx=0;
            var eventActivated=false;
            for(idx=CustomObjectList.length-1;idx>=0;idx--)
            {
                if(CustomObjectList[idx]==undefined||(CustomObjectList[idx].onclick==undefined||CustomObjectList[idx].onclick==null||(CustomObjectList[idx].eventTransparent!==true&&eventActivated==true)))continue;
                if(CustomObjectList[idx].isObjectIn(mouse_x,mouse_y,10,10)==true)
                {
//                        alert(CustomObjectList[idx].name+" 이벤트 발생");
                    if(CustomObjectList[idx].eventTransparent!==true)eventActivated=true;
                    CustomObjectList[idx].onmouseup(event);
//                        if(CustomObjectList[idx]===undefined||CustomObjectList[idx].name!=="MOUSE_POINTER")break;
                }
            }
        }
        this.AttackCool=function(){
            for(idx=CustomObjectList.length-1;idx>=0;idx--)
            {
                if(CustomObjectList[idx]<=0||CustomObjectList[idx]==undefined)continue;
                else {
                    if(CustomObjectList[idx].attackcool-time<0)
                        CustomObjectList[idx].attackcool=0;
                    else
                        CustomObjectList[idx].attackcool-=time;
                }
            }
        }
        function CustomWM_TIMER(name,myFunc,time){
            this.time=time;//per miliseconds
            this.myFunc=myFunc;
            this.name=name;//CustomWM_TIMER's Name
            this.handle=undefined;
        }
        this.resetCustomScreenState=function(){
            FlushCustomObject(CustomObjectList);
            this.removeCustomScreenTimerFunctionAll();
        }
        this.addCustomScreenTimerFunction=function(myFunc,mytime){
            var idx;
            if(mytime==undefined)mytime=time;//Screen's Time;
            idx=TimerFunctionList.length;
            TimerFunctionList.push();
            TimerFunctionList[idx]=new CustomWM_TIMER(idx,myFunc,mytime);
            TimerFunctionList[idx].handle=setInterval(TimerFunctionList[idx].myFunc,TimerFunctionList[idx].time);
        }
        this.removeCustomScreenTimerFunction=function(idx){
            if(TimerFunctionList.length<=0) {
                console.log("Failed : Nothing to Remove TimerFunctionList Function!!");
                return;
            }
            else if(TimerFunctionList.length-1>idx||idx<0){
                console.log("Failed : Please Input Correct Index!!");
                return;

            }
            clearInterval(TimerFunctionList[idx].handle);
            TimerFunctionList[idx].handle=undefined;
            removeArrayIndex(TimerFunctionList,idx);
        }
        this.removeCustomScreenTimerFunctionAll=function(){
            for(i=TimerFunctionList.length-1;i>=0;i--){
                this.removeCustomScreenTimerFunction(i);
            }

        }
        this.FlushCustomScreenTimerFunction=function(){
            for(var i=TimerFunctionList.length-1;i>=0;i--){
                clearInterval(TimerFunctionList[i].handle);
                TimerFunctionList.pop();
            }
            for(var i=TimerFunctionList_Wait.length;i>0;i--)
                TimerFunctionList_Wait.pop();
            console.log("FlushCustomScreenTimerFunction Function Occured!!");
        }
    }
}
// Object Control Declaration.
{
    function AddCustomObject(CustomObjectList,CustomObjectList_Wait,x,y,width,height,name,imgSrc,display,zIndex,eventTransparent){
        var idx;
        if(!(CustomObjectList_Wait==undefined||CustomObjectList_Wait.length<1))
        {
            idx=CustomObjectList_Wait[0];
            CustomObjectList_Wait.shift();
            CustomObjectList[idx]=new CustomObject();
            CustomObjectList[idx].x=x;
            CustomObjectList[idx].y=y;
            CustomObjectList[idx].width=width;
            CustomObjectList[idx].height=height;
            CustomObjectList[idx].name=name;
            CustomObjectList[idx].imgSrc=imgSrc;
            CustomObjectList[idx].id=idx;
            CustomObjectList[idx].zIndex=zIndex;
            CustomObjectList[idx].eventTransparent=eventTransparent;
            if(display==true)CustomObjectList[idx].display=display;
            else CustomObjectList[idx].display=false;
            /*             if(onclickFunction!==undefined)
             CustomObjectList[idx].addCustomObjectEventListener("click",onclickFunction);*/
            return CustomObjectList[idx];
        }
        else{
            idx=CustomObjectList.length;
            CustomObjectList.push(new CustomObject());
            CustomObjectList[idx].x=x;
            CustomObjectList[idx].y=y;
            CustomObjectList[idx].width=width;
            CustomObjectList[idx].height=height;
            CustomObjectList[idx].name=name;
            CustomObjectList[idx].imgSrc=imgSrc;
            CustomObjectList[idx].id=idx;
            CustomObjectList[idx].zIndex;
            CustomObjectList[idx].eventTransparent=eventTransparent;
            if(display==true)CustomObjectList[idx].display=display;
            else CustomObjectList[idx].display=false;
            /*              if(onclickFunction!==undefined)
             CustomObjectList[idx].addCustomObjectEventListener("click",onclickFunction);*/
            return CustomObjectList[idx];
        }
    }
    function DeleteCustomObject(CustomObjectList,CustomObjectList_Wait,idx){
        if(idx>CustomObjectList.length-1&&idx<0){
            console.log("Cannot Delete this index : "+idx);
            return;
        }
        if(idx==CustomObjectList.length-1){
            if(CustomObjectList[idx].movePatternHandler!==undefined)CustomObjectList[idx].removeMovePatternHandler();
            CustomObjectList.pop();
        }
        else{
            CustomObjectList_Wait.push(idx);
            if(CustomObjectList[idx].movePatternHandler!==undefined)CustomObjectList[idx].removeMovePatternHandler();
            CustomObjectList[idx]=undefined;
        }
    }
    function FlushCustomObject(CustomObjectList){
        console.log("CustomObjectList Array Flush Function Occured!!\n");
        var idx;
        for(idx=CustomObjectList.length-1;idx>=0;idx--)
            CustomObjectList.pop();
    }
    function findCustomObjectByName(objName){
        var idx;
        for(idx=CustomObjectList.length-1;idx>=0;idx--) {
            if(CustomObjectList[idx]==undefined)continue;
            if (CustomObjectList[idx].name == objName) {
//                    console.log("found the name By CustomObjectById(" + CustomObjectList[idx].name + ")");
                return CustomObjectList[idx];
            }
        }
//            return console.log("Error : Not found the name By CustomObjectById!!("+objName+")");
    }
}


