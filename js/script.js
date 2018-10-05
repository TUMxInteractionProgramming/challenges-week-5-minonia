/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;



/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = channels[1];

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = '&nbsp; by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}
//  constructor for channelObject
function channelObj(name,message) {
    this.name = name;
    this.createdOn = new Date(); //now
    this.expiresIn = 1000; // mins * secs * msecs
    this.starred = false;
    this.messageCount = 0;
    this.messages = [];
    this.messages.push(message);
}



/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    // can use toggle two times to reset class
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

// sortfunctions from tabs
function sortNew(tabId) {
  $('#channels ul').empty();
  listChannels("new");
  selectTab(tabId);
}

function sortTrending(tabId) {
  $('#channels ul').empty();
  listChannels("trending");
  selectTab(tabId);
}

function sortFav(tabId) {
  $('#channels ul').empty();
  listChannels("fav");
  selectTab(tabId);
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
}


function createChannel() {
  // alert('hi');
  channelName = $('#newChannelName').val();
  message = ($('#message').val());

  if (channelName[0] ==="#" && channelName.indexOf(" ") === -1 && channelName.length > 0) {
    currentChannel = new channelObj(channelName, message);
    channels.push(new channelObj(channelName, message));
  }

  abort();
  switchChannel(currentChannel);
  message = new Message (currentChannel.messages[0]);
  $('#messages').append(createMessageElement(message));
}

// FAB action clear
function clearMes() {
  // alert("hi");
  $('#messages').empty();
  $('h1:odd').empty();
  var addChannelElements = '<input type="text" placeholder="Enter a #ChannelName" maxlength="140" id="newChannelName">' + '<button onclick = "abort()"><i class="fas fa-times"></i> Abort</button>'
  $('h1:odd').append(addChannelElements);
  var button = '<button onclick="createChannel()" class="accent" id="createChannel">Create</button>'
  $('#chat-bar button:odd').remove();
  $('#chat-bar').append(button);
}

function abort() {
  $('h1:odd').empty();
  var content =
      '<span id="channel-name">#SevenContinents</span>'+
      '<small id="channel-location">by <strong> cheeses.yard.applies</strong></small>'+
      <!-- #7 star is now font-awesome -->
      '<i class="fas fa-star" onclick="star()"></i>';
  $('h1:odd').append(content);
  // not working
  switchChannel(currentChannel);
  var button = '<button onclick="sendMessage()" class="accent"><i class="fas fa-arrow-right"></i></button>';
  $('#chat-bar button:odd').remove();
  $('#chat-bar').append(button);
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date(); //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());
    console.log("New message:", message);
    if ((message.text) === "") {

    }
    else {
    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');

    // append message to currentChannel
    currentChannel.messages.push(message);
    // count towards total messages
    currentChannel.messageCount += 1;
}
}
/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}

// compare functions
function compareNew(a, b) {
  return b.createdOn - a.createdOn;
}

function compareTrending(a, b) {
  return b.messageCount - a.messageCount;
}

function compareFavorites(a, b) {
  return b.starred - a.starred;
}


function listChannels(i) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")
    if (i == "new") {
      channels.sort(compareNew);
    } else if (i =="trending"){
      channels.sort(compareTrending);
    } else if (i == "fav") {
      channels.sort(compareFavorites);
    }
    for (i = 0; i < channels.length; i++) {
      $('#channels ul').append(createChannelElement(channels[i]));
    }
    // #8 five new channels
    // $('#channels ul').append(createChannelElement(yummy));
    // $('#channels ul').append(createChannelElement(sevencontinents));
    // $('#channels ul').append(createChannelElement(killerapp));
    // $('#channels ul').append(createChannelElement(firstpersononmars));
    // $('#channels ul').append(createChannelElement(octoberfest));
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}
