
function addOrResizeCanvas(containerId, canvasId, newWidth, newHeight) {
    let container = document.getElementById(containerId);
    let oldCanvas = document.getElementById(canvasId);
    if (oldCanvas) {oldCanvas.parentNode.removeChild(oldCanvas)};
    let newCanvas = document.createElement('canvas');
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    newCanvas.id = canvasId;
    container.appendChild(newCanvas); 
    return newCanvas;
}

function fontsizeForRadius(radius) { return Math.ceil(radius/25); }
function digits(number) { if (number ==0 ) {return 1} else {return (Math.floor(Math.log10(number))+1); }}
function halfLengthOfNumber(number, fontsize) {return halfLengthOfText( number.toString(), fontsize)}
function halfLengthOfText(text, fontsize){
    let fontwidth=fontsize/1.8;
    return (((text.length-1)/2)*fontwidth + fontwidth/2);
}
function textplacing(radius, length, fontsize, direction) { 
    if (direction == 1)  return -radius-(length+fontsize /8)*direction
    else if (direction == -1) return -radius-(length+fontsize)*direction
}
function degToRad(degrees) { return degrees * (Math.PI/180); }
function radToDeg(radian) {return radian*180 /Math.PI; }

function drawTicks(context, radius, fontsize, offset, kind) {
    context.save();
    for(var angle = 0; angle < 360; angle+=10) {
        var length = fontsize/4;
        var inscription = -1;
        if (angle % 90 == 0) {
            context.font = Math.floor(fontsize*1.2).toString() +'px '+this.fontFamily;
        } else {
            context.font = (fontsize).toString() +'px '+this.fontFamily;
        }
        if (angle % 30 == 0) {
            length=length*2;
        }
        if ( angle%30 == 0 && (kind == "compass" || angle <= 180))  { 
            inscription = angle
        }
        if ((angle%30 ==0 && kind == "boat" && angle > 180) || (angle ==0 && kind == "compass")) { 
            inscription = 360-angle
        }
        if ((inscription > 0) || (inscription == 0 && kind =="boat")) {
             context.fillText(inscription.toString(),-halfLengthOfNumber(inscription,fontsize),textplacing(radius, length, fontsize, offset));
        }
        context.moveTo(0,-radius);
        context.lineTo(0,-radius-(length)*offset);
        context.stroke();
        context.rotate(Math.PI/18);
    }
    context.restore();
}

let historySet = {COG:[], TWD:[], AWA:[], HDG: [], TWA:[]};

function drawGaugeHistory(degree, abbreviation, color, canvas,x,y,radius,fontsize, offset, relativeTo) {
    let context = canvas.getContext("2d");
    if (!Object.keys(historySet).includes(abbreviation) ) {historySet.push({abbreviation: new Array()})}
    let history = historySet[abbreviation];
    context.fillStyle=color;
    context.strokeStyle=color;
    let pinheadSize = fontsize*0.3;
    history.unshift({'degree':degree});
    history=history.slice(0,10);
    let opacity=1;
    let y1=-radius-pinheadSize*1.8;
    let y2=-radius-pinheadSize*3.6;
    if (offset == -1) {
        y1=-radius+pinheadSize*1.8;
        y2=-radius+pinheadSize*3.6;
    }
    for (var i = 0; i<history.length; i++) {
        context.save();
        context.translate(x,y);
        context.rotate(degToRad(history[i].degree));
        if (relativeTo == "north") {
            context.rotate(degToRad(viewModel.heading));
        }
        context.globalAlpha=opacity;
        context.beginPath();
        context.arc( 0 , y1, pinheadSize , 0, Math.PI*2);
        context.stroke();
        context.fill();
        context.moveTo(0,y1);
        context.lineTo(0,y2);
        context.stroke();
        context.restore();
        opacity -= 1/10;
    }
}

function drawHistoryTail(degree, abbreviation, color, canvas1,x,y,radius,fontsize, offset, relativeTo){
    let context = canvas1.getContext("2d");
    if (!Object.keys(historySet).includes(abbreviation) ) {historySet.push({abbreviation: new Array()})}
    let history = historySet[abbreviation];
    context.save();
    context.translate(x,y);
    context.fillStyle=color;
    context.strokeStyle=color;
    let pinheadSize = fontsize*0.3;
    history.unshift({'degree':degree});
    history=history.slice(0,30);
    let opacity=1;
    let y1=-pinheadSize*1.8;
    let rotation =0;
    for (var i = 0; i<history.length; i++) {
        rotation = degToRad(history[i].degree+180+viewModel.heading);
        context.rotate(rotation);
        context.globalAlpha=opacity;
        context.beginPath();
        context.arc( 0 , y1, pinheadSize , 0, Math.PI*2);
        context.stroke();
        context.fill();
        context.rotate(-rotation);
        opacity -= 1/30;
        y1 -=pinheadSize*1.8;
    }
    context.restore();
}

