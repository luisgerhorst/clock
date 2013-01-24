$(document).ready(function () {


// Obj Format


function Format(id, string, unit, time) {
	
	this.setTime = function() {
	    
	    if ($('#clock ul li.' + id).length != 0) $('#clock ul li.' + id + ' span.number').text(time);
		
	}
	
	this.add = function() {
	    
	    hide('#settings ul.removed li.' + id); // hide .removed item
		
		$('#settings ul.added').append('<li class="' + id + ' button" data-id="' + id + '">- ' + string + '</li>'); // add .added item
		$('#settings ul.added li.' + id).click(remove); // add .added item listener
		
		$('#clock ul').append('<li class="' + id + '"><span class="number"></span><span class="unit"> ' + unit + '</span></li>'); // add format
		
		console.log('.add called, id=' + id); // log
		
	}
	
	var remove = function () {
	    
	    show('#settings ul.removed li.' + id); // show .removed item
		
		$('#settings ul.added li.' + id).remove(); // remove .added item
		
		$('#clock ul li.' + id).remove(); // remove format
		
		console.log('remove called, id=' + id + ''); // log
		
	}

	$('#settings ul.removed').append('<li class="' + id + ' button">+ ' + string + '</li>'); // add .removed item
	$('#settings ul.removed li.' + id).click(this.add); // add .removed item listener
	
	console.log('new Format created, id=' + id);

}


// create Formats

var formats = {
	
	second: new Format('second', 'Second', 's', function() {
		
		return moment().format('ss');
	
	}),
	
	secondDay: new Format('secondDay', 'Second of Day', 's/d', function() {
	    
	    var hours='', minutes='', seconds='', thousands='', hundreds='';
	    
	    hours = parseInt(moment().format('HH')) * 60 * 60;
	    minutes = parseInt(moment().format('mm')) * 60;
	    seconds = hours + minutes + parseInt(moment().format('ss'));
	    
	    thousands = Math.floor(seconds/1000);
	    hundreds = seconds - thousands * 1000;
	    
	    if (thousands == 0) seconds = hundreds;
	    else seconds = thousands + " " + hundreds;
	    
	    return seconds;
	    
	}),
	
	secondYear: new Format('secondYear', 'Second of Year', 's/y', function() {
	    
	    var days='', hours='', minutes='', seconds='', thousands='', hundreds='';
	    
	    days = parseInt(moment().format('DDDD'))-1; // -1 because the first day of the year is 1, not 0
	    days = days * 24 * 60 * 60;
	    hours = parseInt(moment().format('HH')) * 60 * 60;
	    minutes = parseInt(moment().format('mm')) * 60;
	    seconds = days + hours + minutes + parseInt(moment().format('ss'));
	    
	    millions = Math.floor(seconds/1000000);
	    thousands = Math.floor(seconds/1000) - millions * 1000;
	    hundreds = seconds - millions * 1000000 - thousands * 1000;
	    
	    if (millions != 0 && thousands != 0) seconds = millions + " " + thousands + " " + hundreds;
	    if (millions == 0 && thousands != 0) seconds = thousands + " " + hundreds;
	    if (millions == 0 && thousands == 0) seconds = hundreds;
	    
	    return seconds;
	    
	}),
	
	minute: new Format('minute', 'Minute', 'm', function() {
		
		return moment().format('mm');
		
	}),
	
	minuteDay: new Format('minuteDay', 'Minute of Day', 'm/d', function() {
		
		var hours='', minutes='', thousands='', hundreds='';
	    
	    hours = parseInt(moment().format('HH')) * 60;
	    minutes = hours + parseInt(moment().format('mm'));
	    
	    thousands = Math.floor(minutes/1000);
	    hundreds = minutes - thousands * 1000;
	    
	    if (thousands == 0) minutes = hundreds;
	    else minutes = thousands + " " + hundreds;
	    
	    return minutes;
		
	}),
	
	hour: new Format('hour', 'Hour', 'h', function() {
		
		return moment().format('HH');
		
	}),
	
	dayWeek: new Format('dayWeek', 'Day of Week', 'd/w', function() {
		
		return moment().format('d');
		
	}),
	
	day: new Format('day', 'Day', 'd', function() {
		
		return moment().format('DD');
		
	}),
	
	dayYear: new Format('dayYear', 'Day of Year', 'd/y', function() {
		
		return moment().format('DDDD');
		
	}),
	
	week: new Format('week', 'Week', 'w', function() {
		
		return moment().format('ww');
		
	}),
	
	month: new Format('month', 'Month', 'M', function() {
		
		return moment().format('MM');
		
	}),
	
	year: new Format('year', 'Year', 'y', function() {
		
		return moment().format('YYYY');
		
	})
	
};


// all

function setAllTimes() {
	
	for (var id in formats) {
		formats[id].setTime();
	}
	
}

// buttons

$('#settings-icon').click(showSettings);
$('#done-icon').click(showClockAndSave);

function showSettings() {
	hide('#clock');
    show('#done-icon');
    show('#settings');
    hide('#settings-icon');
}
	
function showClockAndSave() {
    show('#clock');
    hide('#done-icon');
    hide('#settings');
    show('#settings-icon');
    saveStatus();
}

// save & read Status

function saveStatus() {
	
	var added = {};
	
	$('#settings ul.added li').each( function () {
		added[Object.keys(added).length] = $(this).attr('data-id');
	});
	
	added = JSON.stringify(added);
	setCookie('added', added);
	
	console.log("saved Status, " + added);
	
}

function readStatus() {

	var added = readCookie('added');
	added = JSON.parse(added);
	
	var id;
	for (var count in added) {
		id = added[count];
		formats[id].add();
	}
	
}

// set / read Cookie

function setCookie(key, value) {
	document.cookie = 'clock_' + key + '=' + encodeURIComponent(value) + '; expires=' + new Date(moment() + 1000*60*60*24*360).toGMTString() + ';';
}

function readCookie(key) {
    key =  'clock_' + key;
 	var value = '';
	if(document.cookie) {
       	var array = document.cookie.split((escape(key) + '=')); 
       	if(2 <= array.length) {
           	var array2 = array[1].split(';');
       		value  = unescape(array2[0]);
       	}
	}
	return decodeURIComponent(value);
}

// show / hide

function show(object) {
	$(object).removeClass('hide');
}

function hide(object) {
	$(object).addClass('hide');
}

// update Check

function checkForUpdate() {
    if (window.applicationCache != undefined && window.applicationCache != null) {
        window.applicationCache.addEventListener('updateready', updateApplication);
    }
}

function updateApplication(event) {
    if (window.applicationCache.status != 4) return; // zur sicherheit
    var response = confirm("An update for this web app is available, do you want to install it now or skip this version? Your data (added and removed time formats) will be lost.");
    if (response != true) return;
    document.cookie = 'clock_clockHTML=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    document.cookie = 'clock_settingsRemovedHTML=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    document.cookie = 'clock_settingsAddedHTML=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    window.applicationCache.removeEventListener('updateready', updateApplication);
    window.applicationCache.swapCache();
    window.location.reload();
}

// defaults

function showClock() {
    show('#clock');
    hide('#done-icon');
    hide('#settings');
    show('#settings-icon');
}

function addDefaultFormats() {
    formats.secondDay.add();
    formats.week.add();
}


// Start App

showClock();
if (readCookie('added') == '') addDefaultFormats();
else readStatus();
    
checkForUpdate();

setAllTimes();
setInterval(setAllTimes, 1000);


}); // document.ready