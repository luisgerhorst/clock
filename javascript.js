$(document).ready(function () {

function Format(id, string, unit, currentTime) {

    var remove = function () {
	    
	    $('#settings ul.removed li.' + id).show(); // show .removed item
		$('#settings ul.added li.' + id).remove(); // remove .added item
		$('#clock ul li.' + id).remove(); // remove format
		
		console.log('remove called, id=' + id + ''); // log
		
	}
	
	// Public Methods
	
	this.add = function() {
	    
	    $('#settings ul.removed li.' + id).hide(); // hide .removed item
		
		$('#settings ul.added').append('<li class="' + id + ' button" data-id="' + id + '">- ' + string + '</li>'); // add .added item
		$('#settings ul.added li.' + id).click(remove); // add .added item listener
		
		$('#clock ul').append('<li class="' + id + '"><span class="number"></span><span class="unit"> ' + unit + '</span></li>'); // add format
		
		console.log('.add called, id=' + id); // log
		
	}
	
	this.setTime = function() {
	
	    if ($('#clock ul li.' + id).length) $('#clock ul li.' + id + ' span.number').text(currentTime); // if item exists, text current time into it
		
	}

    // Actions

	$('#settings ul.removed').append('<li class="' + id + ' button">+ ' + string + '</li>'); // add .removed item
	$('#settings ul.removed li.' + id).click(this.add); // add .removed item listener
	
	// console.log('new Format created, id=' + id);

}


function settings() {

    // Constructors

    var cookie = new (function () {
	
		this.save = function (key, value) {
		
			document.cookie = 'clock_' + key + '=' + encodeURIComponent(value) + '; expires=' + new Date(moment() + 1000*60*60*24*360).toGMTString() + ';';
			
		}
		
		this.read = function (key) {
		
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
	
    })();
    
    var show = function () {
	
	    // #wrapper
		$('#wrapper').addClass('slideOut');
		setTimeout(function () {
		    $('#wrapper').removeClass('slideOut').addClass('slideIn');
		    $('#clock').hide();
		    $('#settings').show();
		    setTimeout(function () {
		        $('#wrapper').removeClass('slideIn');
		    }, 500);
		}, 500);
		
		// #done-icon
	    $('#done-icon').show();
	    
	    // #settings-icon
	    $('#settings-icon').addClass('slideOut');
	    setTimeout(function () {
	        $('#settings-icon').removeClass('slideOut').hide();
	    }, 500);
	    
	}
	
	var hide = function () {
	
	    // #wrapper
	    $('#wrapper').addClass('slideOut');
	    setTimeout(function () {
	        $('#wrapper').removeClass('slideOut').addClass('slideIn');
	        $('#clock').show();
	        $('#settings').hide();
	        setTimeout(function () {
	            $('#wrapper').removeClass('slideIn');
	        }, 500);
	    }, 500);
	    
	    // #done-icon
	    $('#done-icon').addClass('slideOut');
	    setTimeout(function () {
	        $('#done-icon').removeClass('slideOut').hide();
	    }, 500);
	    
	    // #settings-icon
	    $('#settings-icon').show();
	    
	}
	
	var save = function () {
		
		var added = {};
		
		$('#settings ul.added li').each( function () {
			added[Object.keys(added).length] = $(this).attr('data-id');
		});
		
		added = JSON.stringify(added);
		cookie.save('added', added);
		
		console.log("saved Status, " + added);
		
	}
	
	var read = function () {
	
		var added = cookie.read('added');
		if (!added) return false;
		
		try {
			added = JSON.parse(added);
		} catch (err) {
			console.log('Unable to parse JSON of added items.');
			return false;
		}
		
		var id;
		for (var count in added) {
			id = added[count];
			formats[id].add();
		}
		
		return true;
		
	}
	
	if (!read()) {
		formats.secondDay.add();
		formats.week.add();
	}
	
	// Event handlers
	
	$('#settings-icon').click(show);
	
	$('#done-icon').click(function () {
		hide();
		save();
	});
	
}


function time() {

    // Methods

    var set = function () {
    
		for (var id in formats) {
		    formats[id].setTime();
		}

    }

    set();
    setInterval(set, 1000);
    
}


// Utilities

var numberSeperator = function (string) {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // insert space every third number
}


// Start App

var formats = {
	
	second: new Format('second', 'Second', 's', function() {
		
		return moment().format('ss');
	
	}),
	
	secondDay: new Format('secondDay', 'Second of Day', 's/d', function() {
	    
	    var hours='', minutes='', seconds='';
	    
	    hours = parseInt(moment().format('HH')) * 60 * 60;
	    minutes = parseInt(moment().format('mm')) * 60;
	    seconds = hours + minutes + parseInt(moment().format('ss'));
	    
	    seconds = numberSeperator(seconds);
	    
	    return seconds;
	    
	}),
	
	secondYear: new Format('secondYear', 'Second of Year', 's/y', function() {
	    
	    var days='', hours='', minutes='', seconds='';
	    
	    days = parseInt(moment().format('DDDD'))-1; // -1 because the first day of the year is 1, not 0
	    days = days * 24 * 60 * 60;
	    hours = parseInt(moment().format('HH')) * 60 * 60;
	    minutes = parseInt(moment().format('mm')) * 60;
	    seconds = days + hours + minutes + parseInt(moment().format('ss'));
	    
	    seconds = numberSeperator(seconds);
	    
	    return seconds;
	    
	}),
	
	minute: new Format('minute', 'Minute', 'm', function() {
		
		return moment().format('mm');
		
	}),
	
	minuteDay: new Format('minuteDay', 'Minute of Day', 'm/d', function() {
		
		var hours='', minutes='';
	    
	    hours = parseInt(moment().format('HH')) * 60;
	    minutes = hours + parseInt(moment().format('mm'));
	    
	    minutes = numberSeperator(minutes);
	    
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
		
		return parseInt(moment().format('ww'));
		
	}),
	
	month: new Format('month', 'Month', 'M', function() {
		
		return moment().format('MM');
		
	}),
	
	year: new Format('year', 'Year', 'y', function() {
		
		return moment().format('YYYY');
		
	})
	
};

settings();
time();

});