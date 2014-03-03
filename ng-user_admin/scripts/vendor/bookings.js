// ------------------------------------------------------------------------- //
// bookings.js                                                               //
//                                                                           //
// Mark Brettin                                                              //
// ------------------------------------------------------------------------- //


// Setup some globals
// ------------------

var cleared_textbox = false;

var PRICE_LIST = new Array();
    PRICE_LIST["diver_discount"] = 45;
    PRICE_LIST["full_dive_gear"] = 50;
    PRICE_LIST["tank"] = 10;
    PRICE_LIST["bcd"] = 10;
    PRICE_LIST["regulator"] = 10;
    PRICE_LIST["computer"] = 10;
    PRICE_LIST["full_wetsuit"] = 15;
    PRICE_LIST["shortie_wetsuit"] = 10;
    PRICE_LIST["mask_fins_snorkel"] = 10;
    PRICE_LIST["morning_diver"] = 55;
    PRICE_LIST["afternoon_diver"] = 55;
    PRICE_LIST["night_diver"] = 60;


// Function definitions
// --------------------

function doOnLoad()
{
    // Load the Summary total with default values.
    document.getElementById('total_num_divers').innerHTML = "0";
    document.getElementById('total_num_divers_cost').innerHTML = "$0";
    document.getElementById('total_num_full_dive_gear').innerHTML = "0";
    document.getElementById('total_num_full_dive_gear_cost').innerHTML = "$0";
    document.getElementById('total_num_tanks').innerHTML = "0";
    document.getElementById('total_num_tanks_cost').innerHTML = "$0";
    document.getElementById('total_num_bcd').innerHTML = "0";
    document.getElementById('total_num_bcd_cost').innerHTML = "$0";
    document.getElementById('total_num_regulator').innerHTML = "0";
    document.getElementById('total_num_regulator_cost').innerHTML = "$0";
    document.getElementById('total_num_computer').innerHTML = "0";
    document.getElementById('total_num_computer_cost').innerHTML = "$0";
    document.getElementById('total_num_mask_fins_snorkel').innerHTML = "0";
    document.getElementById('total_num_mask_fins_snorkel_cost').innerHTML = "$0";
    document.getElementById('total_num_full_wetsuit').innerHTML = "0";
    document.getElementById('total_num_full_wetsuit_cost').innerHTML = "$0";
    document.getElementById('total_num_shortie_wetsuit').innerHTML = "0";
    document.getElementById('total_num_shortie_wetsuit_cost').innerHTML = "$0";
    document.getElementById('total_cost').innerHTML = "$0";

    accumulateTotals();
    checkFullGear();
}


function confirmationCheck()
{
    var form = document.getElementById('myform');
    if(form.cancel_policy.checked != true)
    {
        alert("You cannot continue with the reservation until the cancellation policy has been accepted.");
        return(false);
    }

    // When this function returns, the reservation form will be posted to 
    // google checkout.  Before that we want to save the data into the DB
    // and send some preliminary confirmation emails.  To do this we need 
    // to make use of AJAX.
    //
    //DB_post_data("ajax/res_post.php");


    return(true);
}

function DB_post_data(post_url)
{
    // Using AJAX, send all the data (xml formatted) to the appropriate scripts
    // so it can be saved into the DB and emails can be generated and sent.
    //
    // We had the reservation data (xml) created and base64 encoded in the php
    // script.  That way, all we need to do is pass the data and the receiving
    // php script can parse it and decode it for processing.

    var form = document.getElementById('myform');
    var xml_data = form.reservation_xml_data.value;

    if(xml_data.length > 0)  // make sure it is not empty.
    {
        $.ajax({
            type: "POST",
            url: post_url,
            data: { reservation_data: xml_data }
        }).done(function(msg) {
            //alert( "Data sent to: " + post_url + " msg = " + msg );
        });
    }

    // Remember ajax is ASYNCRONOUS!
}

function checkFullGear()
{
    var form = document.getElementById('mcform');
    //alert("form.rental_full_gear.checked = " + form.rental_full_gear.checked);
    if(form.rental_full_gear.checked == true)
    {
        form.rental_tanks.disabled             = true;
        form.rental_bcd.disabled               = true;
        form.rental_regulator.disabled         = true;
        form.rental_mask_fins_snorkel.disabled = true;
        form.rental_full_gear.value = "Y";

        form.rental_tanks.value = 2 * form.num_of_divers.value;
        form.rental_bcd.value = form.num_of_divers.value;
        form.rental_regulator.value = form.num_of_divers.value;
        form.rental_mask_fins_snorkel.value = form.num_of_divers.value;
    }
    else
    {
        form.rental_tanks.disabled             = false;
        form.rental_bcd.disabled               = false;
        form.rental_regulator.disabled         = false;
        form.rental_mask_fins_snorkel.disabled = false;
    }

    accumulateTotals();
}


