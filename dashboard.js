/*jshint esversion: 6 */

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
        currentTime: "",        
        yesterdaysDate: "",
        currentTemp: "",
        currentCond: "",
        weatherImage: "images/blueBison.svg",

        titleStatus: "",
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
        canyonYesterday: "N/A",
        canyonDateUpdated: "N/A",
        canyonTotals: "N/A",
        
        MainPage: 'Home', // Login, loggingIn, requestAccess, Home, Parking, Entrances 
        EntrancePage: 'South',
        vcPage: '',
        Entrances: ['South', 'East', 'River', 'Kolob', 'Canyon Junction'],
        vcs: ['Zion Canyon Visitor Center', 'Kolob Canyon Visitor Center'],
        statesTimes: ['By Hour', 'Yesterday', '24 Hour', '7 Day', '30 Day'],
        radarTimes: ['Monthly', 'Daily'],
        stateArrowImage: 'icons/downArrow.png',
        stateTimePage : 'By Hour',
        radarTimePage: 'Monthly',
        riverData: ['Hourly', 'Daily'],
        riverTimePage: 'Hourly',
        stateDateRange: [],
        DatePickerPopUp: false,
        southRadarURL: 'https://trailwaze.info/zion/radar_monthly.php',
        eastRadarURL: '',
        kolobRadarURL: 'https://trailwaze.info/kolob/index.php',
        CJRadarURL: 'https://trailwaze.info/zion/radar_monthly.php?site=canyonjctradar',
        southStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south',
        eastStateURL: 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=east', // doesnt work
        riverStateUrl: 'https://trailwaze.info/zion/river_report.php?interval=hourly',
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
        M_selected: false,
        ETI_selected: true, 
        ETO_selected: false,
        R_selected: false,
        S_selected: false, 
        D_selected: false,
        Ratio_selected: false,
        Month_selected: true,
        Day_selected: false,

        lightTraffic: true,
        mediumTraffic: false,
        heavyTraffic: false,

        lightTrafficEast: true,
        mediumTrafficEast: false,
        heavyTrafficEast: false,

        lightZionVc: true,
        mediumZionVc: false,
        heavyZionVc: false,
        zionVcVisitors: 986,

        lightKolobVc: true,
        mediumKolobVc: false,
        heavyKolobVc: false,
        kolobVcVisitors: 986,
    },
    created: function(){
        this.loadStats();
        this.loadTraffic();
        this.getWeatherAPI();
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
					let f = fields[i];
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

            var hours = date.getHours();
            var time = "AM";
            if(hours > 12){
                hours -= 12;
                time = "PM";
            }
            var minutes = date.getMinutes();
            if (minutes<10){
                minutes = "0" + minutes;
            }
            this.currentTime = hours + ":" + minutes + time;
        },
        loadStats: function() {
            var vm = this;
            axios.get("https://trailwaze.info/zion/request.php").then(response => {
                //South Entrance: Today
				vm.southEntranceVehicles = this.getAPIData_safe(response.data, ["ZionSouthEntrance2", "Today", "count"], 0);
				vm.southEntranceVehicles += this.getAPIData_safe(response.data, ["ZionSouthEntrance3", "Today", "count"], 0);
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

				//Parking: Visitor Center
				vm.vcStat = this.getAPIData_safe(response.data, ["ParkingVisitorCenter", "Today", "count"], 0);
				//Parking: Overflow
                vm.overflowStat = this.getAPIData_safe(response.data, ["ParkingOverflow", "Today", "count"], 0);
                //Parking: total
                vm.parkingStat = vm.overflowStat + vm.vcStat;
                console.log(vm.parkingStat);
                if(vm.parkingStat > 100){
                    vm.parkingStat = 100;
                }

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
                
                // Canyon Junction: Today
                vm.canyonStat = this.getAPIData_safe(response.data, ["CanyonJctCamera", "Today", "count"], 0);
                var canyonMultiplier = this.getAPIData_safe(response.data, ["CanyonJctCamera", "Yesterday", "multiplier"], 1);
                // Canyon Junction: Yesterday
                vm.canyonYesterday = this.getAPIData_safe(response.data, ["CanyonJctRadar", "Yesterday", "count"], 0);
                vm.canyonTotals = vm.canyonStat + " vehicles | " + Math.round(vm.canyonStat * canyonMultiplier) + " visitors";

				//Last Year Visitation
				vm.totalVisitors = this.getAPIData_safe(response.data, ['LastYearVisitation', 'count'], 'N/A');
     
                var PS = vm.parkingStat/100;
                var VC = vm.vcStat/100;
                var OF = vm.overflowStat/100;

                if (vm.parkingStat < 1 && vm.parkingStat > 0){
                    vm.parkingStat = 1;
                }

                if (PS == 0){
                    PS = 0.001;
                }
                if (vm.vcStat < 1 && vm.vcStat > 0){
                    vm.vcStat = 1;
                }
                if (vm.overflowStat < 1 && vm.overflowStat > 0){
                    vm.overflowStat = 1;
                }

                var ES = vm.eastEntranceStat.substr(0,vm.eastEntranceStat.indexOf(' ')) / 1000;

                var SES = vm.southEntranceStat.substr(0,vm.southEntranceStat.indexOf(' ')) / 3000;

                var CJ = vm.canyonTotals.substr(0,vm.canyonTotals.indexOf(' ')) / 2000;

                var R = vm.riverPeople / 3000;
                var K = 0;

                SEx = 0;
                Ex = 0;
                Rx = 0;
                Kx = 0;
                CJx = 0;

                if (this.MainPage == "Home"){
                    this.loadHome(CJ, SES, ES, PS);
                }
                if (this.MainPage == "Parking"){
                    this.loadParking(VC, OF);
                }
                if (this.MainPage == "Entrances"){
                    this.loadEntrances(SES, SEx, ES, Ex, R, Rx, K, Kx, CJ, CJx);
                }
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
        loadTraffic: function(){
            var vm = this;
            var currentSite = "zionsouthin";
            if(this.EntrancePage == "East"){
                currentSite = "zioneastin";
            }
            axios.get("https://trailwaze.info/zion/vehicleTraffic_request.php?site=" + currentSite).then(response =>{
                var rotateNum;
                if (currentSite == "zionsouthin"){
                    rotateNum = response.data.zionsouthin.rotate100;
                }else{
                    rotateNum = response.data.zioneastin.rotate100;
                }
                
                if(rotateNum < 33){
                    this.lightTraffic = true;
                    this.lightTrafficEast = true;
                    this.mediumTraffic = false;
                    this.mediumTrafficEast = false;
                    this.heavyTraffic = false;
                    this.heavyTrafficEast = false;
                }else if(rotateNum < 66){
                    this.lightTraffic = false;
                    this.lightTrafficEast = false;
                    this.mediumTraffic = true;
                    this.mediumTrafficEast = true;
                    this.heavyTraffic = false;
                    this.heavyTrafficEast = false;
                }else{
                    this.lightTraffic = false;
                    this.lightTrafficEast = false;
                    this.mediumTraffic = false;
                    this.mediumTrafficEast = false;
                    this.heavyTraffic = true;
                    this.heavyTrafficEast = true;
                }
                rotateNum /= 100;
                if(currentSite == "zionsouthin"){
                    this.setStop("trafficLine", 47, rotateNum);
                }else{
                    this.setStop("trafficLine2", 47, rotateNum);
                }
                
            }).catch(error =>{
                vm = "Fetch " + error;
            });
            
        },
        loadVCs: function(){
            var vm = this;
            var currentSite = "zionsouthin";
            if(this.EntrancePage == "East"){
                currentSite = "zioneastin";
            }
            axios.get("https://trailwaze.info/zion/vehicleTraffic_request.php?site=" + currentSite).then(response =>{
                var rotateNum;
                if (currentSite == "zionsouthin"){
                    rotateNum = response.data.zionsouthin.rotate100;
                }else{
                    rotateNum = response.data.zioneastin.rotate100;
                }
                
                if(rotateNum < 33){
                    this.lightTraffic = true;
                    this.lightTrafficEast = true;
                    this.mediumTraffic = false;
                    this.mediumTrafficEast = false;
                    this.heavyTraffic = false;
                    this.heavyTrafficEast = false;
                }else if(rotateNum < 66){
                    this.lightTraffic = false;
                    this.lightTrafficEast = false;
                    this.mediumTraffic = true;
                    this.mediumTrafficEast = true;
                    this.heavyTraffic = false;
                    this.heavyTrafficEast = false;
                }else{
                    this.lightTraffic = false;
                    this.lightTrafficEast = false;
                    this.mediumTraffic = false;
                    this.mediumTrafficEast = false;
                    this.heavyTraffic = true;
                    this.heavyTrafficEast = true;
                }
                rotateNum /= 100;
                if(currentSite == "zionsouthin"){
                    this.setStop("trafficLine", 47, rotateNum);
                }else{
                    this.setStop("trafficLine2", 47, rotateNum);
                }
                
            }).catch(error =>{
                vm = "Fetch " + error;
            });
            
        },
        loadHome: function(CJ, SES, ES, PS){
            this.setStop("line0", 23, CJ);
            this.setStop("line1", 31, SES);
            this.setStop("line2", 39, ES);
            this.setStop("line3", 47, PS);
        },
        loadParking: function(VC, OF){
            if (VC == 0){
                VC = 0.01;
            }
            if (OF == 0){
                OF = 0.01;
            }

            if (this.visitor_selected == true){
                this.setStop("line16", 9, VC);
            }
            if (this.overflow_selected == true){
                this.setStop("line17", 9, OF);
            }
        },
        loadEntrances: function(SEn, SEx, En, Ex, Rn, Rx, Kn, Kx, CJn, CJx){
            if(this.EntrancePage == "South"){
                if(this.ETI_selected == true){
                    this.setStop("line6", 9, SEn);
                }else if(this.ETO_selected == true){
                    this.setStop("line7", 9, SEx);
                }
            }
            if(this.EntrancePage == "East"){
                if(this.ETI_selected == true){
                    this.setStop("line8", 9, En);
                }else if(this.ETO_selected == true){
                    this.setStop("line9", 9, Ex);
                }
            }
            if(this.EntrancePage == "River"){
                if(this.ETI_selected == true){
                    this.setStop("line10", 9, Rn);
                }else{
                    this.setStop("line11", 9, Rx);
                }
            }
            if(this.EntrancePage == "Kolob"){
                if(this.ETI_selected == true){
                    this.setStop("line12", 9, Kn);
                }else{
                    this.setStop("line13", 9, Kx);
                }
            }
            if(this.EntrancePage == "Canyon Junction"){
                if(this.ETI_selected == true){
                    this.setStop("line14", 9, CJn);
                }else{
                    this.setStop("line15", 9, CJx);
                }
            }
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
        MSelected: function(){
            this.M_selected = true;
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        ETISelected: function(){
            this.M_selected = false;
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = true;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        ETOSelected: function(){
            this.M_selected = false;
            this.ETO_selected = true;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        ratioSelected: function(){
            this.M_selected = false;
            this.Ratio_selected = true;
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = false;
            this.D_selected = false;
        },
        RSelected: function(){
            this.M_selected = false;
            this.ETO_selected = false;
            this.R_selected = true;
            this.ETI_selected = false;
            this.S_selected = false;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        SSelected: function(){
            this.M_selected = false;
            this.ETO_selected = false;
            this.R_selected = false;
            this.ETI_selected = false;
            this.S_selected = true;
            this.Ratio_selected = false;
            this.D_selected = false;
        },
        DSelected: function(){
            this.M_selected = false;
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
            this.loadStats();
            this.loadTraffic();
            this.getWeatherAPI();
        },
        checkWeatherImage: function(icon){
            console.log(icon);
            if (icon == null || icon == "NULL" || icon == "null"){
                this.weatherImage = "images/blueBison.svg";
                return;
            }
		var icoName = icon.substr(icon.lastIndexOf("/"));
		icoName = icoName.replace(".png",".svg");
		icon = "./icons/weather"+icoName;
		//const hours = new Date().getUTCHours();
		//var timeOfDay = "weatherNight";
		//if(hours <= 2 || (hours > 12 && hours < 24  )){
			//timeOfDay = "weather";
		   //}
		//icon = "./icons/"+ timeOfDay + icon.substr(icon.lastIndexOf("/")).replace(".png",".svg");
		this.weatherImage = icon;
        },
        resetRadarTabs: function(){
            this.radarTimePage = 'Monthly';
            this.southRadarURL = 'https://trailwaze.info/zion/radar_monthly.php';
            this.eastRadarURL = '';
            this.kolobRadarURL = 'https://trailwaze.info/kolob/index.php';
            this.cjRadarURL = '';
        },
        setSouthRadarData: function(){
            switch(this.radarTimePage){
                case 'Monthly': this.southRadarURL = 'https://trailwaze.info/zion/radar_monthly.php'; break;
                case 'Daily': this.southRadarURL = 'https://trailwaze.info/zion/radar_daily.php'; break;
            }
        },
        setEastRadarData: function(){
            switch(this.radarTimePage){
                case 'Monthly': this.eastRadarURL = ''; break;
                case 'Daily': this.eastRadarURL = ''; break;
            }
        },
        setKolobRadarData: function(){
            switch(this.radarTimePage){
                case 'Monthly': this.kolobRadarURL = 'https://trailwaze.info/kolob/index.php'; break;
                case 'Daily': this.kolobRadarURL = 'https://trailwaze.info/kolob/daily.php'; break;
            }
        },
        setCJRadarData: function(){
            switch(this.radarTimePage){
                case 'Monthly': this.CJRadarURL = 'https://trailwaze.info/zion/radar_monthly.php?site=canyonjctradar'; break;
                case 'Daily': this.CJRadarURL = 'https://trailwaze.info/zion/radar_daily.php?site=canyonjctradar'; break;
            }
        },
        resetStateTabs: function() {
            this.stateTimePage = 'By Hour';
            this.southStateURL= 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south';
            this.eastStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=east';
            this.kolobStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south';
            this.riverStateUrl = 'https://trailwaze.info/zion/river_report.php?interval=hourly';
            this.riverTimePage = 'hourly';
            this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=canyonjct';
        },
        setSouthStateData: function(){
            switch(this.stateTimePage){
                case 'By Hour': this.southStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=south'; break;
                case 'Yesterday': this.southStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zionsouthin&interval=yesterday'; break;
                case '24 Hour': this.southStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zionsouthin&interval=1days'; break;
                case '7 Day': this.southStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zionsouthin&interval=7days'; break;
                case '30 Day': this.southStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zionsouthin&interval=30days'; break;
            }
        },
        setEastStateData: function() {
            switch(this.stateTimePage) {
                case 'By Hour': this.eastStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=east'; break;
                case 'Yesterday': this.eastStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zioneastin&interval=yesterday'; break;
                case '24 Hour': this.eastStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zioneastin&interval=1days'; break;
                case '7 Day': this.eastStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zioneastin&interval=7days'; break;
                case '30 Day': this.eastStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=zioneastin&interval=30days'; break;
            }
        },
        setRiverCameraData: function() {
            switch(this.riverTimePage) {
                case 'Hourly': this.riverStateUrl = 'https://trailwaze.info/zion/river_report.php?interval=hourly'; break;
                case 'Daily': this.riverStateUrl = 'https://trailwaze.info/zion/river_report.php?interval=daily'; break;
            }
        },
        setKolobStateData: function() {
            // state data is N/A for kolob
            switch(this.stateTimePage) {
                case 'By Hour': this.kolobStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=kolob'; break;
                case 'Yesterday': this.kolobStateURL = ''; break;
                case '24 Hour': this.kolobStateURL = ''; break;
                case '7 Day': this.kolobStateURL = ''; break;
                case '30 Day': this.kolobStateURL = ''; break;
            }
        },
        setCanyonStateData: function() {
            switch(this.stateTimePage) {
                case 'By Hour': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficAvgPerHour.php?site=canyonjct'; break;
                case 'Yesterday': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=canyonjct&interval=yesterday'; break;
                case '24 Hour': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=canyonjct&interval=1days'; break;
                case '7 Day': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=canyonjct&interval=7days'; break;
                case '30 Day': this.canyon_junctionStateURL = 'https://trailwaze.info/vehicleTrafficByState.php?site=canyonjct&interval=30days'; break;
            }
        },
        switchArrow: function() {
            if(this.stateArrowImage == 'icons/downArrow.png'){
                this.stateArrowImage = 'icons/upArrow.png';
            } else{
                this.stateArrowImage = 'icons/downArrow.png';
            }
        },
        resetArrow: function() {
            this.stateArrowImage = 'icons/downArrow.png';
        },
        selectStateDates: function(entrance) {
            if( this.stateDateRange.length > 1) { // a range of days selected
                let year1 = this.stateDateRange[0].substr(0,4);
                let year2 = this.stateDateRange[1].substr(0,4);
                let month1 = this.stateDateRange[0].substr(5,2);
                let month2 = this.stateDateRange[1].substr(5,2);
                let day1 = this.stateDateRange[0].substr(8,2);
                let day2 = this.stateDateRange[1].substr(8,2);
                switch(entrance) {
                    case 'south': this.southStateURL = `https://trailwaze.info/zion/plates_by_state_date_south.php?date1=${year1}-${month1}-${day1}&date2=${year2}-${month2}-${day2}`; break;
                    case 'east': this.eastStateURL = `https://trailwaze.info/zion/plates_by_state_date_east.php?date1=${year1}-${month1}-${day1}&date2=${year2}-${month2}-${day2}`; break;
                    case 'kolob': this.kolobStateURL = ``; break;
                    case 'canyon': this.canyon_junctionStateURL = ``; break;
                }

            }else if( this.stateDateRange.length == 1) { // just a single day selected
                let year1 = this.stateDateRange[0].substr(0,4);
                let month1 = this.stateDateRange[0].substr(5,2);
                let day1 = this.stateDateRange[0].substr(8,2);
                switch(entrance){
                    case 'south': this.southStateURL = `https://trailwaze.info/zion/plates_by_state_date_south.php?date1=${year1}-${month1}-${day1}&date2=${year1}-${month1}-${day1}`; break;
                    case 'east': this.eastStateURL = `https://trailwaze.info/zion/plates_by_state_date_east.php?date1=${year1}-${month1}-${day1}&date2=${year1}-${month1}-${day1}`; break;
                    case 'kolob': this.kolobStateURL = ``; break;
                    case 'canyon': this.canyon_junctionStateURL = ``; break;
                }
            } else{
                alert('No days were selected!');
            }
            this.stateDateRange = []; // reset calendar
        },
        closeDatePicker: function() {
            this.DatePickerPopUp = false;
        },
        openDatePicker: function() {
            this.DatePickerPopUp = true;
        },
        sleep: function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
              if ((new Date().getTime() - start) > milliseconds){
                break;
              }
            }
        },
    },
    mounted() {
        this.getTodaysDate();
    },
    computed: {
        dateRangeText () {
            return this.stateDateRange.join(' ~ ');
        }
    },
    watch: {
        EntrancePage: function() {
            if(this.EntrancePage == 'Kolob'){
                this.RSelected();
            }
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
