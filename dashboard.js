/*jshint esversion: 6 */

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        todaysDate: "",
        yesterdaysDate: "",
        currentTemp: "75",
        titleStatus: "Busy",
        totalVisitors: "9,000",
        parkingStat: "3",
        eastEntranceStat: "N/A",
        southEntranceStat: "N/A",
        yesterdayTitleStatus: "Busy",
        yesterdayZionTotal: "N/A",
        yesterdayCanyonTotal: "N/A",
        SVehicles: "1,000",
        SPeople: "N/A",
        SDateUpdated: "N/A",
        EVehicles: "600",
        EPeople: "N/A",
        EastDateUpdated: "N/A",
        riverVehicles: "",
        riverPeople: "N/A",
        RiverDateUpdated: "N/A",
        kolobVehicles: "300",
        kolobPeople: "N/A",
        KolobDateUpdated: "N/A",
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
        //this.getWeatherAPI();
    },
    methods: {
        getTodaysDate: function () {
            var date = new Date();
            var yesterday = new Date(date);
            yesterday.setDate(yesterday.getDate()-1);
            var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

            var fulldate = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
            this.todaysDate = fulldate;
            var yesterdayDate = days[yesterday.getDay()] + ", " + months[yesterday.getMonth()] + " " + yesterday.getDate() + " " + yesterday.getFullYear();
            this.yesterdaysDate = yesterdayDate;
        },
        loadStats: function() {
            var vm = this;
            axios.get("https://trailwaze.info/zion/request.php").then(response => {
                vm.southEntranceStat = response.data[0].count;
                vm.SPeople = response.data[0].count;
                vm.SDateUpdated = response.data[0].date;

                vm.eastEntranceStat = response.data[2].count;
                vm.EPeople = response.data[2].count;
                vm.EastDateUpdated = response.data[2].date;

                vm.riverPeople = response.data[4].count;
                vm.RiverDateUpdated = response.data[4].date;

                vm.kolobPeople = 623;
                vm.KolobDateUpdated = vm.SDateUpdated;

                vm.yesterdayCanyonTotal = vm.SPeople + vm.EPeople + vm.riverPeople;
                vm.yesterdayZionTotal = vm.yesterdayCanyonTotal + vm.kolobPeople;

                this.setStop("line1", 26, vm.SPeople/1000);
                this.setStop("line2", 34, vm.EPeople/1000);
                this.setStop("line3", 42, 0.5/10);
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
            var stopVal = Math.PI * radius * 2 * (stop);
            c.setAttribute("stroke-dasharray", stopVal + ", 3000");
            c.setAttribute("stroke-dashoffset", stopVal);
            c.className = "overlayLine";
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
    mounted() {
        this.getTodaysDate();
    }
});