function setFullGear()
{
    var form = document.getElementById('mcform');
    //alert("form.rental_full_gear.checked = " + form.rental_full_gear.checked);
    if(form.rental_full_gear.checked == true)
    {
        form.rental_tanks.disabled             = true;
        form.rental_bcd.disabled               = true;
        form.rental_regulator.disabled         = true;
        form.rental_mask_fins_snorkel.disabled = true;
        form.rental_full_gear.value = "Y";

        form.rental_tanks.value = 2 * form.num_of_divers.value;
        form.rental_bcd.value = form.num_of_divers.value;
        form.rental_regulator.value = form.num_of_divers.value;
        form.rental_mask_fins_snorkel.value = form.num_of_divers.value;
    }
    else
    {
        form.rental_tanks.disabled             = false;
        form.rental_bcd.disabled               = false;
        form.rental_regulator.disabled         = false;
        form.rental_mask_fins_snorkel.disabled = false;
        form.rental_full_gear.value = "N";
        form.rental_tanks.value = 0;
        form.rental_bcd.value = 0;
        form.rental_regulator.value = 0;
        form.rental_mask_fins_snorkel.value = 0;
    }

    accumulateTotals();
}


function clearTextBox()
{
    if(cleared_textbox == false)
    {
        cleared_textbox = true;
        var form = document.getElementById('mcform');

        var str = form.comments.value;
        if(str.search(/ask or mention here/i) != -1)  // found
        {
            form.comments.value = "";
	}
    }
}


function validNightDive() {
    // Check dive_time1 to see if it is a night dive.  If yes
    // then check the dive_date1 to make sure it is a saturday.

    var form = document.getElementById('mcform');

    if((form.dive_time1.value == "night") && (form.dive_date1.value != "mm/dd/yyyy")) {
        var mdy = form.dive_date1.value;
        var tmp = mdy.split('/');
        var d = new Date(tmp[2], (tmp[0] -1), tmp[1]);    // Date(yyyy, mm, dd)

        //alert("mm: " + tmp[0] + " dd: " + tmp[1] + " yy: " + tmp[2]);
        //alert("getDay() --> " + d.getDay());
        //alert("d.toDateString() --> " + d.toDateString());

        if(d.getDay() != 6) {
            alert("Night dives are currently on Saturdays only!");
            form.dive_date1.value = "mm/dd/yyyy";
            form.dive_time1.value = "morning";
            return(false);
        }
    }
    return(true);
}


