// ------------------------------------------------------------------------- //
// mini_calendar.js                                                          //
//                                                                           //
// Mark Brettin                                                              //
// ------------------------------------------------------------------------- //


// Setup some globals
//
var d = new Date();              

var months = getMonths();                  // array of month names
var dd = d.getDate();                      // day of month 1 - 31
var mn = d.getMonth();                     // month 0 - 11
var yy = d.getFullYear();                  // 4-digit year


//document.write("dd : " + dd + "<br>");
//document.write("mn : " + mn + "<br>");
//document.write("yy : " + yy + "<br>");


function displayMiniCalendar(id_name)
{
    // Need to get the day of the week for which the
    // 1st falls on for the current month and year.
    //
    d.setDate(1);
    d.setFullYear(yy);
    d.setMonth(mn);
    var first_dow = d.getDay();                // 0 - 6 (0 == sunday... 6 == saturday)

    var calendar_html;
    var days = 1;
    var total_days = daysOfMonth(d.getMonth());
    var offset = 0;

    calendar_html  = "<table width=\"140\" class=\"miniCalendar\" cellspacing=\"0\" cellpadding=\"0\">";

    calendar_html += "    <tr><td colspan=\"7\">";
    calendar_html += "        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    calendar_html += "        <tr bgcolor=\"#b5dce5\">";
    calendar_html += "            <td align=\"right\"><span style=\"cursor: pointer;\" onclick=\"closeMiniCalendar(\'" + id_name + "\');\">";
    calendar_html += "                                <img src=\"images/mini_calendar_close_button.jpg\" /></span></td>";
    calendar_html += "        </tr></table>";
    calendar_html += "    </td></tr>";

    calendar_html += "    <tr bgcolor=\"#ffffff\" valign=\"middle\" align=\"center\">";

    calendar_html += "    <td>";
    calendar_html += "        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    calendar_html += "            <tr align=\"center\" valign=\"middle\">";
    calendar_html += "            <td colspan=\"1\" class=\"calendarMonth\" align=\"left\">&nbsp;<span style=\"cursor: pointer;\" onClick=\"month_dec(\'" + id_name + "\');\">&lt;</span></td>";
    calendar_html += "            <td colspan=\"5\" class=\"calendarMonth\">" + months[mn] + " " + yy + "</td>";
    calendar_html += "            <td colspan=\"1\" class=\"calendarMonth\" align=\"right\"><span style=\"cursor: pointer;\" onClick=\"month_inc(\'" + id_name + "\');\">&gt</span>&nbsp;</td>";
    calendar_html += "            </tr>";

    calendar_html += "            <tr>";
    calendar_html += "            <td class=\"calendarDays\">S</td>";
    calendar_html += "            <td class=\"calendarDays\">M</td>";
    calendar_html += "            <td class=\"calendarDays\">T</td>";
    calendar_html += "            <td class=\"calendarDays\">W</td>";
    calendar_html += "            <td class=\"calendarDays\">T</td>";
    calendar_html += "            <td class=\"calendarDays\">F</td>";
    calendar_html += "            <td class=\"calendarDays\">S</td>";
    calendar_html += "            </tr>";

    for(var i = 0; i < 6; i++)
    {
        if(first_dow == 999) { break; }

        calendar_html += "            <tr>";

        // BEGIN: SUNDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: SUNDAY

        // BEGIN: MONDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: MONDAY

        // BEGIN: TUESDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: TUESDAY

        // BEGIN: WEDNESDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: WEDNESDAY

        // BEGIN: THURSDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: THURSDAY

        // BEGIN: FRIDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: FRIDAY

        // BEGIN: SATURDAY
        if(offset >= first_dow)  { calendar_html += "<td class=\"calendarDate1\" onclick=\"putDate(" + mn + "," + days + "," + yy + ",\'" + id_name + "\');\">" + days + "</td>"; if(days >= total_days) { first_dow = 999; } }
        else                     { calendar_html += "<td class=\"calendarDate2\">&nbsp;</td>"; }
        offset++;
        if(offset > first_dow) { days++; }
        // END: SATURDAY
    }
    calendar_html += "        </table>";
    calendar_html += "    </td>";
    calendar_html += "    </tr>";
    calendar_html += "</table>";

    document.getElementById("mini_calendar").innerHTML = calendar_html;
    eval("document.getElementById(\"mcform\")." + id_name + ".focus();");
    //document.getElementById("mcform").dive_date1.focus();
}


function getMonths()
{
    var month_names = new Array();
    month_names[0]  = "January";
    month_names[1]  = "February";
    month_names[2]  = "March";
    month_names[3]  = "April";
    month_names[4]  = "May";
    month_names[5]  = "June";
    month_names[6]  = "July";
    month_names[7]  = "August";
    month_names[8]  = "September";
    month_names[9]  = "October";
    month_names[10] = "November";
    month_names[11] = "December";

    return(month_names);
}


