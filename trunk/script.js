//chrome.extension.sendRequest({greeting: "hello"}, function(response) {
//  console.log(response.farewell);
//});

//var debug = true;
var debug = false;

// First run code
var intervalID = window.setInterval(run, 2000);
var lastInboxCount;
var lastChatMessagesCount;
var chatNotification;
var desktopNotification;
var checkArea;

function run() {
  chrome.extension.sendRequest({type: "getvars"}, function(response) {
    chatNotification = response.chatNotification == "true" || !response.chatNotification;
	desktopNotification = response.desktopNotification == "true" || !response.desktopNotification;
	checkArea = response.checkArea ? response.checkArea : "0";
  });
  var inboxCount;
  switch (checkArea) {
    case "0":
      inboxCount = getInboxCount(0);
	  break;
	case "1":
	  inboxCount = getInboxCount(1);
	  break;
  }
  var chatMessages = getChatMessages();
  if(inboxCount != lastInboxCount || (chatNotification && chatMessages != lastChatMessagesCount) ) {
    if(inboxCount != lastInboxCount && inboxCount > 0 && desktopNotification) {
      chrome.extension.sendRequest({type: 'email', inboxCount: inboxCount});
    }
	if(chatNotification) {
	  if(chatMessages != lastChatMessagesCount && chatMessages > 0 && desktopNotification) {
	    chrome.extension.sendRequest({type: 'chat'});
	  }
	  changeFavicon(inboxCount, chatMessages);
	} else {
	  changeFavicon(inboxCount, 0);
	}
	lastInboxCount = inboxCount;
	lastChatMessagesCount = chatMessages;
  }
}


// inbox: 0 -> Priority Inbox
//        1 -> Inbox
// retun: NaN if is not able to parse the string representing the number of unread mails.
function getInboxCount(inbox) {
  var theInboxText = '';
  if (debug) {
    theInboxText = "Priority Inbox (2)";
  }
  else {
    var frame = top.document.getElementById('canvas_frame');
    if (frame) {
      var theInboxSpan = frame.contentDocument.getElementsByClassName('n0')[inbox];
      if(theInboxSpan) theInboxText = theInboxSpan.textContent;
    }
  }
  var inboxCountRegExp = new RegExp(".+[(](.+)[)]");
  var inboxCount = inboxCountRegExp.test(theInboxText)? parseInt(inboxCountRegExp.exec(theInboxText)[1], 10) : 0;
  return inboxCount;
}


function getChatMessages() {
  var chatMessagesCount = 0;
  if (debug) {
    chatMessagesCount = 1;
  }
  else {
    var frame = top.document.getElementById('canvas_frame');
    if (frame) {
      chatMessagesCount = frame.contentDocument.getElementsByClassName('vE').length;
	}
  }
  return chatMessagesCount;
}

