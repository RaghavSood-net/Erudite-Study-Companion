let eveningbtn = document.querySelector(".Evening");
let morningbtn = document.querySelector(".Morn");
let nightbtn = document.querySelector(".Night");

let highlightve=false
let highlightvm=false
let highlightvn=false

let currentTheme = "evening"
let statsChart = null

const HEATMAP_THEMES = {
    evening: {
        text: "#FFF4D6",
        cellColor: "rgba(255,255,255,0.10)",
        colors: ["#3B2740", "#672A4B", "#F19066"]
    },
    morning: {
        text: "#222c2f",
        cellColor: "rgba(66,85,92,0.10)",
        colors: ["#c9d8da", "#8fa9ad", "#42555C"]
    },
    night: {
        text: "#fbe9ab",
        cellColor: "rgba(255,255,255,0.10)",
        colors: ["#2C3B52", "#48557F", "#fbe9ab"]
    }
}

eveningbtn.classList.add("activee")
morningbtn.classList.remove("activem")
nightbtn.classList.remove("activen")   

function highlighte() {
eveningbtn.classList.add("activee")
morningbtn.classList.remove("activem")
nightbtn.classList.remove("activen")    
changethemee()
}
function highlightm() {
changethemem()
eveningbtn.classList.remove("activee")
morningbtn.classList.add("activem")
nightbtn.classList.remove("activen")   
}

function highlightn() {
changethemen()
eveningbtn.classList.remove("activee")
morningbtn.classList.remove("activem")
nightbtn.classList.add("activen")     
        
}

function changethemen(){
const theme = document.getElementById("theme");
theme.href = "night.css";
const nightbckgrnd = document.querySelector(".Background");
nightbckgrnd.src="night.jpg"
currentTheme = "night"
refreshStatsIfOpen()
}
function changethemem(){
const theme = document.getElementById("theme");
theme.href = "morning.css";
const nightbckgrnd = document.querySelector(".Background");
nightbckgrnd.src="Morning.png"
currentTheme = "morning"
refreshStatsIfOpen()
}

function changethemee(){
const theme = document.getElementById("theme");
theme.href = "index.css";
const nightbckgrnd = document.querySelector(".Background");
nightbckgrnd.src="evening theme.jpg"
currentTheme = "evening"
refreshStatsIfOpen()
}
function CloseOverlay(){
if(statsChart){
    statsChart.dispose();
    statsChart = null;
}
element = document.querySelector(".Overlay");
element.remove();
} 

