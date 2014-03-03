// ------------------------------------------------------------------------- //
// adddivedate.js                                                            //
//                                                                           //
// Mark Brettin                                                              //
// ------------------------------------------------------------------------- //


// Setup some globals
//
var MAX_DIVE_DATES = 7;
var dive_dates_ctr = 1;

var FISH_HTML = "<font color=\"#000080\"><b>You are a fish out of water!  Call us.</b></font>";

var added_flag = false;
var DIVE_DATES = new Array();
    DIVE_DATES["dive_date2"] = "";
    DIVE_DATES["dive_date3"] = "";
    DIVE_DATES["dive_date4"] = "";
    DIVE_DATES["dive_date5"] = "";
    DIVE_DATES["dive_date6"] = "";
    DIVE_DATES["dive_date7"] = "";


function addDiveDate()
{
    var the_html = "";
    var id = "";
    var dd2 = document.getElementById('dive_date2');
    var dd3 = document.getElementById('dive_date3');
    var dd4 = document.getElementById('dive_date4');

    if((dd2.innerHTML == '') || (dd2.innerHTML == null))
    {
        the_html = makeDiveDateHTML("dive_date2", "dive_time2");
        id = "dive_date2";
    }
    else if((dd3.innerHTML == '') || (dd3.innerHTML == null))
    {
        the_html = makeDiveDateHTML("dive_date3", "dive_time3");
        id = "dive_date3";
    }
    else if((dd4.innerHTML == '') || (dd4.innerHTML == null))
    {
        the_html = makeDiveDateHTML("dive_date4", "dive_time4");
        id = "dive_date4";
    }

    if(id != '') { document.getElementById(id).innerHTML = the_html; }
}

function makeDiveDateHTML(id, id_time)
{
    var digit = id.substr(id.length -1, 1);
    //alert("digit = " + digit);

        the_html  = "<table border=\"0\" width=\"400\" cellpadding=\"0\" cellspacing=\"2\">";
        the_html += "<tr>";
        the_html += "  <td align=\"left\" width=\"122\" class=\"myfont1\"><font color=\"#cd0000\">Dive Date " + digit + ":</font> </td>";
        the_html += "  <td align=\"left\" class=\"myfont1\"><input type=\"text\" id=\"" + id;
        the_html += "    \" value=\"mm/dd/yyyy\" maxlength=\"10\" size=\"10\" />&nbsp;";
        the_html += "    <img src=\"images/icon_calendar.gif\" onclick=\"displayMiniCalendar(\'" + id + "\');\" ";
        the_html += "    style=\"cursor: pointer; border-width: 0px;\" height=\"13\" width=\"13\" />";
        the_html += "  </td>";
        the_html += "  <td><div class=\"miniCalendarPos\" id=\"mini_calendar\"></div>&nbsp;";
        the_html += "    <font style=\"cursor: pointer;\" class=\"small_font\" color=\"#cd0000\" ";
        the_html += "    onclick=\"removeDiveDate(\'" + id + "\')\";><b>Remove</b></font>";
        the_html += "  </td>";
        the_html += "</tr>";

        the_html += "<tr>";
        the_html += "  <td align=\left\" class=\"myfont1\"><font color=\"#cd0000\">Dive Time " + digit + ":</font> </td>";
        the_html += "  <td align=\"left\" class=\"myfont1\">";
        the_html += "  <select id=" + id_time + "\"); onchange=\"accumulateTotals();\">";
        the_html += "    <option value=\"morning\">Morning 830AM Show</option>";
        the_html += "    <option value=\"afternoon\">Afternoon 130PM Show</option>";
        the_html += "    <option value=\"night\">Night 530PM Show</option>";
        the_html += "  </select>";
        the_html += "  </td>";
        the_html += "  <td>&nbsp;</td>";
        the_html += "</tr>";
        the_html += "</table>";

    return(the_html);
}
function addDiveDate_old(id_name)
{
    var debug = "";

    if(id_name == null || id_name == "")         // This should never happen but... 
    {   
        id_name = "dive_date2";
        //alert("This should not be happending!");
    }  

    // Find first empty value.
    for(var i = 2; i <= MAX_DIVE_DATES; i++)
    {
        var key = "dive_date" + i;
        if(DIVE_DATES[key] == "") { DIVE_DATES[key] = "y"; added_flag = true; break; }
        else { added_flag = false; }
    }


    // DEBUGGING - begin
    /*
    for(var i = 2; i < 8; i++) 
    { 
        var x = "dive_date" + i; 
        debug += "DIVE_DATES[\'" + x + "\'] = " + DIVE_DATES[x] + "\n"; 
    }
    alert(debug);
    */
    // DEBUGGING - end



    if(added_flag == false) // hash is full
    {
        document.getElementById('DIVE_DATE_ACTION').innerHTML = FISH_HTML;
    }
    else  // value was added - print the dive dates
    {
        for(var i = 2; i <= MAX_DIVE_DATES; i++)
        {
            var key = "dive_date" + i;
            if(DIVE_DATES[key] == "y")
            {
                var add_html  = "<font onclick=\"addDiveDate(\'" + "dive_date" + i + "\');\" style=\"cursor: pointer;\" ";
                    add_html += "color=\"#000080\">Add Another Dive Date</font>";
                document.getElementById('DIVE_DATE_ACTION').innerHTML = add_html;

                var the_html;
                the_html  = "<table border=\"0\" width=\"400\" cellpadding=\"0\" cellspacing=\"4\">";
                the_html += "<tr>";
                the_html += "<td align=\"left\" width=\"120\" class=\"myfont1\"><font color=\"#cd0000\">Dive Date:</font> </td>";
                the_html += "<td align=\"left\" width=\"110\" class=\"myfont1\"><input type=\"text\" name=\"" + key;
                the_html += "\" value=\"mm/dd/yyyy\" maxlength=\"10\" size=\"10\" />&nbsp;";
                the_html += "<img src=\"images/icon_calendar.gif\" onclick=\"displayMiniCalendar(\'" + key + "\');\" ";
                the_html += "style=\"cursor: pointer; border-width: 0px;\" height=\"13\" width=\"13\" /></td>";
                the_html += "<td><div class=\"miniCalendarPos\" id=\"mini_calendar\"></div>&nbsp;";
                the_html += "<font style=\"cursor: pointer;\" class=\"small_font\" color=\"#cd0000\" ";
                the_html += "onclick=\"removeDiveDate(\'" + key + "\')\";>Remove</font></td>";
                the_html += "</tr>";
                the_html += "</table>";

                document.getElementById(key).innerHTML = the_html;
            }
            //else { document.getElementById(key).innerHTML = ""; } // ?????????
        }
    }
}


