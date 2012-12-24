/* Build 7 */


// Ready Document

$(document).ready(function () {

    defaultView();
    if (readCookie('settingsRemovedHTML') == '') defaultFormats();
    else readStatus();
    
    checkForUpdate();

    setAllTimes();
    setInterval(setAllTimes, 1000);

}); // document.ready


// defining Object

function Format() {}

Format.prototype.add = function() {
    
    hide('#settings ul.removed .' + this.id);
	
	$('#settings ul.added').append('<li class="' + this.id + ' button" onclick="' + this.id + 'Format.remove();">- ' + this.string + '</li>');
	
	$('#clock ul').append('<li class="' + this.id + '"><span class="number"></span><span class="unit"> ' + this.unit + '</span></li>');
	
	console.log('.add called; .id=' + this.id + ';');
	
} // .add

Format.prototype.remove = function() {
    
    show('#settings .removed li.' + this.id);
	
	$('#settings .added li.' + this.id).remove();
	
	$('#clock ul li.' + this.id).remove();
	
	console.log('.remove called; .id=' + this.id + ';');
	
} // .remove


Format.prototype.setTime = function() {
    
    if ($('#clock ul li.' + this.id).length != 0) $('#clock ul li.' + this.id + ' span.number').text(this.setTimeFunction);
	
} // .setTime


// creating Objects

var secondFormat = new Format();
secondFormat.id = 'second';
secondFormat.string = 'Second';
secondFormat.unit = 's';
secondFormat.setTimeFunction = function() {
	
	return getMomentFormat('ss');
	
}

var secondDayFormat = new Format();
secondDayFormat.id = 'secondDay';
secondDayFormat.string = 'Second of Day';
secondDayFormat.unit = 's/d';
secondDayFormat.setTimeFunction = function() {
    
    var hours='', minutes='', seconds='', thousands='', hundreds='';
    
    hours = parseInt(getMomentFormat('HH')) * 60 * 60;
    minutes = parseInt(getMomentFormat('mm')) * 60;
    seconds = hours + minutes + parseInt(getMomentFormat('ss'));
    
    thousands = Math.floor(seconds/1000);
    hundreds = seconds - thousands * 1000;
    
    if (thousands == 0) seconds = hundreds;
    else seconds = thousands + " " + hundreds;
    
    return seconds;
    
}

var secondYearFormat = new Format();
secondYearFormat.id = 'secondYear';
secondYearFormat.string = 'Second of Year';
secondYearFormat.unit = 's/y';
secondYearFormat.setTimeFunction = function() {
    
    var days='', hours='', minutes='', seconds='', thousands='', hundreds='';
    
    days = parseInt(getMomentFormat('DDDD')) * 24 * 60 * 60;
    hours = parseInt(getMomentFormat('HH')) * 60 * 60;
    minutes = parseInt(getMomentFormat('mm')) * 60;
    seconds = days + hours + minutes + parseInt(getMomentFormat('ss'));
    
    millions = Math.floor(seconds/1000000);
    thousands = Math.floor(seconds/1000) - millions * 1000;
    hundreds = seconds - millions * 1000000 - thousands * 1000;
    
    if (millions != 0 && thousands != 0) seconds = millions + " " + thousands + " " + hundreds;
    if (millions == 0 && thousands != 0) seconds = thousands + " " + hundreds;
    if (millions == 0 && thousands == 0) seconds = hundreds;
    
    return seconds;
    
}

var minuteFormat = new Format();
minuteFormat.id = 'minute';
minuteFormat.string = 'Minute';
minuteFormat.unit = 'm';
minuteFormat.setTimeFunction = function() {
	
	return getMomentFormat('mm');
	
}

var minuteDayFormat = new Format();
minuteDayFormat.id = 'minuteDay';
minuteDayFormat.string = 'Minute of Day';
minuteDayFormat.unit = 'm/d';
minuteDayFormat.setTimeFunction = function() {
	
	var hours='', minutes='', thousands='', hundreds='';
    
    hours = parseInt(getMomentFormat('HH')) * 60;
    minutes = hours + parseInt(getMomentFormat('mm'));
    
    thousands = Math.floor(minutes/1000);
    hundreds = minutes - thousands * 1000;
    
    if (thousands == 0) minutes = hundreds;
    else minutes = thousands + " " + hundreds;
    
    return minutes;
	
}

var hourFormat = new Format();
hourFormat.id = 'hour';
hourFormat.string = 'Hour';
hourFormat.unit = 'h';
hourFormat.setTimeFunction = function() {
	
	return getMomentFormat('HH');
	
}

var dayWeekFormat = new Format();
dayWeekFormat.id = 'dayWeek';
dayWeekFormat.string = 'Day of Week';
dayWeekFormat.unit = 'd/w';
dayWeekFormat.setTimeFunction = function() {
	
	return getMomentFormat('d');
	
}

var dayFormat = new Format();
dayFormat.id = 'day';
dayFormat.string = 'Day';
dayFormat.unit = 'd';
dayFormat.setTimeFunction = function() {
	
	return getMomentFormat('DD');
	
}

var dayYearFormat = new Format();
dayYearFormat.id = 'dayYear';
dayYearFormat.string = 'Day of Year';
dayYearFormat.unit = 'd/y';
dayYearFormat.setTimeFunction = function() {
	
	return getMomentFormat('DDDD');
	
}

var weekFormat = new Format();
weekFormat.id = 'week';
weekFormat.string = 'Week';
weekFormat.unit = 'w';
weekFormat.setTimeFunction = function() {
	
	return getMomentFormat('ww');
	
}

var monthFormat = new Format();
monthFormat.id = 'month';
monthFormat.string = 'Month';
monthFormat.unit = 'M';
monthFormat.setTimeFunction = function() {
	
	return getMomentFormat('MM');
	
}

var yearFormat = new Format();
yearFormat.id = 'year';
yearFormat.string = 'Year';
yearFormat.unit = 'y';
yearFormat.setTimeFunction = function() {
	
	return getMomentFormat('YYYY');
	
}

function getMomentFormat(format) {
	return moment().format(format);
}

// all

function setAllTimes() {
	secondFormat.setTime();
	secondDayFormat.setTime();
	secondYearFormat.setTime();
	minuteFormat.setTime();
	minuteDayFormat.setTime();
	hourFormat.setTime();
	dayWeekFormat.setTime();
	dayFormat.setTime();
	dayYearFormat.setTime();
	weekFormat.setTime();
	monthFormat.setTime();
	yearFormat.setTime();
}

// buttons

function settingsIconClick() {
	hide('#clock');
    show('#done-icon');
    show('#settings');
    hide('#settings-icon');
}
	
function doneIconClick() {
    show('#clock');
    hide('#done-icon');
    hide('#settings');
    show('#settings-icon');
    saveStatus();
}

// save & read Status

function saveStatus() {
	setCookie('clockHTML', $('#clock ul').html());
	setCookie('settingsAddedHTML', $('#settings ul.added').html());
	setCookie('settingsRemovedHTML', $('#settings ul.removed').html());
}

function readStatus() {
	$('#clock ul').html(readCookie('clockHTML'));
	$('#settings ul.added').html(readCookie('settingsAddedHTML'));
	$('#settings ul.removed').html(readCookie('settingsRemovedHTML'));
}

// default

function defaultView() {
    show('#clock');
    hide('#done-icon');
    hide('#settings');
    show('#settings-icon');
}

function defaultFormats() {
    secondDayFormat.add();
    weekFormat.add();
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