function Displayquote() {

    let dq = document.querySelector(".Quote");

    fetch("https://quoteslate.vercel.app/api/quotes/random")
        .then(response => response.json())
        .then(data =>{ 
            console.log(data);
            dq.textContent=`${data.quote} - ${data.author}`;
            
            
        }
        )

}
function RenderOverlay() {
    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="Overlay">
         <div class="Quote">        
         </div>
         <div class = "Exit">
         X
         <div>
        </div>
        `
);
let x=document.querySelector(".Exit")
x.addEventListener("click",CloseOverlay)

    Displayquote()
}
   async function processdata()
{  
    let strdata = document.getElementById("data");
    let API_KEY=""
    
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: strdata.value
                    }]
                }]
            })
        }
    );

    const data = await response.json();

console.log("Status:", response.status);
console.log("Response:", data);

if (!response.ok) {
    console.error("Gemini error:", data.error);
    return;
}

updatechatUI(strdata,data);
    
}

async function updatechatUI(strdata,data){  
messagectr=document.querySelector(".msgctr")

    messagectr.insertAdjacentHTML(
        "beforeend",`
         <div class="selfmessage">
         ${strdata.value}
         </div>
         <div class="reply"> ${data.candidates[0].content.parts[0].text}
         </div>

        `
    );
    strdata.value=""
    messagectr.scrollTop=messagectr.scrollHeight




}



/* apache e charts code might be subject to change i am not that familiar with it so a lot of it may not be optimal */

function formatSecondsAsClock(totalSeconds){
    const h = String(Math.floor(totalSeconds/3600)).padStart(2,"0");
    const m = String(Math.floor((totalSeconds%3600)/60)).padStart(2,"0");
    const s = String(Math.floor(totalSeconds%60)).padStart(2,"0");
    return `${h}:${m}:${s}`;
}

function buildHeatmapOption(theme){
    const data = getFocusData();

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 90);

    const seriesData = [];
    let maxVal = 60;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = formatDateKey(d);
        const val = data[key] ? data[key].seconds : 0;
        seriesData.push([key, val]);
        if (val > maxVal) maxVal = val;
    }

    return {
        backgroundColor: "transparent",
        textStyle: { fontFamily: "Elms Sans, sans-serif" },
        tooltip: {
            formatter: function (p) {
                const mins = Math.round(p.data[1] / 60);
                return `${p.data[0]}<br/>${mins} min focused
                         This is sample tooltip text i made for testing`;
            }
        },
        visualMap: {
            min: 0,
            max: maxVal,
            show: false,
            inRange: { color: theme.colors }
        },
        calendar: {
            top: 30,
            left: 20,
            right: 10,
            cellSize: ["auto", 13],
            range: [formatDateKey(start), formatDateKey(end)],
            itemStyle: {
                borderWidth: 2,
                borderColor: "transparent",
                color: theme.cellColor
            },
            splitLine: { show: false },
            yearLabel: { show: false },
            monthLabel: { textStyle: { color: theme.text, fontFamily: "Elms Sans, sans-serif", fontSize: 10 } },
            dayLabel: { textStyle: { color: theme.text, fontFamily: "Elms Sans, sans-serif", fontSize: 9 }, firstDay: 1 }
        },
        series: [{
            type: "heatmap",
            coordinateSystem: "calendar",
            data: seriesData
        }]
    };
}

function refreshStatsIfOpen(){
    if(!statsChart) return;
    const theme = HEATMAP_THEMES[currentTheme];
    statsChart.setOption(buildHeatmapOption(theme));
}

function renderStats(){
    const data = getFocusData();
    const today = data[todayKey()] || { seconds: 0, sessions: 0 };

    document.getElementById("todayTime").textContent = formatSecondsAsClock(today.seconds);
    document.getElementById("todaySessions").textContent = today.sessions;

    const theme = HEATMAP_THEMES[currentTheme];
    const chartDom = document.getElementById("heatmapChart");
    statsChart = echarts.init(chartDom);
    statsChart.setOption(buildHeatmapOption(theme));
}

function RenderOverlayStats(){
    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="Overlay">
         <div class="StatsPanel">
          <div class="StatsTitle">Today's Focus</div>
          <div class="StatsRow">
           <div class="StatBox">
            <div class="StatValue" id="todayTime">00:00:00</div>
            <div class="StatLabel">Focused Time</div>
           </div>
           <div class="StatBox">
            <div class="StatValue" id="todaySessions">0</div>
            <div class="StatLabel">Sessions</div>
           </div>
          </div>
          <div id="heatmapChart"></div>
         </div>
         <div class = "Exit">
         X
         </div>
        </div>
        `
    );
    let x = document.querySelector(".Exit")
    x.addEventListener("click", CloseOverlay)

    renderStats()
}


function RenderOverlaychat(){
document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="Overlay">
         <div class="msgctr">
         </div>
         <form class="chatform">
          <input type="text" id="data" placeholder="Ask a question!"> 
          <button class="submit1" type="submit"> ✉ </button>      
         </form>
         
         <div class = "Exit">
         X
         </div>
        </div>
        `
);
let x=document.querySelector(".Exit")
x.addEventListener("click",CloseOverlay)

let form=document.querySelector(".chatform")
form.addEventListener("submit",function(e){e.preventDefault()})
form.addEventListener("submit",processdata)
 console.log("No refresh!");
}



let chat=document.getElementById("chat")
chat.addEventListener("click", RenderOverlaychat)


let stat=document.getElementById("stat")
stat.addEventListener("click", RenderOverlayStats)


let quote=document.getElementById("cher")
quote.addEventListener("click", RenderOverlay)




eveningbtn.addEventListener("click", highlighte);
morningbtn.addEventListener("click", highlightm);
nightbtn.addEventListener("click", highlightn);
