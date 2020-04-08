/*jshint esversion: 6 */

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        nameField: "",
        nameEmpty: false,
        emailField: "",
        emailEmpty: false,
        messageField: "",

        usernameField: "",
        usernameEmpty: false,
        passField: "",
        passEmpty: false,

        todaysDate: "",
        yesterdaysDate: "",
        previousDates: [
            'March 19, 2020',
            'March 18, 2020',
            'March 17, 2020',
            'March 16, 2020',
            'March 15, 2020',
            'March 14, 2020',
        ],
        date: 'March 20, 2020',
        currentTemp: "75",
        titleStatus: "Busy",
        totalVisitors: "9,000",
        parkingStat: "3",
        eastEntranceStat: "N/A",
        southEntranceStat: "N/A",
        yesterdayTitleStatus: "Busy",
        yesterdayZionTotal: "N/A",
        yesterdayCanyonTotal: "N/A",
        SVehicles: "N/A",
        SPeople: "N/A",
        SDateUpdated: "N/A",
        EVehicles: "N/A",
        EPeople: "N/A",
        EastDateUpdated: "N/A",
        riverVehicles: "",
        riverPeople: "N/A",
        RiverDateUpdated: "N/A",
        kolobVehicles: "N/A",
        kolobPeople: "N/A",
        KolobDateUpdated: "N/A",
        MainPage: 'Home', // Login, loggingIn, requestAccess, Home, Parking, Entrances 
        EntrancePage: 'South East',
        Entrances: ['South East', 'East', 'River', 'Kolob'],
        serverStats: [],

        visitor_selected: true,
        overflow_selected: false,
        ETI_selected: true,
        ETO_selected: false,
        R_selected: false,
        S_selected: false,
        Month_selected: true,
        Day_selected: false
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
                vm.SVehicles = response.data[0].count;
                vm.SDateUpdated = response.data[0].date;

                vm.eastEntranceStat = response.data[2].count;
                vm.EVehicles = response.data[2].count;
                vm.EastDateUpdated = response.data[2].date;

                vm.riverPeople = response.data[4].count;
                vm.RiverDateUpdated = response.data[4].date;

                vm.parkingStat = response.data[6].count + response.data[7].count;
                vm.parkingStat/=500;

                vm.yesterdayCanyonTotal = vm.SVehicles + vm.EVehicles + vm.riverPeople;
                vm.yesterdayZionTotal = vm.yesterdayCanyonTotal;

                this.setStop("line1", 26, vm.southEntranceStat/2500);
                this.setStop("line2", 34, vm.eastEntranceStat/2500);
                this.setStop("line3", 42, vm.parkingStat);
                vm.parkingStat*=100;
                vm.parkingStat = vm.parkingStat.toFixed(0);
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
            this.S_selected = false;
        },
        ETOSelected: function(){
            this.ETO_selected = true;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
        },
        RSelected: function(){
            this.ETO_selected = false;
            this.R_selected = true;
            this.ETI_selected = false;
            this.S_selected = false;
        },
        SSelected: function(){
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = true;
        },
        MonthSelected: function(){
            this.Month_selected = true;
            this.Day_selected = false;
        },
        DaySelected: function(){
            this.Month_selected = false;
            this.Day_selected = true;
        },
        validateRequestData: function(){
            if (this.nameField == ""){
                this.nameEmpty = true;
            }else{
                this.nameEmpty = false;
            }
            if (this.emailField == ""){
                this.emailEmpty = true;
            }else{
                this.emailEmpty = false;
            }
            if (this.nameEmpty == true || this.emailEmpty == true){
                return false;
            }else{
                return true;
            }
        },
        sendClicked: function(){
            if(this.validateRequestData()){
                this.MainPage = "Login";
                this.nameField = "";
                this.emailField = "";
                this.messageField = "";
            }
        },
        validateLoginData: function(){
            if (this.usernameField == ""){
                this.usernameEmpty = true;
            }else{
                this.usernameEmpty = false;
            }
            if (this.passField == ""){
                this.passEmpty = true;
            }else{
                this.passEmpty = false;
            }
            if (this.usernameEmpty == true || this.passEmpty == true){
                return false;
            }else{
                return true;
            }
        },
        loginClicked: function(){
            if(this.validateLoginData()){
                this.loadStats();
                this.MainPage = "Home";
                this.usernameField = "";
                this.passField = "";
            }
        },
        logoutClicked: function(){
            this.MainPage = "Login";
        },
        resetPages: function(){
            this.ETISelected();
            this.MonthSelected();
        },
        statRefresh: function(){
            console.log("stats refreshing");
            this.loadStats();
        }
    },
    mounted() {
        this.getTodaysDate();
    }
});