function removeDiveDate(id)
{
    if(id != '' && id != null)
    {
        alert("id = " + id);
        document.getElementById(id).innerHTML = "";
    }
    
}

function removeDiveDate_old(id_name)
{
    var debug = "";

    if(id_name == null || id_name == "")         // This should never happen but... 
    {   
        id_name = "dive_date2";
        alert("This should not be happending!");
    }  

    DIVE_DATES[id_name] = "";


    // DEBUGGING - begin
    /*
    for(var i = 2; i < 8; i++) 
    { 
        var x = "dive_date" + i; 
        debug += "DIVE_DATES[\'" + x + "\'] = " + DIVE_DATES[x] + "\n"; 
    }
    alert(debug);
    */
    // DEBUGGING - end

    for(var i = 2; i <= MAX_DIVE_DATES; i++)
    {
        var key = "dive_date" + i;
        if(DIVE_DATES[key] == "y")
        {
            var add_html  = "<font onclick=\"addDiveDate(\'" + "dive_date" + i + "\');\" style=\"cursor: pointer;\" ";
                add_html += "color=\"#000080\">Add Another Dive Date</font>";
            document.getElementById('DIVE_DATE_ACTION').innerHTML = add_html;

            var the_html;
            the_html  = "<table border=\"0\" width=\"400\" cellpadding=\"0\" cellspacing=\"4\">";
            the_html += "<tr>";
            the_html += "<td align=\"left\" width=\"120\" class=\"myfont1\"><font color=\"#cd0000\">Dive Date:</font> </td>";
            the_html += "<td align=\"left\" width=\"110\" class=\"myfont1\"><input type=\"text\" name=\"" + key;
            the_html += "\" value=\"mm/dd/yyyy\" maxlength=\"10\" size=\"10\" />&nbsp;";
            the_html += "<img src=\"images/icon_calendar.gif\" onclick=\"displayMiniCalendar(\'" + key + "\');\" ";
            the_html += "style=\"cursor: pointer; border-width: 0px;\" height=\"13\" width=\"13\" /></td>";
            the_html += "<td><div class=\"miniCalendarPos\" id=\"mini_calendar\"></div>&nbsp;";
            the_html += "<font style=\"cursor: pointer;\" class=\"small_font\" color=\"#cd0000\" ";
            the_html += "onclick=\"removeDiveDate(\'" + key + "\')\";>Remove</font></td>";
            the_html += "</tr>";
            the_html += "</table>";

            document.getElementById(key).innerHTML = the_html;
        }
        else { document.getElementById(key).innerHTML = ""; } // ?????????
    }
}

