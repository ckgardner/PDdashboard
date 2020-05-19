/*jshint esversion: 6 */

Vue.component('apexchart', VueApexCharts);

// var app1 = new Vue({
//     el: '#appl',
//     data: function(){
//         return {
//             options: {
//               chart: {
//                 id: 'vuechart-example'
//               },
//               xaxis: {
//                 categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
//               }
//             },
//             series: [{
//               name: 'series-1',
//               data: [30, 40, 45, 50, 49, 60, 70, 91]
//             }]
//         };
//     }
// });

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        nameField: "",         // start request acces page fields
        nameEmpty: false,
        emailField: "",
        emailEmpty: false,
        messageField: "",      // end request access page fields

        usernameField: "",     // start login page fields
        usernameEmpty: false,
        passField: "",
        passEmpty: false,      // start login page fields

        todaysDate: "",        
        yesterdaysDate: "",
        previousDates: [       // not currently in use
            'March 19, 2020',
            'March 18, 2020',
            'March 17, 2020',
            'March 16, 2020',
            'March 15, 2020',
            'March 14, 2020',
        ],
        currentTemp: "",
        currentCond: "",
        weatherImage: "",

        titleStatus: "Busy",
        totalVisitors: "9,000",
        parkingStat: "",
        overflowStat: "10",
        vcStat: "10",
        eastEntranceStat: "N/A",
        southEntranceStat: "N/A",
        canyonStat: "N/A",
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
        MainPage: 'Entrances', // Login, loggingIn, requestAccess, Home, Parking, Entrances 
        EntrancePage: 'South',
        Entrances: ['South', 'East', 'River', 'Kolob', 'Canyon Junction'],
        statesTimes: ['By Hour', 'Yesterday', '24 Hour', '7 Day', '30 Day'],
        stateTimePage : 'By Hour',
        southStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south',
        eastStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=east', // doesnt work
        kolobStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south', // doesnt work
        canyon_junctionStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=canyonjct',
        serverStats: [],

        southIn: "N/A",
        southOut: "N/A",
        eastIn: "N/A",
        eastOut: "N/A",
        riverIn: "N/A",
        riverOut: "N/A",
        kolobIn: "N/A",
        kolobOut: "N/A",
        canyonIn: "N/A",
        canyonOut: "N/A",

        visitor_selected: true,
        overflow_selected: false,
        ETI_selected: false, //true
        ETO_selected: false,
        R_selected: false,
        S_selected: true,  //false
        D_selected: false,
        Ratio_selected: false,
        Month_selected: true,
        Day_selected: false
    },
    created: function(){
        this.loadStats();
        this.loadParking();
        this.loadEntrances();
        this.getWeatherAPI();
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
                if(response.data.hasOwnProperty("ZionSouthEntrance")){
                    if(response.data.ZionSouthEntrance.hasOwnProperty("Yesterday")){
                        vm.SVehicles = response.data.ZionSouthEntrance.Yesterday.count;
                        vm.SDateUpdated = response.data.ZionSouthEntrance.Yesterday.date;
                    }if(response.data.ZionSouthEntrance.hasOwnProperty("Today")){
                        vm.southEntranceStat = response.data.ZionSouthEntrance.Today.count;
                    }
                }

                if(response.data.hasOwnProperty("ZionEastEntrance1")){
                    if(response.data.ZionEastEntrance1.hasOwnProperty("Yesterday")){
                        vm.EVehicles = response.data.ZionEastEntrance1.Yesterday.count;
                        vm.EastDateUpdated = response.data.ZionEastEntrance1.Yesterday.date;
                    }if(response.data.ZionEastEntrance1.hasOwnProperty("Today")){
                        vm.eastEntranceStat = response.data.ZionEastEntrance1.Today.count;
                    }
                }
                    
                if(response.data.hasOwnProperty("ZionRiverEntrance")){
                    if(response.data.ZionRiverEntrance.hasOwnProperty("Yesterday")){
                        vm.riverPeople = response.data.ZionRiverEntrance.Yesterday.count;
                        vm.RiverDateUpdated = response.data.ZionRiverEntrance.Yesterday.date;
                    }
                }

                if(response.data.hasOwnProperty("ParkingVisitorCenter") || response.data.hasOwnProperty("ParkingOverflow")){
                    var parkingStatSum = 0;
                    if(response.data.hasOwnProperty("ParkingVisitorCenter") && response.data.ParkingVisitorCenter.hasOwnProperty("Today")){
                        vm.vcStat = response.data.ParkingVisitorCenter.Today.count;
                        parkingStatSum += vm.vcStat;
                    }
                    if(response.data.hasOwnProperty("ParkingOverflow") && response.data.ParkingOverflow.hasOwnProperty("Today")){
                        vm.overflowStat = response.data.ParkingOverflow.Today.count;
                        parkingStatSum += vm.overflowStat;
                    }
                    vm.parkingStat = parkingStatSum;
                    console.log(vm.parkingStat, "Pre");
                    vm.parkingStat /= 550;
                }

                vm.yesterdayCanyonTotal = 0;
                if(vm.SVehicles != "N/A"){vm.yesterdayCanyonTotal += vm.SVehicles;}
                if(vm.EVehicles != "N/A"){vm.yesterdayCanyonTotal += vm.EVehicles;}
                if(vm.riverPeople != "N/A"){vm.yesterdayCanyonTotal += vm.riverPeople;}
                vm.yesterdayZionTotal = vm.yesterdayCanyonTotal;
                
                if(response.data.hasOwnProperty("LastYearVisitation")){
                    vm.totalVisitors = response.data.LastYearVisitation.count;
                }

                var PS = vm.parkingStat;
                if (PS < 0.1){
                    PS = 0.1;
                    vm.parkingStat = 0.1;
                }

                var ES = vm.eastEntranceStat / 2500;
                if (ES < 0.1){
                    ES = 0.1;
                }

                var SES = vm.southEntranceStat / 2500;
                if (SES < 0.1 || vm.southEntranceStat == "N/A"){
                    SES = 0.1;
                }

                var CJ = vm.canyonStat / 2500;
                if (CJ < 0.1 || vm.canyonStat == "N/A"){
                    CJ = 0.1;
                }

                this.setStop("line0", 23, CJ);
                this.setStop("line1", 31, SES);
                this.setStop("line2", 39, ES);
                this.setStop("line3", 47, PS);
                vm.parkingStat *= 100;
                vm.parkingStat = vm.parkingStat.toFixed(0);
                this.loadParking();
                this.loadEntrances();

            }).catch(error => {
                vm = "Fetch " + error;
            });
        },
        getWeatherAPI: function() {
			var vm = this;				
			axios.get("https://forecast.weather.gov/MapClick.php?lat=37.1838&lon=-113.0032&unit=0&lg=english&FcstType=dwml").then(response => {
				let parser = new DOMParser();
				let doc = parser.parseFromString(response.data, "text/xml");
				var currentWeather = doc.getElementsByTagName("data")[1];

				var temp = currentWeather.getElementsByTagName("temperature")[0];
                var tempVal = temp.getElementsByTagName("value")[0].childNodes[0].nodeValue;

                var cond = currentWeather.getElementsByTagName("weather")[0];
                var cond1 = cond.getElementsByTagName("weather-conditions")[0];
                var condVal = cond1.getAttribute("weather-summary");
                console.log(tempVal, condVal);

                vm.currentTemp = tempVal;
                vm.currentCond = condVal;
                this.checkWeatherImage(vm.currentCond);
			}).catch(error => {
                vm = "Fetch " + error;
            });
        },
        loadParking: function(){
            this.vcStat /= 465;
            this.overflowStat /= 100;
            var VC = this.vcStat;
            if(VC < 0.1){
                VC = 0.1;
                this.vcStat = 0.1;
            }
            var OS = this.overflowStat;
            if (OS < 0.1){
                OS = 0.1;
                this.overflowStat = 0.1;
            }
            this.vcStat *= 100;
            this.vcStat = this.vcStat.toFixed(0);
            this.overflowStat *= 100;
            this.overflowStat = this.overflowStat.toFixed(0);

            this.setStop("line4", 9, VC);
            this.setStop("line5", 9, OS);
        },
        loadEntrances: function(){
            this.setStop("line6", 9, 0.1);
            this.setStop("line7", 9, 0.1);
            this.setStop("line8", 9, 0.1);
            this.setStop("line9", 9, 0.1);
            this.setStop("line10", 9, 0.1);
            this.setStop("line11", 9, 0.1);
            this.setStop("line12", 9, 0.1);
            this.setStop("line13", 9, 0.1);
            this.setStop("line14", 9, 0.1);
            this.setStop("line15", 9, 0.1);
        },
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
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        ETOSelected: function(){
            this.ETO_selected = true;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        ratioSelected: function(){
            this.Ratio_selected = true;
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
            this.D_selected = false;
        },
        RSelected: function(){
            this.ETO_selected = false;
            this.R_selected = true;
            this.ETI_selected = false;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        SSelected: function(){
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = true;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        DSelected: function(){
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = true;
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
        },
        checkWeatherImage: function(c){
            var d = new Date();
            var n = d.getHours();
            if (c == "Clear" || c == "Sunny"){
                if (n < 7 || n > 20){
                    this.weatherImage = "./icons/weatherNight/skc.svg";
                }
                this.weatherImage = "./icons/weather/skc.svg";
            }
            if (c == "Mostly Clear" || c == "Mostly Sunny" || c == "Partly Cloudy"){
                if (n < 7 || n > 20){
                    this.weatherImage = "./icons/weatherNight/few.svg";
                }
                this.weatherImage = "./icons/weather/few.svg";
            }
            if (c == "Mostly Cloudy"){
                if (n < 7 || n > 20){
                    this.weatherImage = "./icons/weatherNight/sct.svg";
                }
                this.weatherImage = "./icons/weather/sct.svg";
            }

        },
        resetStateTabs: function() {
            this.stateTimePage = 'By Hour';
            this.southStateURL= 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south';
            this.eastStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=east';
            this.kolobStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south';
            this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=canyonjct';
        },
        setSouthStateData: function(){
            switch(this.stateTimePage){
                case 'By Hour': this.southStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south'; break;
                case 'Yesterday': this.southStateURL = ''; break;
                case '24 Hour': this.southStateURL = 'https://trailwaze.info/zion/vehicleTrafficByState.php'; break;
                case '7 Day': this.southStateURL = ''; break;
                case '30 Day': this.southStateURL = ''; break;
            }
        },
        setEastStateData: function() {
            switch(this.stateTimePage) {
                case 'By Hour': this.eastStateURL = ''; break;
                case 'Yesterday': this.eastStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zioneastin&interval=yesterday'; break;
                case '24 Hour': this.eastStateURL = ''; break;
                case '7 Day': this.eastStateURL = ''; break;
                case '30 Day': this.eastStateURL = ''; break;
            }
        },
        setKolobStateData: function() {
            switch(this.stateTimePage) {
                case 'By Hour': this.kolobStateURL = ''; break;
                case 'Yesterday': this.kolobStateURL = ''; break;
                case '24 Hour': this.kolobStateURL = ''; break;
                case '7 Day': this.kolobStateURL = ''; break;
                case '30 Day': this.kolobStateURL = ''; break;
            }
        },
        setCanyonStateData: function() {
            switch(this.stateTimePage) {
                case 'By Hour': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=canyonjct'; break;
                case 'Yesterday': this.canyon_junctionStateURL = ''; break;
                case '24 Hour': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=canyonjct&interval=1days'; break;
                case '7 Day': this.canyon_junctionStateURL = ''; break;
                case '30 Day': this.canyon_junctionStateURL = ''; break;
            }
        }

        // console.log('state url', this.southStateURL,);
        // statesTimes: ['ByHour', 'Yesterday', '24Hour', '7Day', '30Day'],
        // stateTimePage : 'By Hour',
        // southStateURL:
    },
    mounted() {
        this.getTodaysDate();
    }
});

