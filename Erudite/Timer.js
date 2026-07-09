settimer = document.querySelector(".Settimer")
startbtn = document.querySelector(".Start")
Timer = document.querySelector(".Timer")

/*apache e charts code is subject to change*/
const FOCUS_STORAGE_KEY = "productivityFocusData";

function formatDateKey(d) {
    return d.toISOString().slice(0, 10);
}

function todayKey() {
    return formatDateKey(new Date());
}

function getFocusData() {
    try {
        return JSON.parse(localStorage.getItem(FOCUS_STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveFocusData(data) {
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(data));
}

function logFocusedSecond() {
    const data = getFocusData();
    const key = todayKey();
    if (!data[key]) data[key] = { seconds: 0, sessions: 0 };
    data[key].seconds++;
    saveFocusData(data);
}

function logSessionComplete() {
    const data = getFocusData();
    const key = todayKey();
    if (!data[key]) data[key] = { seconds: 0, sessions: 0 };
    data[key].sessions++;
    saveFocusData(data);
}


let hoursglobal = 0;
let minutesglobal=0;
let secondsglobal=0;
let hoursglobalstring = "";
let minutesecondsglobalstring="";
let secondsglobalstring="";



let totalsec=0;



function displaytimestatic(event){
    Timer.classList.remove("Timerform");
    Timer.classList.add("Timer")

   event.preventDefault();

 let hourse=document.querySelector(".hoursi")
 let minutese=document.querySelector(".minutesi")
 let secondse=document.querySelector(".secondsi")

 hoursglobal=Number(hourse.value)
 minutesglobal=Number(minutese.value);
 secondsglobal=Number(secondse.value);


  Timer.innerHTML=`
     <div class="Hours"> ${hourse.value.padStart(2,"0")} </div>
     <div> : </div>
     <div class="Minutes"> ${minutese.value.padStart(2,"0")} </div>
     <div>: </div>
     <div class="Seconds">${secondse.value.padStart(2,"0")} </div>
    `





}
function collectdata(){
    logSessionComplete()
}

function displaytimedynamic(){


Timer.innerHTML=`
     <div class="Hours"> ${hoursglobalstring} </div>
     <div> : </div>
     <div class="Minutes"> ${minutesecondsglobalstring} </div>
     <div>: </div>
     <div class="Seconds">${secondsglobalstring} </div>
     <button class="Stopbtn"> Stop </button> 
    `
  settimer.innerHTML=""
  startbtn.innerHTML=""  
  stopping=document.querySelector(".Stopbtn")
  stopping.addEventListener("click",collectdata)
  stopping.addEventListener("click",function(){
  Timer.innerHTML=`
  <div class="Hours"> 00 </div>
     <div> : </div>
     <div class="Minutes"> 00 </div>
     <div>: </div>
     <div class="Seconds"> 00 </div>
  `
  settimer.innerHTML=`Set Timer`
  startbtn.innerHTML=`Start Timer`  
 clearInterval(intervalID);


  });

}


function converttotime(seconds){
let h=0
let m=0
let s=0
while (seconds >= 3600) {
    h++;
    seconds -= 3600;
}

while (seconds >= 60) {
    m++;
    seconds -= 60;
}

s = seconds;

 hoursglobalstring = String(h).padStart(2,"0");
minutesecondsglobalstring=String(m).padStart(2,"0");
 secondsglobalstring=String(s).padStart(2,"0");
 displaytimedynamic()
}



function processtime(){

totalsec=totalsec + hoursglobal*3600;
totalsec=totalsec + minutesglobal*60;
totalsec=totalsec + secondsglobal;

intervalID = setInterval(function () {

        if (totalsec <= 0) {
            clearInterval(intervalID);
            return;
        }

        totalsec--;
 logFocusedSecond()
 converttotime(totalsec)

}
  , 1000);

}


function addtimeform()
{
 Timer.classList.remove("Timer");
  Timer.classList.add("Timerform")

 Timer.innerHTML='';
 Timer.innerHTML=(`
    
    <form class="inputtime"> 
     <input class="hoursi" placeholder="00" type="number"> 
     <div> : </div>
     <input class="minutesi" placeholder="00" type="number">
     <div> : </div>
     <input class="secondsi" placeholder="00" type="number">
     <button class="submission"> Submit </button>   
    </form>
    
 `);


 submissiono=document.querySelector(".inputtime")
 submissiono.addEventListener("submit", displaytimestatic)

}




startbtn.addEventListener("click",processtime)
settimer.addEventListener("click", addtimeform)
