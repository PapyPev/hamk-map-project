/** ***************************************************************************
 * Get Train Informations.
 * Initialize Map content
 *
 * @author Pev
 * @version 1.1
 *************************************************************************** */

/* ============================================================================
 * CONSTANTS
 * ========================================================================= */

var DIGI_TRAFFIC = 'http://rata.digitraffic.fi/api/v1/live-trains?station=';
var DIGI_STATIONS = 'http://rata.digitraffic.fi/api/v1/metadata/stations';

/* ============================================================================
 * GLOBALS
 * ========================================================================= */

 var listStations = []

/* ============================================================================
 * FUNCTIONS
 * ========================================================================= */

// Autocomplete for textStation
$(function() {
  $( "#textStation" ).autocomplete({
    source: listStations
  });
});

/**
 * Load HTML content for Stations informations
 * @param {json} data JSON response from digitraffic
 --------------------------------------------------------------------------- */
function loadTimetables (data) {
  console.log(data);

  //Init html
  var htmlContent = '';

  // Init Acordeon group
  htmlContent += '<div class="panel-group" id="accordion" '
    + 'role="tablist" aria-multiselectable="true">'

  for (var i = 0; i < data.length; i++) {

    // Acordeon Title
    var acTitle = data[i].trainCategory + ' - '
      + data[i].trainType + ' - ' + data[i].trainNumber
    // Heading
    var headId = 'head' + data[i].trainCategory + '-'
      + data[i].trainType + '-' + data[i].trainNumber
    // Acordeon ID
    var acIdent = 'id' + data[i].trainCategory + '-'
      + data[i].trainType + '-' + data[i].trainNumber

    // Init container
    htmlContent += '<div class="panel panel-default">'
    htmlContent += '<div class="panel-heading" role="tab" id="'+headId+'">'
    htmlContent += '<h4 class="panel-title">'
    htmlContent += '<a role="button" data-toggle="collapse" '
      + 'data-parent="#accordion" href="#'+acIdent+'" '
      + 'aria-expanded="true" aria-controls="'+acIdent+'">'
      + acTitle
    htmlContent += '</a>'
    htmlContent += '</h4>'
    htmlContent += '</div>'
    htmlContent += '<div id="'+acIdent+'" '
      + 'class="panel-collapse collapse" role="tabpanel" '
      + 'aria-labelledby="'+headId+'">'
    htmlContent += '<div class="panel-body">'
    htmlContent += '<table class="table table-striped">'
    htmlContent += '<thead>'
    htmlContent += '<tr>'
    htmlContent += '<th>Status</th>'
    htmlContent += '<th>Type</th>'
    htmlContent += '<th>StationShortCode</th>'
    htmlContent += '<th>ScheduledTime</th>'
    htmlContent += '<th>CommercialTrack</th>'
    htmlContent += '</tr>'
    htmlContent += '</thead>'
    htmlContent += '<tbody>'

    // Loop timetable
    for (var j = 0; j < data[i].timeTableRows.length; j++) {

      // Content
      htmlContent += '<tr>'
      htmlContent += '<td>'+data[i].timeTableRows[j].cancelled+'</td>'
      htmlContent += '<td>'+data[i].timeTableRows[j].type+'</td>'
      htmlContent += '<td>'+data[i].timeTableRows[j].stationShortCode+'</td>'
      htmlContent += '<td>'+data[i].timeTableRows[j].scheduledTime+'</td>'
      htmlContent += '<td>'+data[i].timeTableRows[j].commercialTrack+'</td>'
      htmlContent += '</tr>'

    };

    // End Container
    htmlContent += '</tbody>'
    htmlContent += '</table>'
    htmlContent += '</div>'
    htmlContent += '</div>'
    htmlContent += '</div>'

  };

  // End Acordeon group
  htmlContent += '</div>'

  $("#divResults").html(htmlContent);
}

/* ============================================================================
 * MAIN
 * ========================================================================= */

/**
 * Action performed when the page is fully loaded
 --------------------------------------------------------------------------- */
$(document).ready(function($) {

  // ------- STATIONS AUTOCOMPLETE -------

  // Init XMLHttp request
  var xhrAutoCompl = new XMLHttpRequest();

  // GET query
  xhrAutoCompl.open('GET', DIGI_STATIONS);

  // Load Content
  xhrAutoCompl.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      
      // Data responses from digitraffic
      var data = JSON.parse(this.responseText);

      // Loop
      for (var i = 0; i < data.length; i++) {
        
        // If user can get the train
        if (data[i].passengerTraffic) {
          var value = data[i].stationShortCode + ":" + data[i].stationName;
          listStations.push(value);
        };

      };

    }
  };

  // Sent request
  xhrAutoCompl.send();


  // ------- SEARCH TIME TABLE -------

  // Form button onclick event
  $("#trainButton").on('click', function(){

    // Get inout value
    var stationValue = $("#textStation").val();

    // Split get station code
    var stationCode = stationValue.split(":")[0];

    // Init XMLHttp request
    var xhrTimetables = new XMLHttpRequest();

    // GET query
    xhrTimetables.open('GET', DIGI_TRAFFIC+stationCode);

    // Load Content
    xhrTimetables.onreadystatechange = function () {
      if (this.status == 200 && this.readyState == 4) {
        //console.log('response: ' + this.responseText);
        loadTimetables(JSON.parse(this.responseText));
      }
    };

    // Sent request
    xhrTimetables.send();
  }); //-- end $("#trainButton").click()

}); //--- end $(document).ready()