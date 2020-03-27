 /*jshint esversion: 6 */
 
 //Start of functions for the SVG circle
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
     setStop("line1", 26, getRandomIntInclusive(1, 10));
     setStop("line2", 34, getRandomIntInclusive(1, 10));
     setStop("line3", 42, getRandomIntInclusive(1, 10));
 }
 randomStops();

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
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
        SEDateUpdated: "03-26-20",
        EVehicles: "503",
        EPeople: "1,200",
        EastDateUpdated: "03-26-20",
        riverVehicles: "",
        riverPeople: "93",
        RiverDateUpdated: "03-26-20",
        kolobVehicles: "500",
        kolobPeople: "1,300",
        KolobDateUpdated: "03-25-20",
        MainPage: 'Parking', // Home, Parking, Entrances 
        EntrancePage: 'SouthEast',
        Entrances: ['SouthEast', 'East', 'River', 'Kolob'],
        serverStats: [],

        visitor_selected: true,
        overflow_selected: false,
        ETI_selected: true,
        ETO_selected: false,
        R_selected: false,
    },
    created: function(){
        this.loadStats();
        //this.getWeatherAPI();
    },
    methods: {
        loadStats: function() {
            var vm = this;
            axios.get("https://trailwaze.info/zion/request.php").then(response => {
<<<<<<< HEAD
                console.log('response: ', response.data);
                vm.SEPeople = response.data[0].count
=======
                vm.SEPeople = response.data[0].count;
>>>>>>> 01a41680d5280d0829854f09f2b9dc91e49a6982
                console.log('SEPeople: ', vm.SEPeople);
            }).catch(error => {
                vm.titleStatus = "Fetch " + error;
            });
        },
        getWeatherAPI: function() {
            var vm = this;
            // not an api we can work with.
            axios.get("https://forecast.weather.gov/MapClick.php?lat=37.1838&lon=-113.0032&unit=0&lg=english&FcstType=dwml").then(response => {
                console.log('Resopnse: ', response.data);

            }).catch(error => {
                console.log(error);
            })
        },
        visitorSelected: function(){
            this.visitor_selected = true;
            this.overflow_selected = false;
        },
        overflowSelected: function(){
            this.visitor_selected = false;
            this.overflow_selected = true;
        },
        ETISelected: function(){
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = true;
        },
        ETOSelected: function(){
            this.ETO_selected = true;
            this.R_selected = false;
            this.ETI_selected = false;
        },
        RSelected: function(){
            this.ETO_selected = false;
            this.R_selected = true;
            this.ETI_selected = false;
        },

    },
});

