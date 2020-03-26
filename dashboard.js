 /*jshint esversion: 6 */
 
 // Start of functions for the SVG circle
 function getRandomIntInclusive(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
 }
   
 function setStop(id, radius, stop){
     var c = document.getElementById(id);
     c.className = "background";
     var stopVal = Math.PI * radius * 2 * (stop/10);
     c.setAttribute("stroke-dasharray", stopVal + ", 3000");
     c.setAttribute("stroke-dashoffset", stopVal);
     c.className = "overlayLine";
 }
   
 function randomStops(){
     setStop("line1", 6, getRandomIntInclusive(1, 10));
     setStop("line2", 9, getRandomIntInclusive(1, 10));
     setStop("line3", 12, getRandomIntInclusive(1, 10));
 }
 randomStops();

var app = new Vue({
    el: '#app',
    data: {
        currentTemp: "75",
        titleStatus: "Busy",
        totalVisitors: "9,000",
        parkingStat: "3%",
        eastEntranceStat: "503",
        southEntranceStat: "1,203",
        yesterdayTitleStatus: "Busy",
        yesterdayZionTotal: "7310",
        yesterdayCanyonTotal: "6256",
        SEVehicles: "1,203",
        SEPeople: "2,600",
        EVehicles: "503",
        EPeople: "1,200",
        riverVehicles: "",
        riverPeople: "93",
        kolobVehicles: "500",
        kolobPeople: "1,300",
    },

    methods: {
        test: function() {
            console.log('pushed');
        }
    },
});