function accumulateTotals()
{
    var form = document.getElementById('mcform');

    validNightDive();    

    var num_divers               = form.num_of_divers.value;
    var full_gear_required       = form.rental_full_gear.checked;
    var rental_tanks             = form.rental_tanks.value;
    var rental_bcd               = form.rental_bcd.value;
    var rental_regulator         = form.rental_regulator.value;
    var rental_computer          = form.rental_computer.value;  
    var rental_full_wetsuit      = form.rental_full_wetsuit.value;
    var rental_shortie_wetsuit   = form.rental_shortie_wetsuit.value;
    var rental_mask_fins_snorkel = form.rental_mask_fins_snorkel.value;

    var summary_total = 0;

    //alert("full_gear_required = " + full_gear_required);

    if(full_gear_required == true)
    {
        // Add in computer, full and shortie wetsuits
        if(form.dive_time1.value == "morning")        { summary_total = num_divers * PRICE_LIST["morning_diver"]; }
        else if(form.dive_time1.value == "afternoon") { summary_total = num_divers * PRICE_LIST["afternoon_diver"]; }
        else if(form.dive_time1.value == "night")     { summary_total = num_divers * PRICE_LIST["night_diver"]; }
        else                                          { summary_total = num_divers * PRICE_LIST["morning_diver"]; }
        summary_total += num_divers * PRICE_LIST["full_dive_gear"];
        summary_total += rental_computer * PRICE_LIST["computer"];
        summary_total += rental_full_wetsuit * PRICE_LIST["full_wetsuit"];
        summary_total += rental_shortie_wetsuit * PRICE_LIST["shortie_wetsuit"];

        document.getElementById('total_num_divers').innerHTML = num_divers;
        document.getElementById('total_num_full_dive_gear').innerHTML = num_divers;
        document.getElementById('total_num_tanks').innerHTML = num_divers * 2;
        document.getElementById('total_num_bcd').innerHTML = num_divers;
        document.getElementById('total_num_regulator').innerHTML = num_divers;
        document.getElementById('total_num_computer').innerHTML = rental_computer;
        document.getElementById('total_num_mask_fins_snorkel').innerHTML = num_divers;
        document.getElementById('total_num_full_wetsuit').innerHTML = rental_full_wetsuit;
        document.getElementById('total_num_shortie_wetsuit').innerHTML = rental_shortie_wetsuit;

        if(form.dive_time1.value == "morning")
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["morning_diver"]); }
        else if(form.dive_time1.value == "afternoon")
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["afternoon_diver"]); }
        else if(form.dive_time1.value == "night")
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["night_diver"]); }
        else                                        
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["morning_diver"]); }
        document.getElementById('total_num_full_dive_gear_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["full_dive_gear"]);
        document.getElementById('total_num_tanks_cost').innerHTML = "&#36;0";
        document.getElementById('total_num_bcd_cost').innerHTML = "&#36;0";
        document.getElementById('total_num_regulator_cost').innerHTML = "&#36;0";
        document.getElementById('total_num_computer_cost').innerHTML = "&#36;" + (rental_computer * PRICE_LIST["computer"]);
        document.getElementById('total_num_mask_fins_snorkel_cost').innerHTML = "&#36;0";
        document.getElementById('total_num_full_wetsuit_cost').innerHTML = "&#36;" + (rental_full_wetsuit * PRICE_LIST["full_wetsuit"]);
        document.getElementById('total_num_shortie_wetsuit_cost').innerHTML = "&#36;" + (rental_shortie_wetsuit * PRICE_LIST["shortie_wetsuit"]);
    }
    else
    {
        // Add everything
        if(form.dive_time1.value == "morning")        { summary_total = num_divers * PRICE_LIST["morning_diver"]; }
        else if(form.dive_time1.value == "afternoon") { summary_total = num_divers * PRICE_LIST["afternoon_diver"]; }
        else if(form.dive_time1.value == "night")     { summary_total = num_divers * PRICE_LIST["night_diver"]; }
        else                                          { summary_total = num_divers * PRICE_LIST["morning_diver"]; }
        summary_total += 0 * PRICE_LIST["full_dive_gear"];
        summary_total += rental_tanks * PRICE_LIST["tank"];
        summary_total += rental_bcd * PRICE_LIST["bcd"];
        summary_total += rental_regulator * PRICE_LIST["regulator"];
        summary_total += rental_mask_fins_snorkel * PRICE_LIST["mask_fins_snorkel"];
        summary_total += rental_computer * PRICE_LIST["computer"];
        summary_total += rental_full_wetsuit * PRICE_LIST["full_wetsuit"];
        summary_total += rental_shortie_wetsuit * PRICE_LIST["shortie_wetsuit"];

        document.getElementById('total_num_divers').innerHTML = num_divers;
        document.getElementById('total_num_full_dive_gear').innerHTML = "0";
        document.getElementById('total_num_tanks').innerHTML = rental_tanks;
        document.getElementById('total_num_bcd').innerHTML = rental_bcd;
        document.getElementById('total_num_regulator').innerHTML = rental_regulator;
        document.getElementById('total_num_computer').innerHTML = rental_computer;
        document.getElementById('total_num_mask_fins_snorkel').innerHTML = rental_mask_fins_snorkel;
        document.getElementById('total_num_full_wetsuit').innerHTML = rental_full_wetsuit;
        document.getElementById('total_num_shortie_wetsuit').innerHTML = rental_shortie_wetsuit;

        if(form.dive_time1.value == "morning")
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["morning_diver"]); }
        else if(form.dive_time1.value == "afternoon")
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["afternoon_diver"]); }
        else if(form.dive_time1.value == "night")
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["night_diver"]); }
        else                                       
            { document.getElementById('total_num_divers_cost').innerHTML = "&#36;" + (num_divers * PRICE_LIST["morning_diver"]); }

        document.getElementById('total_num_full_dive_gear_cost').innerHTML = "&#36;" + (0 * PRICE_LIST["full_dive_gear"]);
        document.getElementById('total_num_tanks_cost').innerHTML = "&#36;" + (rental_tanks * PRICE_LIST["tank"]);
        document.getElementById('total_num_bcd_cost').innerHTML = "&#36;" + (rental_bcd * PRICE_LIST["bcd"]);
        document.getElementById('total_num_regulator_cost').innerHTML = "&#36;" + (rental_regulator * PRICE_LIST["regulator"]);
        document.getElementById('total_num_computer_cost').innerHTML = "&#36;" + (rental_computer * PRICE_LIST["computer"]);
        document.getElementById('total_num_mask_fins_snorkel_cost').innerHTML = "&#36;" + (rental_mask_fins_snorkel * PRICE_LIST["mask_fins_snorkel"]);
        document.getElementById('total_num_full_wetsuit_cost').innerHTML = "&#36;" + (rental_full_wetsuit * PRICE_LIST["full_wetsuit"]);
        document.getElementById('total_num_shortie_wetsuit_cost').innerHTML = "&#36;" + (rental_shortie_wetsuit * PRICE_LIST["shortie_wetsuit"]);
    }

    document.getElementById('total_cost').innerHTML = "&#36;" + summary_total;
    form.booking_total.value = summary_total;
}


function validateBooking(form)
{
    var dive_date = form.dive_date1.value;

    if(dive_date.match(/\d\d\/\d\d\/\d\d\d\d/) == null)
    {
        alert("Dive Date must be in format mm/dd/yyyy");
        form.dive_date1.value  = "";
        form.dive_date1.focus();
        return(false);
    }

    if(form.diver_email.value == "")
    {
        alert("You must enter your email address!");
        form.diver_email.focus();
        return(false);
    }
    else
    {
        var the_email = form.diver_email.value;
        if(the_email.search("@") == -1)
        {
            alert("Your email address needs a \"@\" character.");
            form.diver_email.focus();
            return(false);
        }  
        if(the_email.search("\\.") == -1)
        {
            alert("Your email address needs a \".\" character.");
            form.diver_email.focus();
            return(false);
        }   
    }

    return(true);
}