function drawGauge(degree, abbreviation, color, canvas,x,y,radius,fontsize, offset, relativeTo) {
    let context = canvas.getContext("2d");
    let bendstrength =fontsize*1.6;
    let ticklength=fontsize/2;
    let tipradius = radius+1;
    let baseradius = radius*1.2;
    let inscriptionradius = radius*1.125;
    let bendradius = radius*1.125;
    let abbreviationradius = radius*1.08;
    if (offset == -1) {
        tipradius = radius-2;
        baseradius = radius/1.25;
        inscriptionradius = radius/1.2;
        bendradius = radius/1.125;
        abbreviationradius = radius/1.116;
    }
    context.save();
    context.translate(x,y);
    context.rotate(degToRad(degree));
    if (relativeTo == "north") {
        context.rotate(degToRad(viewModel.heading));
    }
    context.fillStyle=color;
    context.strokeStyle="black";
    context.beginPath();
    context.moveTo(0, -tipradius);
    context.bezierCurveTo(bendstrength, -bendradius, bendstrength, -baseradius, 0, -baseradius);
    context.moveTo(0, -tipradius);
    context.bezierCurveTo(-bendstrength, -bendradius, -bendstrength, -baseradius, 0, -baseradius);
    context.moveTo(0, -tipradius);
    context.lineTo(0, -(tipradius + ticklength*offset));
    context.closePath();
    context.stroke();
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fill();
    context.fillStyle=color;
    context.font =  (fontsize).toString() +'px Arial';
    context.fillText(degree,-halfLengthOfNumber(degree,fontsize),-inscriptionradius);
    fontsize=Math.ceil(fontsize/2);
    context.font =  (fontsize).toString() +'px Arial';
    context.fillText(abbreviation,-halfLengthOfText(abbreviation,fontsize),-abbreviationradius);
    
    context.restore();
}

function drawMarker(abbreviation,degree, canvas,x,y,radius, fontsize, offset, relativeTo) {
    let shiftin =0;
    let shiftout=0;
    if (offset == 1) {
        shiftin = -fontsize;
        shiftout=+fontsize/8;
    } else if (offset == -1) {
        shiftin = +fontsize/8;
        shiftout= -fontsize;
    }
    let context = canvas.getContext("2d");
    context.save();
    context.translate(x,y);
    context.rotate(degToRad(degree));
    if (relativeTo=="north") {
        context.rotate(degToRad(viewModel.heading));
    }
    context.beginPath();
    context.lineWidth=1;
    context.fillStyle="orange";
    context.arc( 0 , -radius, fontsize*1.4, 0, Math.PI*2);
    context.fill();
    context.stroke();
    context.fillStyle="black";
    context.font =  (fontsize).toString() +'px Arial';
    context.fillText(abbreviation,-halfLengthOfText(abbreviation,fontsize),-(radius + shiftout));
    context.fillText(degree,-halfLengthOfNumber(degree,fontsize),-(radius + shiftin));
    context.restore();
    
}

function drawForce(degree, strength, color, canvas,x,y,radius, offset,  relativeTo) {
    let context = canvas.getContext("2d");
    context.save();
    context.translate(x,y);
    context.rotate(degToRad(degree));
    let r=20;
    let x1= 0;
    let y1=0;
    if (relativeTo =="north") {
        context.rotate(degToRad(viewModel.heading));
    }
    let length=Math.log2(strength)*15;
    context.beginPath();
    context.lineWidth=10;
    context.fillStyle=color;
    context.strokeStyle =color;
    y1=-radius;
    if (offset == 1) {y1 = y1 + r}
    context.moveTo(0, y1);
    y1=-(radius-(length));
    if (offset == 1) {y1 = y1 + r}
    context.lineTo(0, y1);
    context.fill();
    context.stroke();
    let angle =degToRad(210);
    if (offset ==-1) {
        angle =degToRad(30);
    }

    y1 = -radius;
    if (offset ==-1) {y1=-(radius-(length))}
    if (offset == 1) {y1 = y1 + r}
    context.moveTo(0, y1);
    for (i=0; i<=2; i++) {
        angle += (1/3)*(2*Math.PI);
        x1=0 + r*Math.cos(angle);
        y1 = -radius - r*Math.sin(angle);
        if (offset ==-1) {y1=-(radius-(length)) - r*Math.sin(angle)}
        if (offset == 1) {y1 = y1 + r}
        context.lineTo(x1,y1);
    }
    y1 = -radius;
    if (offset ==-1) {y1=-(radius-(length))}
    if (offset == 1) {y1 = y1 + r}
    context.lineTo(0, y1);
    context.closePath();
    context.fill();
    context.stroke;
    context.restore();
}


