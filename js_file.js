$( document ).ready(function() {

var _menu_open = false;
var error_count = 0;
var _detachThreshold = 0;
var _menu_attached = false;
var bottomReachedOnce = false;
var hubspot_form_created = false;
var hubspot_form_submitted = false;
var ua = navigator.userAgent;
ua = ua.toString();
$('body').attr('data-ua', ua);
$('.body-wrapper').attr('data-ua', ua);

function bind()
{
_processSlider();
// fbq('track', 'ViewContent');

// MLBW Function
bindHubspotToAnalytics();
}

var _FB_LEAD_ALREADY_TRACKED = false;
function _processSlider()
{
$("#slider").slider({
  value: 5,
  min: 1,
  max: 30,
  step: 1,
  range: "min",
  animate: true,
  slide: function (event, ui)
  {
    _updateUsers(ui.value);
  }
});
$("#slider").find(".ui-slider-handle").wrap("<div class='wrapper'></div>");
$("ui-slider-handle").draggable();

$(window).bind("resize", _resizeSlider);
_resizeSlider();

$("#nb-users").bind("keyup", function ()
{
  var val = $("#nb-users").val();

  if (!isNaN(val) && parseInt(Number(val)) == val && (val + "").replace(/ /g, '') !== "")
  {
    if (val < 1) { val = 1; }
    $("#slider").slider("value", val);
    _updateUsers(val);
  }
});
}

function _resizeSlider()
{
var handle_width = $("#slider > .wrapper > .ui-slider-handle").width();
var wrapper_width = $("#slider").width() - handle_width;

$("#slider > .wrapper").css({ width: wrapper_width });

var pos_top = $(".content-pricing .title > .spacer").offset();

$(".content-pricing div.total").css({ top: pos_top + "px" });
}
function _updateUsers(nb)
{
if (nb < 30)
{
  // clearFormError();
  error_count = 0;
  $(".content-pricing div.price > .more").removeClass("show");
  $(".content-pricing div.price > .std").addClass("show");
  $(".content-pricing div.price > .more > .wrapper > .form").removeClass("in-error");
  $("#request-price-details").removeClass("in-error");
  $(".content-pricing .users-edit").removeClass('toomany');
  $(".content-pricing .equals").removeClass("toomany");
  $(".price-wrapper").removeClass("toomany");
  $(".toomanycooks").removeClass("show");

  var total_price;

  if(nb == 1) {
    total_price = 20;
  }
  else {
    user = nb - 1;

    // new pricing
    if(nb <= 5) {
      var users_price = (9.99 * user);
      total_price = (20 + users_price).toFixed(2);
    }
    else if(nb <= 10 && nb > 5) {
      var users_price = (9.99 * user);
      total_price = (18 + users_price).toFixed(2);
    }
    else if(nb <= 30 && nb > 10) {
      var users_price = (9.99 * user);
      total_price = (15 + users_price).toFixed(2);
    }
  }

  //$("#price-user").html(users_price + "&nbsp;$");
  $("#price-total").html(total_price + "&nbsp;$");
  $("#nb-users").val(nb);
}
else
{
  $("#nb-users").val(nb);
  $(".content-pricing div.price > .more").addClass("show");
  $(".content-pricing div.price > .std").removeClass("show");
  $(".content-pricing .users-edit").addClass('toomany');
  $(".price-wrapper").addClass("toomany");
  $(".toomanycooks").addClass("show");
}
}
// MLBW JSON - CHAT
function tryParseJSON(jsonString)
{
try
{
  var o = JSON.parse(jsonString);

  if (o && typeof o === "object")
  {
    return o;
  }
}
catch (e)
{
  return false;
}
return false;
}

// MLBW Bind Hubspot Chat GA
function bindHubspotToAnalytics()
{
window.addEventListener("message", function (event)
{
  // Check if the event was sent by Hubspot
  if (event.origin == "https://app.hubspot.com")
  {
    //Chat window
    if (obj = tryParseJSON(event.data))
    {
      //Close chat welcome message
      if (obj.type === "closed-welcome-message")
      {
        gtag('event', 'Chat', {
          'event_category': 'Close welcome message',
          'event_label': 'en/index'
        });
      }

      //Open close the chat window
      if (obj.type === "open-change")
      {
        if (obj.data == true)
        {
          gtag('event', 'Chat', {
            'event_category': 'Open',
            'event_label': 'en/index'
          });
        }

        if (obj.data == false)
        {
          gtag('event', 'Chat', {
            'event_category': 'Close',
            'event_label': 'en/index'
          });
        }
      }
    }
  }
});
}
$(function ()
{
bind();
});

$(function () {
   $( "#nb-users" ).change(function() {
   var max = parseInt($(this).attr('max'));
   var min = parseInt($(this).attr('min'));
   if ($(this).val() > max)
   {
      $(this).val(max);
   }
   else if ($(this).val() < min)
   {
      $(this).val(min);
   }
 });
});

});
