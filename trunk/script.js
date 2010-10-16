//chrome.extension.sendRequest({greeting: "hello"}, function(response) {
//  console.log(response.farewell);
//});

//var debug = true;
var debug = false;

// First run code
run();
var intervalID = window.setInterval(run, 5000);
var lastInboxCount;

function run() {
  var inboxCount = getInboxCount(0);
  if(inboxCount != lastInboxCount) {
    lastInboxCount = inboxCount;
    if(inboxCount >= 0) {
      chrome.extension.sendRequest({inboxCount: inboxCount});
	  changeFavicon(inboxCount);
    }
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
  console.log(inboxCount);
  return inboxCount;
}

// Change the browser favicon
// Partially taken from: http://www.bardavid.com/test/changefavicon.html
function changeFavicon(inboxCount) {
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
    'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHLSURBVDhPxZKxaxRREMZ/b/d290jugognqNiKjaARxYBaCidn1KSUYGGEYMDGqEUQSREEBREkIGgjiIVVCsHewn/A/0E0a6VJyN25+5zvrRdjISRYODC8Yeb7vjfz3sA/mssnp5fpdi+WZQneb0/OOaIowmfZB5d3pvye5ZfQ/WEC2+PjDJfV+HrpKrWiNNZqDxYewux1eP8RnOXslj9M3XnLnT0CS8/h/h3EjZyuLQoYHaP/5Cl0xqA5DI2h6twaWy1gDCuOuFG4pWsCI02SYyfZePDYRE4ZsQ5DWeWKLaeaMMIGjlkloAdMYjhwkPr+fazfXYBzx2HYOpBbrJxqwgSsOJsChY2RJlYwvzVNtms3a3OLcOZwcMXKqRYwwoqzKYCpZdbqiUOs37xHPH7Z5iv5dHo8uGLlVBMmYMUxc1/OX/F7ny1BPWZ18RFpq0Xa7lS/MPiJ8AOe3ru39PKcxvxt2ChYmZn99QZJjf7rNzTabdKJyWrG2AT0QnLFllNNGGExTuhg5cKUb716AWu2C9oJmY5BPFgG+/CwQGFwCwyTz9zAfZ649i3q95q+qGaqBP6ykluWy8URZZJ+l+ZRNfmbvaOoWob/aj8BHJ+UjQ+So9IAAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIhSURBVDhPpZM9aBRREMd/b2/3dtm700uUEI0KNqbwO0HxRNRGJRD8CgTEr+auEgRRYiFBUqggIoJapRIlRapgo7WFYCmCpYVFkFxISHI59y63b523m9ydCBpw4M/Om5n//72Z9xb+01R5qDhFrXZOaw1RtD45pbAsi8h1P6ry4NVo89QrqDVEYH18lNS5NrPnr2OHWliVOow9hhsl+PAFlMRkl9/MnC6S2PG98HIc7o9guJYy24Yh9BVYefYcBguQy0DWT77tvuTiGqk1HMO14l1qIrAhh3PwMMGjpyJyRIge+G4C40vM5EyNqY05YomAGaCTgp7teFu3UL07Bqf7ISMnMBDfxEzO1MS1htMUCKWNtCMJwe0ibr6T5TsPiI71xtALS/y8N0KPX0J97mOmsJ+oQ1psCiBqrhz10C6qN0dJnb0g/Wn07FyMr/MWJ99mmK60jTUtp2gKKFn0bqMy+hC7u1vCEf7la1j5jbybz7NvMsO3hbZbSSXkloBjszIxSXZggPTFoaTHVEKw5XOrX/PpkryTNQsCueZVAZWSOfoOzvAw7NktE85CRx7yAmVxZqfiyQnoyibzjs2TWxEzXFs76aXylWIuCpOpxrb6pDe9ftEM6cBsKaJienERXY8wXBM9IGg11ZIhCIL3a8uZqrJ2jKc7zfp7qT7X5Ufa87xTbeV/umEYTshPNm1QXg5/HH2jawbGbzQaTfG/ivwr+Qstubf1N8TI8wAAAABJRU5ErkJggg==',	
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJJSURBVDhPpZPPS1RRFMc/9703zjA6OpaBZRm5SEkFp18olQsXxcBgmaCC/QKdFgVuKltJzMKCFhGUtGgVwZTkwoWR66D+gVZRIEGgoBSYTvPrvdu574WktDA6cN6775zv93vOPfc++E9Ty/2jsxQKZz3PA623J6cUlmWhw+H3ajl1UdfNPoNCWQS2x0cJLuywcu4yjusJa60ImftwPQ1vP4CSmFTZZKY7LbHudph6CnfGMVxLmbKuC4e7KD18BKkuiFVCVTR4/7mWnI8RrOEYruVXKYhAdYxQ4jj5ew9EpFOIEYiGAzdriZmcwRiszxELBMwAQzY07COyZze52xk4fQQqpQPjsjYxkzMYH2s4GwKubKMiJAnxG6OE4ztYvzmJPtnM145mUtNlGpsyRK00TQsJsg0JdK1scUMAUQtLq8cOkhubwO7tk/15eCvfuDZX4vUXhwM1kG4psLCqGJ63WSxJFxsCSj6a97I2cRenvl7CmujwJax4Db0tNuNHPbJJl8nOErY5IbGl9eCMHP8Zcihlp6lKJqFxP5TNnQiAI23mrSnKzC68qcSVozxU69G+C76bDpQtc4yGCA0MQFurTLgKauMQF1eSE1/MWfTM2Mx8UrTVaeb6pbJJCVctnR9ZtUrFmHaDqfr2u/rO549Z/qk4NRfj86rNYFORJydyVFcE3a1cvfXDXLcO8WAiWyyfz89fmXdiLz/aMmFpLKK1/AE+aqrHXRtqr+jecl83KxTL5RdnXtl9BbPxLTaW4N1Qq9Xzt8L/FPsFDN265aqfk18AAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJQSURBVDhPpVJLaBNRFD3zy6T5NIlxEU0LirbBH7TxgwXpRigE67eQhdWUQroSdKFEEIpkUUUXIlZdKCJFiOJCuzMbRbtwJ0VKEYqCbtpFmrroh0xn3nveNxPiB5GAFy5z5957zv094D9FqQzkJ2FZxznngBDN0SkKVFWFMM33SqX/rNg4OQFYDhE0h4dCeaaOxRND0Bkn1Mo6ULwJnBsBpmYAhXxU5TeR3Qny9e4B7j0ErhYgsaoiyzIGpHtg3x4H+nuAcBAIBbzvrzbF3BzKlRiJVd0qFhG0hmF0H0Dt+i0iOUhAPxAwPZU2+WRM5shcF0PiEcgFGhqQbId/8yasXS4CfXuBIHUglWzpkzGZ4+ZKTIOA0Rg+gwKkF/MwoxuwemkM4lAK1X0pnH5hI7mliKA2gvR8N950dEHEaMQGAYjNpFb3d2Lt/Ci0YydpPg6+uIRC2cLTzwZ2xmmKdhvTFQUX3lEHPtIGgUI/qTasjF6DnkiQWyAwmIMajeB+RsdszsGjPoaOmHfnROjnfbwdGDrs0nOEMhn4Tg14M2reGWWhHVT92ZyKsQ8+9wnkttPZ61dWFY04AgaMbBbYvYs2TPSxKBAlVShW16PbgNIRDr8ODL028alKIcLq3PAtV87kw4J5W3Wl/qTjT+7i5VcDM0saBqlqNsFxI9KKj1UN3xZWESesbKSL1NvIH1Kr1cqFKS14Z1pv2RoRrLeN2xOzmj9oCDE3bH1PxloO/w3X8DHGSrbDFq68ZcupB9xOjHOWfszXX31hVcdxyv8ENxv8AYdEwYonNwecAAAAAElFTkSuQmCC'
  );
  //var url = "http://www.bardavid.com/test/icon0.png";
  var link = document.createElement("link");
  link.type = "image/png";
  link.rel = "shortcut icon";
  link.href = faviconUrls[inboxCount];
  head.appendChild(link);
}