function drawNorthSouth(context, radius, fontsize, offset) {
    context.save();
    for(var angle = 0; angle < 360; angle+=90) {
        var length = fontsize/4;
        var inscription = 'N';
        if (angle  == 90) {
            inscription = "E";
        }
        if (angle == 180) {
            inscription = "S";
        }
        if (angle == 270) {
            inscription = "W";
        }
        context.font =  (fontsize+4).toString() +'px '+this.fontFamily;
        context.fillText(inscription,(-(fontsize+4)/3),textplacing(radius, length, fontsize, offset));
        context.stroke();
        context.rotate(Math.PI/2);
    }
    context.restore();
}

function drawCircularScale(canvas, x, y, radius, fontsize, offset, kind) {
    let context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.font =  (fontsize).toString() +'px '+this.fontFamily;
    context.translate(x,y);
    if (kind == "boat") {
        context.rotate(-Math.PI/2);
        context.beginPath();
        context.strokeStyle = "black";
        context.arc( 0 , 0 , radius, 0, degToRad(25)); 
        context.stroke();
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = "forestgreen";
        context.arc( 0 , 0 , radius, degToRad(25), degToRad(60));
        context.stroke();
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.arc( 0 , 0 , radius, degToRad(60), degToRad(300));
        context.stroke();
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = "red";
        context.arc( 0 , 0 , radius, degToRad(300), degToRad(335));
        context.stroke();
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.arc( 0 , 0 , radius, degToRad(335), 2 * Math.PI);
        context.stroke();
        context.rotate(Math.PI/2);
    } else {
        context.beginPath();
        context.arc( 0 , 0 , radius, 0, 2 * Math.PI);
        context.stroke();
    }
    drawTicks(context, radius, fontsize, offset, kind);
    if (kind == "compass") {
        drawNorthSouth(context, radius, fontsize, offset *(-1))
    }
    let rotation = degToRad( -viewModel.heading);
    context.rotate(rotation);
    context.translate(-x,-y);
}

function drawRose() {
    let width =  $("#dashboard").width();
    let height =  $("#dashboard").height();
    
    let boatroseCanvas = addOrResizeCanvas("rose", "boatrose", width, height);
    let compassroseCanvas = addOrResizeCanvas("rose", "compassrose", width, height);

    let radius=Math.min(width, height)/2;
    let fontsize = fontsizeForRadius(radius*0.8);
    drawCircularScale(compassroseCanvas, width/2,height/2, radius*0.8, fontsize, -1, "compass");
    drawGauge(viewModel.twd,'TWD',"darkgreen", compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "north");
    drawGaugeHistory(viewModel.twd,'TWD',"darkgreen", compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "north");
    drawGauge(viewModel.twa,'TWA',"darkgreen", boatroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),-1), "boat";
    drawForce(viewModel.twd, viewModel.tws,"darkgreen",compassroseCanvas,width/2,height/2,radius*0.60, -1,"north");

    drawGauge(viewModel.awd,'AWD',"forestgreen",compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "north");
    drawGauge(viewModel.awa,'AWA',"forestgreen",boatroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),-1, "boat");
    drawGaugeHistory(viewModel.awa,'AWA',"forestgreen", boatroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),-1, "boat");
    drawForce(viewModel.awd, viewModel.aws,"forestgreen",compassroseCanvas,width/2,height/2,radius*0.60, -1, "north");

    drawGauge(viewModel.cog,'COG',"royalblue",compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "north");
    drawGaugeHistory(viewModel.cog,'COG',"royalblue", compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "north");
    drawGauge(viewModel.drag,'DRG',"royalblue",boatroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),-1, "boat");
    drawForce(viewModel.cog+viewModel.heading, viewModel.sog,"royalblue",compassroseCanvas,width/2,height/2,radius*0.60, 1, "boat");
 
    drawForce(0, viewModel.stw,"darkblue",boatroseCanvas,width/2,height/2,radius*0.60, 1, "boats");

    drawHistoryTail(viewModel.heading,'HDG',"darkblue", compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "boat");
    drawHistoryTail(viewModel.twd,'TWA',"darkgreen", compassroseCanvas,width/2,height/2,radius*0.75,Math.ceil(fontsize*1.7),1, "boat");

    drawCircularScale(boatroseCanvas, width/2,height/2, radius*0.7, fontsize, 1,"boat");
   
    drawMarker('WP',viewModel.wp, compassroseCanvas, width/2, height/2, radius*0.8, fontsize, 1, "north");
    drawMarker('OT',viewModel.ot, compassroseCanvas, width/2, height/2, radius*0.7, fontsize, -1, "boat");
    let context = boatroseCanvas.getContext("2d");
    context.drawImage(compassroseCanvas, 0, 0, width, height);
}