function daysOfMonth(i)
{
    var m = new Array();
    m[0] = 31;            // JAN
    m[1] = 28;            // FEB
    m[2] = 31;            // MAR
    m[3] = 30;            // APR
    m[4] = 31;            // MAY
    m[5] = 30;            // JUN
    m[6] = 31;            // JUL
    m[7] = 31;            // AUG
    m[8] = 30;            // SEP
    m[9] = 31;            // OCT
    m[10] = 30;           // NOV
    m[11] = 31;           // DEC

    return(m[i]);
}

function month_inc(id_name)
{
    //alert("month_inc()");
    if(mn < 11) { mn++; }
    else        { mn = 0; yy++; }
    displayMiniCalendar(id_name);
}


function month_dec(id_name)
{
    //alert("month_dec()");
    if(mn > 0) { mn--; }
    else       { mn = 11; yy--; }
    displayMiniCalendar(id_name);
}


function closeMiniCalendar(id_name)
{
    document.getElementById("mini_calendar").innerHTML = "";
    eval("document.getElementById(\"mcform\")." + id_name + ".focus();");
    //document.getElementById("mcform").dive_date1.focus();
}

function putDate(mm, dd, yy, id_name)
{
    // Note: mm is the month number 0 - 11 so always add 1.
    //

    var the_month; 
    var the_day;

    mm++;

    if(mm < 10) { the_month = "0" + mm; } else { the_month = mm.toString(); }
    if(dd < 10) { the_day = "0" + dd;   } else { the_day = dd.toString();   }

    //alert(the_month + "/" + the_day + "/" + yy);

    var charter_date = yy + "-" + the_month + "-" + the_day;
    var charter_time = $('#dive_time1 option:selected').val();

    eval("document.getElementById(\"mcform\")." + id_name + ".value = the_month + \"/\" + the_day + \"/\" + yy");

    // This function call must be below the above eval().
    getDiveDateAvailability(id_name, charter_date, charter_time.toLowerCase());

    //document.getElementById("mcform").dive_date1.value = the_month + "/" + the_day + "/" + yy;
    closeMiniCalendar(id_name);
}

function getDiveDateAvailability(id_name, charter_date, charter_time) {
    // We need to use some AJAX to query the bookings_availability
    // table to find out how many available seats there are.
    //
    // This function is called when a date is choosen from the mini_calendar or
    // from the dive time onchange event in charter_select.php and manage_seats.php.
 
    //alert("getDiveDateAvailability():\n\nid_name=" + id_name + "\ncharter_date=" + charter_date + "\ncharter_time=" + charter_time);

    if(charter_date == '' && charter_time == '') { 
        var tmp_date = '';

        if(id_name == 'date_seats_avail') { tmp_date = $('#date_seats_avail').val(); } // value is mm/dd/yyyy - manage_seats.php
        else if(id_name == 'dive_date1')  { tmp_date = $('#dive_date1').val(); }       // value is mm/dd/yyyy - charter_select.php

        if(!tmp_date || tmp_date == '') { return; }

        var tmp_arr = tmp_date.split("/");       // we need  yyyy-mm-dd
        charter_date = tmp_arr[2] + '-' + tmp_arr[0] + '-' + tmp_arr[1];
        charter_time = $('#dive_time1 option:selected').val(); 
    }

    if(id_name == 'dive_date1') {
        $.get("ajax/res_seats.php", {"charter_date":charter_date, "charter_time": charter_time}, function(data) 
        {
            //$("#seats_available").html(data);
            //var max_seats = $("#seats_available").html();
            add_num_divers_options(data);  //max_seats);
        });
    }
    else if(id_name == 'date_seats_avail') {  
        $.get("../ajax/res_seats.php", {"charter_date":charter_date, "charter_time": charter_time}, function(data) {
            // We want the number of seats available to be selected in the select list.
            $("#seats_avail option[text=" + data + "]").attr("selected", "selected");
            //$("#seats_avail").val(data);   // --> this works also but I like the above
        });
    }
}

function add_num_divers_options(max_seats) {
    var options = {};

    for(var i = 1; i <= max_seats; i++) { options[i] = i; }

    // First let us remove any options that may exist.
    for(var j = 1; j <= 20; j++) {
        var tmp = "#num_of_divers option[value='" + j + "']";
        $(tmp).remove();
    }


    // Now let us add the options.
    $.each(options, function(val, text) {
        $('#num_of_divers').append(
            $('<option></option>').val(val).html(text)
        );
    });
}




