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
        currentTemp: "",
        currentCond: "",
        weatherImage: "",

        titleStatus: "Busy",
        totalVisitors: "N/A",
        yesterdayTitleStatus: "Busy",
        yesterdayZionTotal: "N/A",
        yesterdayCanyonTotal: "N/A",

        parkingStat: "",
        overflowStat: "10",
        vcStat: "10",        
        eastEntranceStat: "N/A",
        eastExitStat: "N/A",
        southEntranceStat: "N/A",
        southExitStat: "N/A",
        canyonStat: "N/A",
        canyonExit: "N/A",
        kolobStat: "N/A",
        kolobExit: "N/A",
        riverPeople: "N/A",
        riverExit: "N/A",

        SVehicles: "N/A",
        SPeople: "N/A",
        SDateUpdated: "N/A",
        EVehicles: "N/A",
        EPeople: "N/A",
        EastDateUpdated: "N/A",
        RiverDateUpdated: "N/A",
        kolobVehicles: "N/A",
        kolobPeople: "N/A",
        KolobDateUpdated: "N/A",
        
        MainPage: 'Entrances', // Login, loggingIn, requestAccess, Home, Parking, Entrances 
        EntrancePage: 'South',
        Entrances: ['South', 'East', 'River', 'Kolob', 'Canyon Junction'],
        statesTimes: ['By Hour', 'Yesterday', '24 Hour', '7 Day', '30 Day'],
        stateArrowImage: 'icons/downArrow.png',
        stateTimePage : 'By Hour', // change back to 'By Hour'
        stateDateRange: [],
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        modal: false,
        southStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south',
        eastStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=east', // doesnt work
        kolobStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=kolob', // doesnt work
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
        ETI_selected: false, 
        ETO_selected: false,
        R_selected: false,
        S_selected: true, 
        D_selected: false,
        Ratio_selected: false,
        Month_selected: true,
        Day_selected: false
    },
    created: function(){
        this.loadStats();
        this.getWeatherAPI();
        this.loadParking();
        this.loadEntrances();
    },
    methods: {
        getAPIData_safe: function (data, fields, def){
			//data = json object api return data
			//fields = array of data fields tree
			//def = default return value if nothing is found
			var ret = def;
			var multiEntrance = false;
			try{
				if(i == 0 && tdata.hasOwnProperty(f + "1")){multiEntrance = true;}
				var tdata = data;
				for(var i = 0; i < fields.length; i++){
					var f = fields[i];
					if(tdata.hasOwnProperty(f)){
						if(i == fields.length - 1){
							ret = tdata[f];
						}else{
							tdata = tdata[f];
						}
					}
				}
			}catch(err){
				console.log(err);
			}
			return ret;
		},
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
                //South Entrance: Today
				vm.southEntranceVehicles = this.getAPIData_safe(response.data, ["ZionSouthEntrance1", "Today", "count"], 0);
				vm.southEntranceVehicles += this.getAPIData_safe(response.data, ["ZionSouthEntrance2", "Today", "count"], 0);
				//South Entrance: Yesterday
				var southMultiplier = this.getAPIData_safe(response.data, ["ZionSouthEntrance", "Yesterday", "multiplier"], 1);
				vm.SVehicles = this.getAPIData_safe(response.data, ["ZionSouthEntrance", "Yesterday", "count"], "N/A");
				vm.SDateUpdated = this.getAPIData_safe(response.data, ["ZionSouthEntrance", "Yesterday", "date"], "N/A");
				//South Entrance: Today
				if(vm.southEntranceVehicles > 0){vm.southEntranceStat = vm.southEntranceVehicles + " vehicles | " + Math.round(vm.southEntranceVehicles * southMultiplier) + " visitors";}

				//special case, we are using the ZionEastEntrance1 for todays counts
				//and the ZionEastEntrance2 for Yesterdays counts
				//East Entrance: Today
				vm.eastEntranceVehicles = this.getAPIData_safe(response.data, ["ZionEastEntrance1", "Today", "count"], 0);
				//East Entrance: Yesterday
				var eastMultiplier = this.getAPIData_safe(response.data, ["ZionEastEntrance2", "Yesterday", "multiplier"], 1);
				var eastCount_yesterday = this.getAPIData_safe(response.data, ["ZionEastEntrance2", "Yesterday", "count"], 0);
                vm.EastDateUpdated = this.getAPIData_safe(response.data, ["ZionEastEntrance2", "Yesterday", "date"], "N/A");
				if(vm.eastEntranceVehicles > 0){vm.eastEntranceStat = vm.eastEntranceVehicles + " vehicles | " + Math.round(vm.eastEntranceVehicles * eastMultiplier) + " visitors";}
				if(eastCount_yesterday > 0){vm.EVehicles = eastCount_yesterday;}
                    
				//River Entrance: Yesterday
				vm.riverPeople = this.getAPIData_safe(response.data, ["ZionRiverEntrance", "Yesterday", "count"], "N/A");
				vm.RiverDateUpdated = this.getAPIData_safe(response.data, ["ZionRiverEntrance", "Yesterday", "date"], "N/A");

				var parkingStatSum = 0;
				//Parking: Visitor Center
				parkingStatSum += this.getAPIData_safe(response.data, ["ParkingVisitorCenter", "Today", "count"], 0);
				//Parking: Overflow
				parkingStatSum += this.getAPIData_safe(response.data, ["ParkingOverflow", "Today", "count"], 0);
				//Parking: total
                vm.parkingStat = parkingStatSum / 2;
				//vm.parkingStat/=500;

				//multiply vehicles by multiplier and set south and east people
				if(vm.SVehicles != "N/A"){vm.SPeople = Math.round(vm.SVehicles * southMultiplier);}
				if(vm.EVehicles != "N/A"){vm.EPeople = Math.round(vm.EVehicles * eastMultiplier);}

                vm.yesterdayCanyonTotal = 0;
				if(vm.SPeople != "N/A"){vm.yesterdayCanyonTotal += vm.SPeople;}
				if(vm.EPeople != "N/A"){vm.yesterdayCanyonTotal += vm.EPeople;}
				if(vm.riverPeople != "N/A"){vm.yesterdayCanyonTotal += vm.riverPeople;}
                vm.yesterdayZionTotal = vm.yesterdayCanyonTotal;
				
				//Entrance: Kolob
				vm.kolobVehicles = this.getAPIData_safe(response.data, ["KolobRadar", "Yesterday", "count"], "N/A");
				var kolobMultiplier = this.getAPIData_safe(response.data, ["KolobRadar", "Yesterday", "multiplier"], 1);
				if(vm.kolobVehicles != "N/A"){vm.kolobPeople = vm.kolobVehicles * kolobMultiplier;}
				//add Kolob count to Zion Total Count
				if(vm.kolobPeople != "N/A"){vm.yesterdayZionTotal += kolobPeople;}

				//Last Year Visitation
				vm.totalVisitors = this.getAPIData_safe(response.data, ['LastYearVisitation', 'count'], 'N/A');

                var PS = vm.parkingStat / 100;
                if (PS < 0.1){
                    PS = 0.1;
                    vm.parkingStat = 10;
                }

                var ES = vm.eastEntranceStat.substr(0,vm.eastEntranceStat.indexOf(' ')) / 2500;
                if (ES < 0.1){
                    ES = 0.1;
                }

                var SES = vm.southEntranceStat.substr(0,vm.southEntranceStat.indexOf(' ')) / 2500;
                if (SES < 0.1 || vm.southEntranceStat == "N/A"){
                    SES = 0.1;
                }

                var CJ = vm.canyonStat.substr(0,vm.canyonStat.indexOf(' ')) / 2500;
                if (CJ < 0.1 || vm.canyonStat == "N/A"){
                    CJ = 0.1;
                }

                this.setStop("line0", 23, CJ);
                this.setStop("line1", 31, SES);
                this.setStop("line2", 39, ES);
                this.setStop("line3", 47, PS);
                //vm.parkingStat *= 100;
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
				var icon = currentWeather.getElementsByTagName("icon-link")[0].childNodes[0].nodeValue;
                vm.currentTemp = tempVal;
				this.checkWeatherImage(icon);								 
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
            this.getWeatherAPI();
        },
        checkWeatherImage: function(icon){
            const hours = new Date().getUTCHours();
			var timeOfDay = "weatherNight";
			if(hours <= 2 || (hours > 12 && hours < 24  )){
                timeOfDay = "weather";
            }
            icon = "./icons/"+ timeOfDay + icon.substr(icon.lastIndexOf("/")).replace(".png",".svg");
            this.weatherImage = icon;
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
        },
        switchArrow: function() {
            if(this.stateArrowImage == 'icons/downArrow.png'){
                this.stateArrowImage = 'icons/upArrow.png';
            } else{
                this.stateArrowImage = 'icons/downArrow.png'
            }
        },
        resetArrow: function() {
            this.stateArrowImage = 'icons/downArrow.png';
        },
        selectStateDates: function() {
            //https://trailwaze.info/zion/plates_by_state_date_south.php?date1=2020-05-23&date2=2020-05-20
            if( this.stateDateRange.length > 1) {
                var year1 = this.stateDateRange[0].substr(0,4);
                var year2 = this.stateDateRange[1].substr(0,4);
                var month1 = this.stateDateRange[0].substr(5,2);
                var month2 = this.stateDateRange[1].substr(5,2);
                var day1 = this.stateDateRange[0].substr(8,2);
                var day2 = this.stateDateRange[1].substr(8,2);
                this.southStateURL = `https://trailwaze.info/zion/plates_by_state_date_south.php?date1=${year1}-${month1}-${day1}&date2=${year2}-${month2}-${day2}`
            }else if( this.stateDateRange.length == 1) {
                var year1 = this.stateDateRange[0].substr(0,4);
                var month1 = this.stateDateRange[0].substr(5,2);
                var day1 = this.stateDateRange[0].substr(8,2);
                this.southStateURL = `https://trailwaze.info/zion/plates_by_state_date_south.php?date1=${year1}-${month1}-${day1}&date2=${year1}-${month1}-${day1}`
            } else{
                alert('No days were selected!');
            }
        }
    },
    mounted() {
        this.getTodaysDate();
    },
    computed: {
        dateRangeText () {
            return this.stateDateRange.join(' ~ ')
        }
    }
});

function loadEastInOutDate(date1,countIn,countOut){
	var addr = 'https://trailwaze.info/zion/inOut_east_date.php?date='+date1+'&countin='+countIn+'&countout='+countOut;
	var alerts = axios.get(addr).then(function( data ) {
		var iframe = document.getElementById("ratioFrame");
		var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
		innerDoc.getElementById( "inOutSub" ).innerHTML = data.data;
	});
}