// Change the browser favicon
// Partially taken from: http://www.bardavid.com/test/changefavicon.html
function changeFavicon(inboxCount, chatMessages) {
  var head = document.getElementsByTagName("head")[0];
  var links = head.getElementsByTagName("link");
  // Remove previous favicon
  for (var i = 0; i < links.length; i++) {
	if (links[i].rel=="shortcut icon") {
	  head.removeChild(links[i]);
	  break;
	}
  }
  // Add new favicon
  var faviconUrls = new Array(
    'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAJDSURBVDhPxVI7jxJRFL6Xh4i8BpYImBBIiFsYC6DBYpONVqJ/ABsfsdKaxFBQ2BkCgZJY2EvCUgAaE2OxocDGEhpELAhBIAMsj+E143fGsPIP9iQ3c+bec777fd89jF118FQqdRoIBJ50u129oiicCBmNRq7RaNhut7uG0CNUnjqdjuFfzZ1OJzObzT95NpsdoNDpdruZLMtss9kwauacMwCqOa190N5sNmOj0Yj5fD5Jgw0dodHBdru9sNlsLyVJiiyXywh9F4tFBA3qwt7D1Wr1m2otFgtDLePpdFrEDRtBEAYmk+kOWMyQP41Go6VDf0ulUgBgn8D2GGAdXHrLbrfLKjfcPO/3+ydA/gKd5vl8XqxUKm/2AIVC4QTN33HBMVi0QP8BvNjQ+aW4RCIhxmKxR+v1+qvBYOAAe1er1T6Xy+UPAP12hBgMBuedTudeMpn8tQcH+/8GFYvFKMw7BRsGrYw0a7XaF9CqbzabDJ7chAQjNeOSf2bncjmRikOh0LPpdHpmtVq1jUYjMx6PCzDqPmrbw+Fw5/f73+Kl7k4mk1a73X4cDAZ/4FyrAoDiDZfLpcF761qt1vt4PP4KjfKhidVq1Q0fzlFzG0b/ARPB4XDIPJPJiEASIJGJonhWr9dfg5FCzTDKiobrKFYghXu9Xlc4HP4IKUdEHwMn8Xw+PwGi1ePxqLNAA0RBXzRe7tGQUVANrV6vxyBrzfFcSWh/DtQLGllaKN7uRxcgOzQoNMZICUUGG4ZlxCzUDmVeTf4XYq457xb7BSwAAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKJSURBVDhPxVJNTBNBFH4zs7NtsSktP5VVw49G/kJUlMQLylXFiMTE6EXkgEbQxAQiXEw8oRw8UBNRFGKi0RMSLqiJ8QBopGeOcKEGKS2W0pYt+zPj240kHLzzssnM2/ne970/gL02EuvsbFEbT103Fhc5AUmchIjfTyhTQNq2SjycA1eB4gvxegEUvFM8NA1oYeES+dVzLyEts0StrAQpbJDbBiIdNMHPocSTMvQdZvSFAJFOg7XyGzx1tXkSu9Od4poWBAUVDSPDikL3t+Pxhf+1hkkZQraXQs9XgGmAp74OCW7dTgFjphIOJ2ggUI8KWSVceqOko2NyN0k8Ejmyuro6zSRUQzYXKz1ctZ+HSwVWAyAtK2esxZuJFF+oyv1iIz2RHH3dv0OwMjzcLLb0+eODg9UNjweh4dnwElNV03l3CRyrGBlJPe/ruyD17a/E5yMS5JONqalPyVdj41xRvqmaVvyitXVGJWR6d2bUqX3HeiKR88Boi7m8DCKvg8jmzhGFdrKiYr41H4WL1TXhQ34/dhn76fOhPMPpODOx7GDizdtLAsiUopVxK735NDf783RmbnZAj0avpj68v0IKAwuempras40n29yydd3VdeVpKFggN9YnqMfLtma+j46Pjjx4BCDwKbqT3Vp7+w+Z3pzBQR49Vl5+wjZNjtLCHSMLhYJKWRlYieTH/OTn7gzVpcuuKAFcHq/MmZLs46QtFrtbQGnXn2yOXmtqgq72y3my0j+QlrYIqFWVmBfG/Vsid/VMC7CZTsWoZcOZoSEXg1MDsAW86+01yPrY2EMzuX4Tm5ahjOO6ehwQIjAQtxjBNgiMwmYTy3LKEgT/o+9jBw/M7Z7I3tz/AjUUCON0RrGSAAAAAElFTkSuQmCC',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKISURBVDhPxZNLSFRhFMfP97ozYzovxqtTqDMMRg5uShftLAjKVroRgmgSylAzWqlRRkGLDNrYiwwLaiEV6KaFbtNNhUjQ0gLfjxnRaRxn5j6+r3PVwkV7v3vhu+fe//mdx3cuwEEvMt/a2qAdr7tgzMwIAoo4CZHiYkIZB2XbGnEJAUIDil+I2w3A8ZniFg4D9fl+koXOrqSyzJAWiYCSNqiCgUpHTfB2kLhThrZDRltKkOk0WEvL4Ko5lifz7R0bIhz2A8eIhpFhwcDNwurqj/+1hikVQNpLmctXgWmAK16DgLZrG8CYyXU9Sb3eOEbY4nrppVAiMboPcuheU1N1czz+nik4yrLbs8FoJCz0UrkDUEptKs5OeGKxYRDiLOaqqKfoVqjtSr8DKfF4+jO5XPc+4MfUs+fnqd/H/gEqXw1G7wHQ9oePxmkwcMYRizJ9zFpLLc+urlxczOfE0vT0557x8Qdpy9JPxmJvh3t6DerU/nd1Dgw0AqMN5twcyHwO5Fb2HOG0NRqLidrUOrgA9CLGsKNghPx+RTkDsnC9a0Nmt8HTcCohf2+O8GCAZb98e2ytJD+wkO80qn8VFhftzcqq+3VPn9TuBdstIRhkOwDQtCKtsoISl5vnp78PDg2+aMdy5L6auz2a1vm1726Ba6JaULZWIoRflJVhE/EYWSDg5+XlYCVTI/nRsY4MzSnHmXPuxeFxN05NdcwWConqiop3zfX1V5VpUjAtuNHSkidLPb1pZUuvFo0AKPTbG6Kd0UORwuvNxAS8npzcTQg1yrIAbAmf7tw2yPrQUJ+ZWr+MTctQJnBcsVVKoQJhOMUotkGiFzabWJZTliT4Hm0PO3J4j3qQf+QfmOIJ9ScIoFkAAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKSSURBVDhPxVNdSBRRFD73Z2Z3zPZnWKfdQt1l2cjNgtKH3jQI+oFCH4NoE8pQM3pKgwKDHjIIwbLIsCAKqUBf9VV9KQlJ6s0U/7Vd29121/27e293VgsfevfOMHfOne9855zvnAHY7YUWm5rq1GM1F3MzMwoCgcyEUGkpwoSCKBRUZFEUUFTA8guyWgGofMdy83gA2+0/0FJbe1iwvEv1ekHwAohsTiJNNJK3SSl3TKRtMkubc+DxOLCVVbBUHcqgxZbWqOLxOIDKiLlcgujOW9n19W//k4YI4ZRsL3g6Uwn5HFiCVZKg+XoUCMlTwwhjmy0oIySpUXbZFQoN7yDZ09XQEGgMBt8TAQdJanNe93k9ilHGiwRCiJig5Ljm9w+CopyWuQqsldxxNV/tNkn2alp3Ip2+vYPwY6Tv2TnssJN/BBUv+31dALjl4aNRrDtPmWBlnzHCfkZW59fXLi1n0srK1NRYx+jogzhjxgm//81gR2cOm7X/XW29vWeB4Lr8wgLwTBp4MnUGUdzk8/uVw+ENiCUSRpIxXeI1l8MhMCWAlm60R3lqE7S6+hD/HRuiupOkPk0+ZmvhD8RlPyn1n80uLxdiFZX3a54+qd4OtlWCrpMiAahqiVpRjpHFSjNTX/sH+p+3yHL4zk587+tz81/RMaoqgS+zc5s3373VPvf0ZIttJE6ng7rdwMKRoczwSGsCp4XpTCm1yeGxhqang5PJZDBQXu5urK29pkmt0lxA+4XzGbTS0RkXBW5TfV4AIf22h6g4enkGQl6vx8fh1cTEVkISUx8IwN0jR8FaXZ1DGwMD9/KRjStStAQmihxXiwli8iHboIBgrABcekmxEWNmWRzJc2lr5MD+bdbd/CP/AKX+DrScZjwSAAAAAElFTkSuQmCC',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKvSURBVDhPxZNfSFNRHMd/59w/23LMLXVsi3ISiq71kMNEEISCMKOgnizJPwWFmtCDYATRHzD0wQf3kCQb9O8losQHI8F6iIhqiWmRLxsutcWael2bd3f3z7mdWwk+9O6Pczn33PM9n9855/u7ANsdaKmjo4E/EDgtR6McAh0ZG0JWK8IMC7qm8cjEccDxgOkMMpsBWPqOaed2Ay4sjKHl7p6UrirFvNcLOtFAz8tUaagRbQaS9pihY4NMx4QASadBTfwAU1WlhJY6uwTO7bYDSzPKcobZ6bicTya//O9qGF13UNpdkpNKQZHB5KuigAsXBWAYhXU6U9hm89EMWdZZ0lrc1ja2FZIMBveSDfE50rQKLZ2Osx6Ph3OWEHoaAF1VN+SfyXqkk0nMc1aynn66Mhrq2wQkhofriZh7zzrsFVomE1WEtUMMzyvG/B+AEaUjI8Kd3t4mPZefQhYL2pDzA8fr6qZqfL5HE3Nzr3i3u0hZWn599sH9895QyLe5Dhtn34zuYPAoMLhBWVwEVRQBE3LYU1DQ8kkQuMjkJBBRdGYVJUD1TTQJTc9QdwxPVM2euvfwBAE0zrpdnJr+NYQiM7W3/f7rjQ7Hze+RSHhsYWEtbrNVNh6sHaSAoq+xGBayWUDLl3oE4Pkd/J7dGJnMrDQzOxoeHem8AUCocB99DEeeBLzeoel4/N3Wix3oOPfXRsbhsLMuF6iplWfS2IuuDM7phpBlWRstHnP77Ocj32Sp5sOZ1tAEC48/RmNFg83NgK1WCSX6rqR1jdj4Mi+1g677V0TrORGO9ffTTzrUlJfD1ZOnwGkxw/j0NLyNxuBWdTWY/X4ZrYbD15SV1XYi5TKY4Wi5mgyQmlcUeDk/D0RVNJfdrgfKKwCpKkkIAlmj1bq/zGthdnnebPe/CPAb9ikeO1MUDtwAAAAASUVORK5CYII='
  );
  var faviconChatUrls = new Array(
    'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKBSURBVDhPxVNLTxNRFD7nzp1HoZ1OmUopBYsYjMSGBN1oQjS4dcXSHSS6QGWtGxNdsHSBCx8EQuJOFhpXujCaIAuRhYGFigIq5dlSSKlDy7yuZxox4h9gJmfu3HvmO6/vG4DDvjDb13dB6Txz2Z6flxEEBgVhOIxM4iA8T0FVlkFWgJEHNQ2A0zujJZkEFo0u4PL1gXzeTMXnunoAj9T/bSiysQSNn6Yg8WsDKBqhg8iUwvfBLxbBXV0Dtf1khRcF8qWeKxA3zQPTQNOAYjI+a44/uLrvkISIUbTHwvPTUl0MJLMO2AzE4HjaBF2FAxah/c89paN5cHCG7IOSSBQwot9noVAaJfZDbm21JV0HproV8DwHwgT433TFs4Lsq0NDXf5ueYrHjBNeqTTvbG9dlBTFCXyswy3Al4n3YISoAppR9I8paIO98HkrNzzySOb8jZJMmk52eWLn69zZlpGR7/ttcU1ToenFk9xLo279qCYy1tomE7u7YOc34JwBzZIs9WLEBOvdJKCq1HNESkXzDNFCw+VInDQyX339Lat3FmbxdDoF1vT0PXc9Py7i0e4ywOLeyoqnnsrcVdPpjGSabxfC4UuiXK4GweUbA9vEcw1rSjG5poZXPs4Mjw4/7L8D4P9LS25srAGKOxOoKG1EZU64riEnEj5m+69tS7GYwRsawM1vPqs8f3WtxMoiAHPOdRKPJixHYK2MtW3tidru80+FZZmBmlg4XMHVm7eKxKuuHGsBEIQjsVQtkJ7jgqC7qiLfq/qDT4DEZC8ugpbJ2FgYHb3tbBZ6/Uq5xCSZ5Ep8CuHSA4BUTKV64BOMc0DXDdrykc5pH5JSjZOH/S8C/AbZzu/l5CI4MgAAAABJRU5ErkJggg==',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKOSURBVDhPxVPNTxNREJ+3+3a35WPb7VagIFQxikZSBbmYoMYzJtqb3iCxB1FPJOrFRA+QYOIBExEb8WA8cfDjoh6MCSsahRMcRCOQSOWzH1rLtqW7+56zRIzEP4DdTHbfm/nN/N7M7wFs90MSXV0n5JYj50ozMxIBTlxCpKKCCCIF7jgyUSQJJBkE9BCPB4Div4CfUAgEn2+WfL94OZnU64Jf2qNAdlT9PVDlyjzUfvoI1WsrgNkQ7WbGEowBy2bBXlwC5cD+Is1yQuej5yGo61u6QXQ/ZEPBKX1kMLbpEDnXMNt97rCwGNBA1AMgTIIGe8I6qApssUpcf1uXI/W9vZNo43J1dToJcCfDWPinZSWkxsaSqKpAFbsIjmNBhSL9Nw9Vdkx3c3FgoJ3lC88O9fVt0pxN3R0MoEsUInYaPhsfwO9FBtgj3x+TSQlKs9OZ1fiDIYnSN3IopA91dBgyIS/+rUQ9HgV2Pn+0+tIfWG7w8GZzKSXwfB5KyRU46od6URI7SaUO5tsxOLWvqeqWYWTmcrky4sWK2FxKcCa1AlNef02oLekp0hquA3Ni4ra9nBzhQd/JAsDc+sKCoxxsvqmEw83HW1qb5ozRUV4ogJuEunQkTfPGzOlyKeAjeeNd/GH83pUbAAxd45t0V6PR9zz7y8BB7o00NBx2LEtCOTCSuND9Q9Q0P62pATuZelJ8+qo7JxS4C6SUqigeDzctTsolcjqRuFQmCLHMmimcbWuDWPRMkSxevZbFuary7l0AHHEolg1zpWfZwPHdUBFz4Fh//0YMt20Ah8Hjnp4SSQ8PX7dS6U5WLOQEUUK5ogA4xwgEooox2AGGKEqB2LZ7LEZwH9desa52bLvvIsBvmTj2mq8bPJ0AAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKbSURBVDhPxVPNS1RRFD/3433M4IwzvsmvcZxUpEQpTCmSQoI2hRtbCK3SykDNliaUUguXbQKNhKmonUEZJLZo48cmRUTDSLJEHT/GmckGU9/MvPduZ0oj6Q/wXX68e+79nd87957fAzjohyw1NFTL5RWXE3NzEgFBUgWRtDRCGQdhmjJRJAkkGSjuEFUF4Din+MrJAZqe/pUEW1rDYc3rmT1TC+RQ5t8DOUKLkPvpA2T9DAGqYXZKGT9hWWDFYmCsrIJSclTnMUH4Yu118GjavtsgmgtiOZ5pra+ncW+DCeFGtcfCtPwsww1MywA6BW4o8mvgVGAfHBgvxOVjvq6uKcRMYGYmEQZ4+N2y/JuGsSAVFiaY0wlcMXQwzSSkKdJ//XDK5lZq0WGzdd7r729D7HHGIt09FzFgrOt4SftHRVOPlPpB5gDqLoSZgODEZKj7/NnSSxUVN2qqqli1wzE8Mj/fGLes4PDs57qak6dMrqoK5L15vj7oyljLV0XZ1mqEiu1tSIRDcNoFPiax+oKiInAPDUEUINPOGIsZRsLjcgnKGXCCPcmllvL+y5KzPDpNTvi9sDU+/sBYC/cJT/q5HYBv8eVl80e+/37DwEAZlj2IePns6jWd2uyMBG+2bmCf7TTPSyW7neuTU72B3kdN9wCsfy6lzSbLLWMdnXEuS8USZesOSXJJWVkWWWpq3mBut4tnZ4MRjrzSX79r3qQ7IpXMOXeiedQLExPNC/H4lWKf70VtZWWjSCYpJA24VVenk5Xb7THsq1MuOAwgMA/N8hsp6yFJ4Hg6MgJPRkf/FIQcYRgApgVv795JkGgg0JGMROstfWeTMgntigYQAhkohi5GsgkWZnEOxDBSx7IIrmNsY97cXdWD/CN/AbB0+yG7g7L5AAAAAElFTkSuQmCC',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKiSURBVDhPxVPNT5MxGH/6tu/HFja2vRMHY0wgiwITgxCNRIMmngya4MHEk6BiAopH5aAGDxwNickwkkyN0cRgonjSgwcdXIQQwsyIRIQA42NugMsG++B9WztFI/EPoM2v7dP297R9nl8Bdrqg+ZaWBqmm9nx2akpEwFDuQigvDwmYANN1CcmiCKIEAl9BigJA+FjgXWEhCPn531D4akc0qjrtk0ebAO0q+PsgU2QOiiY+we5kBLg3zs555kdQCjQeB21xCeSKfWkSZ4jMNV0Gu6puiwZSLRAvtAfV/t7WPwuYMSv39pDp1I1tVsCqDYRxsEK5WwWzDNtg4vZsRqp2dXePc4T8oVA2CnB/lVJ3QtNmxbKyLDabgchaGnR9E/Jk8b98mCV9PTdpMhjudA0M3OD4s2c45us9xQ2Muw9UdH6WVWVvlRskAqBsgelZCI+ORXwnj1Wdra290lhfjxtMpsDgzExrhtJwYPLLucZDh3WiKDIUv3n6/a3FtlyiMO/6UkxgGxuQjUbgiAVcWMTNpeXlYPnwESYSiYKkptn4yQa7xcIEgoEgnpMigcrvv86ba1aC6KDbCesjI/e05Wg/s+efSAFMZxYW9B8l7rudgYCXk19wvHxy8VJaMBgxCl/rWON5NgrFTkE0Gkl6bLzP3/egrQuA/huUkM/noKtrASKJntHpmY3rz58Zhnt6Mmi+rX0NW60W4nCAFo29Sr9+154QUixHJoSYuXiUC8Fg5UgyWelxuRxNdXWtBgAhRRl0nDmdRos3O+M8r2apdA8A4zwull/ISW9TA8br48FBeDQ09PtCfM9xjwdu7a8GxevNohW///ZmbKWZplMJAYtcrlwAjGm8AeAqZpqmA+UsQgBpWu5ZFPF5bhuws2jL607+yJ/MxvwZPKBSLAAAAABJRU5ErkJggg==',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAD2EAAA9hAag/p2kAAAKvSURBVDhPxVPdS5NRGH/OeT/2br3Od77LObe1aSlqU8oldSEIXnQTXdhVBoX2caHlRXSRBEEEg7rwwi6KRImkGxMKL6y8SEglVBKbhVZu4MeYmc61ptvr+9kZZGT/gAd+nHOe5zyfv+cA7PVCy83NdezRQKMcDjMIDJRNCPE8whQNhqaxyMQwwLCAiQZxHABNzphsTifg3NwIil5tW1sTXfavtQ2A9uf/LShndQkKZyfAsbkKxBuxznomIXQd9GQS1NgKmMrLJDppIHqp4TLYRXFXN5AoQNJpnxGfP7yyo6AMw0a8PTY03Uvl2YAS8wCHwAYHvSJYTbALOeS+uM1WeYLBEMEk63DEUY71ATabvYjCC0xxsUxZrYBNqgSapgBPDP6HldW2stFjnZ21ejozQduEUi2VCiuJjXqKZZWsDlepcfgyMg6CmWRAepT7ByyS4VXfs1/HysufDM7MDLNOp6gsR0fO9z695Ovurtgpi+Y4E7gHen+8FvK+H+AM/9bKOjbSaUitRGF1uN/p4vnGj4kEeIaGwO9w5G8qSoAYH0JmEpE0l7px/ET7PkWmRy1u48jcmFDFA7JPjna4v81er/O4oowsj0yHQpFlXfd5Kyo8CKH6d/Pzi6f9lWWMxYJQ9FpbgvBswW4XJgJamg519XQ9arkDoJNIhwk+E/QHfL6OqYWF8X+putd8UULLLa0JymYT6IICUNfWX0gv37SmcMbIPqRp2kqGh2sKfTq5KEs1k+cudA/S0PchHBHvnz0LmOclFLvZniS8WtkiH4BB7MiwZPEzk4ZTwSARGVBTUgK3Gs5AvpmDgakpeB+OwN3qauD8fhnFe3puK+vxJl3KpDDFkHElfBqGuq0o8HZuDnRV0QoEwQiUlAJSVT2WSOgb2zJUFvnMlKtwbK//IsBvzaD+3DIvc4IAAAAASUVORK5CYII='
  );
  
  var link = document.createElement("link");
  link.type = "image/png";
  link.rel = "shortcut icon";
  if(chatMessages > 0) {
    if (inboxCount <= 3) {
      link.href = faviconChatUrls[inboxCount];
	} else {
	  link.href = faviconChatUrls[4];
	}
  } else {
    if (inboxCount <= 3) {
      link.href = faviconUrls[inboxCount];
	}
	else {
	  link.href = faviconUrls[4];
	}
  }
  head.appendChild(link);
}
