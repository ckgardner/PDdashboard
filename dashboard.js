/*jshint esversion: 6 */

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
        SEVehicles: "",
        SEPeople: "",
        SEDateUpdated: "03-26-20",
        EVehicles: "",
        EPeople: "",
        EastDateUpdated: "",
        riverVehicles: "-",
        riverPeople: "-",
        RiverDateUpdated: "-",
        kolobVehicles: "-",
        kolobPeople: "-",
        KolobDateUpdated: "-",
        MainPage: 'Home', // Home, Parking, Entrances 
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
        this.stops();
        //this.getWeatherAPI();
    },
    methods: {
        loadStats: function() {
            var vm = this;
            axios.get("https://trailwaze.info/zion/request.php").then(response => {
                vm.SEVehicles = response.data[0].count;
                vm.SEDateUpdated = response.data[0].date;

                vm.EVehicles = response.data[2].count;
                vm.EastDateUpdated = response.data[2].date;
            }).catch(error => {
                vm = "Fetch " + error;
            });
            
        },
        // getWeatherAPI: function() {
        //     let parser = new DOMParser();
        //     let doc = parser.parseFromString("https://forecast.weather.gov/MapClick.php?lat=37.1838&lon=-113.0032&unit=0&lg=english&FcstType=dwml", "application/xml");
        //     var vm = this;
        //     // not an api we can work with.
        //     axios.get(doc).then(response => {
        //         console.log(response.data[0]);
        //     });    
        // },
        setStop: function(id, radius, stop){
            var c = document.getElementById(id);
            c.className = "background";
            var stopVal = Math.PI * radius * 2 * (stop/10);
            c.setAttribute("stroke-dasharray", stopVal + ", 3000");
            c.setAttribute("stroke-dashoffset", stopVal);
            c.className = "overlayLine";
        },
        stops: function(){
            this.setStop("line1", 26, 4);
            this.setStop("line2", 34, 8);
            this.setStop("line3", 42, 6);
            console.log(this.SEVehicles, this.EVehicles);
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