function portrait() { return $("#dashboard").width() <= $("#dashboard").height()}
function landscape() { return !(portrait()) } 

function swapoutIdSubstring(changeset, oldStr, newStr) {
    for (i=0; i < changeset.length; i++) {
        oldId =changeset[i].id;
        newId = oldId.replace(oldStr, newStr);
        changeset[i].id=newId;
    }  
}

let hdg = Math.PI;

function doOnOrientationChange() {
    if(landscape()){
        swapoutIdSubstring(document.querySelectorAll("[id*=portrait]"),"portrait","landscape");
    } else {
        swapoutIdSubstring(document.querySelectorAll("[id*=landscape]"),"landscape","portrait");
    }
    drawRose();
}

let oldOrientation = true;
let newOrientation = true;
function checkOrientationChange() {
    newOrientation = landscape();
    if (newOrientation != oldOrientation) {
        doOnOrientationChange();
    } else {
        drawRose(0, hdg);
    }
    oldOrientation=newOrientation;
}

Vue.component('wind-rose', {
    template:`<div id="rose">
            
    </div>`
})

Vue.component('rose-gauge', {
    props:['abbreviation', 'degree', 'color'],
    template:`<div id="gauge"> 
    </div>`
})

Vue.component('two.two-digit-data', {
    props: ['data'],
    template:`<div>
    {{(Math.floor(data*100)/100).toString()}} 
    </div>`
})

Vue.component('three-digit-data', {
    props: ['data'],
    template:`<div>
    {{Math.floor(data).toString()}} 
    </div>`
})

Vue.component('rose-force', {
    props:['abbreviation','strength', 'degree', 'color'],
    template:`<div id="force">
            
    </div>`
})

Vue.component('rose-marker', {
    props:['abbreviation', 'degree', 'color'],
    template:`<div id="force">
            
    </div>`
})

Vue.component('data-box', {
    props:['abbreviation', 'aggregate','description','icon', 'unit', 'color'],
    template: `
        <div class="data-box-container">
            <div class="data-box-abbreviation"> 
                {{abbreviation}} 
            </div> 
            <div class="data-box-aggregate">
                {{aggregate}}
            </div>
            <div class="data-box-icon" @click="toggleFocus">
                    {{icon}} 
            </div>
            <div class="data-box-content"> <slot></slot>
            </div>
            <div class="data-box-description">
                {{description}}
            </div>
            <div class="data-box-unit">
                {{unit}}
            </div>
        </div>`,
        methods: {
            toggleFocus: function() {
                document.getElementById("centerbox1").id="focusbox";
          }
        }
    
    })


var viewModel = new Vue({
    el:"#dashboard",
    data:{
        lat:'50° 34,56',
        lon:'009° 56,89',
        time:"12:36:56",
        countdown:"00:45:20",
        rpm:"Eng 2,700 rpm",
        log:"Log 12,345 nm",
        heading:5,
        depth:18.5,
        stw:12.34,
        sog:8.90,
        cog:160,
        aws:15.89,
        awa: 240-165,
        awd: 240,
        tws:10.40,
        twa:270-165,
        twd:275,
        vmg:3.40,
        target:6.20,
        perf:96.7,
        temp:21.3,
        water_temp:19.0,
        fuel:89,
        fuel2:0,
        bat:98,
        bat2:100,
        stw_avg:7.89,
        sog_avg:8.76,
        tws_avg:11.90,
        aws_avg:10.99,
        stw_max:7.89,
        sog_max:8.76,
        tws_max:11.90,
        aws_max:10.99,
        vmg_avg:3.78,
        vmg_max:3.65,
        ot:90,
        wp:355,
        drag:-5,
    },
    methods:{
            initDashboard :function () {
                drawRose();
                oldOrientation = true;
                newOrientation = true;
                checkOrientationChange();
            } ,
            updateModel: function() {    
                this.sog +=(Math.random()-0.5);
                this.tws +=(Math.random()-0.5);
                this.twd +=Math.round((Math.random()-0.5)*5);
                this.twa = Math.round(this.twd-this.heading);
                this.awd +=Math.round((Math.random()-0.5));
                this.awa = Math.round(this.awd-this.heading);
                this.aws +=(Math.random()-0.5);
                this.stw +=(Math.random()-0.5);
                this.vmg +=(Math.random()-0.5);
                this.depth +=(Math.random()-0.5);
                this.heading +=Math.round((Math.random()-0.5)*5);
                this.cog = Math.round(this.heading + this.drag);
                drawRose();
            }   
    }
})
    
$('document').ready(function(){
    window.addEventListener('orientationchange', doOnOrientationChange);
    window.addEventListener('resize', checkOrientationChange);
    viewModel.initDashboard();
    window.setInterval(function(){
        viewModel.updateModel();
      }, 1000);
    
    
});