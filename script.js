//chrome.extension.sendRequest({greeting: "hello"}, function(response) {
//  console.log(response.farewell);
//});

//var debug = true;
var debug = false;

// First run code
run();
var intervalID = window.setInterval(run, 2000);
var lastInboxCount;
var lastChatMessagesCount;

function run() {
  var inboxCount = getInboxCount(0);
  var chatMessages = getChatMessages();
  if(inboxCount != lastInboxCount || chatMessages != lastChatMessagesCount) {
    if(inboxCount != lastInboxCount && inboxCount > 0) {
      chrome.extension.sendRequest({type: 'email', inboxCount: inboxCount});
    }
	if(chatMessages != lastChatMessagesCount && chatMessages > 0) {
	  chrome.extension.sendRequest({type: 'chat'});
	}
	changeFavicon(inboxCount, chatMessages);
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
    'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHLSURBVDhPxZKxaxRREMZ/b/d290jugognqNiKjaARxYBaCidn1KSUYGGEYMDGqEUQSREEBREkIGgjiIVVCsHewn/A/0E0a6VJyN25+5zvrRdjISRYODC8Yeb7vjfz3sA/mssnp5fpdi+WZQneb0/OOaIowmfZB5d3pvye5ZfQ/WEC2+PjDJfV+HrpKrWiNNZqDxYewux1eP8RnOXslj9M3XnLnT0CS8/h/h3EjZyuLQoYHaP/5Cl0xqA5DI2h6twaWy1gDCuOuFG4pWsCI02SYyfZePDYRE4ZsQ5DWeWKLaeaMMIGjlkloAdMYjhwkPr+fazfXYBzx2HYOpBbrJxqwgSsOJsChY2RJlYwvzVNtms3a3OLcOZwcMXKqRYwwoqzKYCpZdbqiUOs37xHPH7Z5iv5dHo8uGLlVBMmYMUxc1/OX/F7ny1BPWZ18RFpq0Xa7lS/MPiJ8AOe3ru39PKcxvxt2ChYmZn99QZJjf7rNzTabdKJyWrG2AT0QnLFllNNGGExTuhg5cKUb716AWu2C9oJmY5BPFgG+/CwQGFwCwyTz9zAfZ649i3q95q+qGaqBP6ykluWy8URZZJ+l+ZRNfmbvaOoWob/aj8BHJ+UjQ+So9IAAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIhSURBVDhPpZM9aBRREMd/b2/3dtm700uUEI0KNqbwO0HxRNRGJRD8CgTEr+auEgRRYiFBUqggIoJapRIlRapgo7WFYCmCpYVFkFxISHI59y63b523m9ydCBpw4M/Om5n//72Z9xb+01R5qDhFrXZOaw1RtD45pbAsi8h1P6ry4NVo89QrqDVEYH18lNS5NrPnr2OHWliVOow9hhsl+PAFlMRkl9/MnC6S2PG98HIc7o9guJYy24Yh9BVYefYcBguQy0DWT77tvuTiGqk1HMO14l1qIrAhh3PwMMGjpyJyRIge+G4C40vM5EyNqY05YomAGaCTgp7teFu3UL07Bqf7ISMnMBDfxEzO1MS1htMUCKWNtCMJwe0ibr6T5TsPiI71xtALS/y8N0KPX0J97mOmsJ+oQ1psCiBqrhz10C6qN0dJnb0g/Wn07FyMr/MWJ99mmK60jTUtp2gKKFn0bqMy+hC7u1vCEf7la1j5jbybz7NvMsO3hbZbSSXkloBjszIxSXZggPTFoaTHVEKw5XOrX/PpkryTNQsCueZVAZWSOfoOzvAw7NktE85CRx7yAmVxZqfiyQnoyibzjs2TWxEzXFs76aXylWIuCpOpxrb6pDe9ftEM6cBsKaJienERXY8wXBM9IGg11ZIhCIL3a8uZqrJ2jKc7zfp7qT7X5Ufa87xTbeV/umEYTshPNm1QXg5/HH2jawbGbzQaTfG/ivwr+Qstubf1N8TI8wAAAABJRU5ErkJggg==',	
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJJSURBVDhPpZPPS1RRFMc/9703zjA6OpaBZRm5SEkFp18olQsXxcBgmaCC/QKdFgVuKltJzMKCFhGUtGgVwZTkwoWR66D+gVZRIEGgoBSYTvPrvdu574WktDA6cN6775zv93vOPfc++E9Ty/2jsxQKZz3PA623J6cUlmWhw+H3ajl1UdfNPoNCWQS2x0cJLuywcu4yjusJa60ImftwPQ1vP4CSmFTZZKY7LbHudph6CnfGMVxLmbKuC4e7KD18BKkuiFVCVTR4/7mWnI8RrOEYruVXKYhAdYxQ4jj5ew9EpFOIEYiGAzdriZmcwRiszxELBMwAQzY07COyZze52xk4fQQqpQPjsjYxkzMYH2s4GwKubKMiJAnxG6OE4ztYvzmJPtnM145mUtNlGpsyRK00TQsJsg0JdK1scUMAUQtLq8cOkhubwO7tk/15eCvfuDZX4vUXhwM1kG4psLCqGJ63WSxJFxsCSj6a97I2cRenvl7CmujwJax4Db0tNuNHPbJJl8nOErY5IbGl9eCMHP8Zcihlp6lKJqFxP5TNnQiAI23mrSnKzC68qcSVozxU69G+C76bDpQtc4yGCA0MQFurTLgKauMQF1eSE1/MWfTM2Mx8UrTVaeb6pbJJCVctnR9ZtUrFmHaDqfr2u/rO549Z/qk4NRfj86rNYFORJydyVFcE3a1cvfXDXLcO8WAiWyyfz89fmXdiLz/aMmFpLKK1/AE+aqrHXRtqr+jecl83KxTL5RdnXtl9BbPxLTaW4N1Qq9Xzt8L/FPsFDN265aqfk18AAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJQSURBVDhPpVJLaBNRFD3zy6T5NIlxEU0LirbBH7TxgwXpRigE67eQhdWUQroSdKFEEIpkUUUXIlZdKCJFiOJCuzMbRbtwJ0VKEYqCbtpFmrroh0xn3nveNxPiB5GAFy5z5957zv094D9FqQzkJ2FZxznngBDN0SkKVFWFMM33SqX/rNg4OQFYDhE0h4dCeaaOxRND0Bkn1Mo6ULwJnBsBpmYAhXxU5TeR3Qny9e4B7j0ErhYgsaoiyzIGpHtg3x4H+nuAcBAIBbzvrzbF3BzKlRiJVd0qFhG0hmF0H0Dt+i0iOUhAPxAwPZU2+WRM5shcF0PiEcgFGhqQbId/8yasXS4CfXuBIHUglWzpkzGZ4+ZKTIOA0Rg+gwKkF/MwoxuwemkM4lAK1X0pnH5hI7mliKA2gvR8N950dEHEaMQGAYjNpFb3d2Lt/Ci0YydpPg6+uIRC2cLTzwZ2xmmKdhvTFQUX3lEHPtIGgUI/qTasjF6DnkiQWyAwmIMajeB+RsdszsGjPoaOmHfnROjnfbwdGDrs0nOEMhn4Tg14M2reGWWhHVT92ZyKsQ8+9wnkttPZ61dWFY04AgaMbBbYvYs2TPSxKBAlVShW16PbgNIRDr8ODL028alKIcLq3PAtV87kw4J5W3Wl/qTjT+7i5VcDM0saBqlqNsFxI9KKj1UN3xZWESesbKSL1NvIH1Kr1cqFKS14Z1pv2RoRrLeN2xOzmj9oCDE3bH1PxloO/w3X8DHGSrbDFq68ZcupB9xOjHOWfszXX31hVcdxyv8ENxv8AYdEwYonNwecAAAAAElFTkSuQmCC'
  );
  var faviconChatUrls = new Array(
    'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJHSURBVDhPxZJNSFRRFMd/73s+fBHRGKWS0YelsygjS7DlFBMmZiKBRIsKpMBFNQSZYZAUCCJE0SIiSoJMrCCoXW0yxmoR6MZdmzCnFjWjjTPz5nXvvBmldNGuC3/uOeeej/859yh9fX2BYDAYCYfD7T6fz6J40un0wuTk5GgsFntesq10K2+7zsVTkaaGur0NuK676KMoClPxCWoePMOfyf0ZK95UVcW1rHElPnTbrepoJZlMLitg2zYf4+9pjkT/SiBUS+db6wlUV9OQ1UzTXAZpn5/+DKNv4MlrGBH3zHe4fANSGZy8i5pNpgrULctaBmn3m2IsZQGwg9DcSHboJtQ3guOgIBN8mmIiHkfX9QIDv99PIBDAMAwmxt9Rv26jCPaJ4H2krw9i7GqAVTYsOIW21Jofv6grr+bx/YfkcjmGBwa513OFsbExah2bikqR4MBu5i9exbdhPVRUgaFBPu8l0MU0t1RWU1O7gw9PX3G69xLdazfROZ1ga0cE9m9n7kI/1uo1cP6UCDbAFHC8H1O98ebZPKdz8Fg7TuwaWssR0V+eL00tBUhZ2ua7e2HPNvEDcl08BsrXQ51u+Z1b4NNI9Q9ghkKY0WbxoniQR+6HQOblCzKJBGU9MUg7zHadLTIwdLKPRiiLRjHbjno9aiJY8pOQsrDJN+kjfRExBQazh4+7oeG7MJcRrIqbKK+SXFohVTIqKlIWPomuMygzbSd/qtmM7TpeT4uUl7QlqdSSrKyp5A0zKXPulCRX8v8Hm7cM//X8BlTduQzdQ+FSAAAAAElFTkSuQmCC',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKNSURBVDhPhVNbSFRBGP5mzm337J7aCsw0uz4IuUQpWEZQPWxiSFiJFEa9FPRasfRQ1AZCV0zo9hCEpAiZSIVU9FIvGUfpIdAeegjsQbzlprvqcd0z08zZ9VIbNfCdOfPP/N//f/8/Q2KxmBkIBCLhcLjW5/MZyA7HcWb7+vo6otHoi3nb32by4cw5OxnZXV6yoxyc84UzhBD02z0ofvIc/lT6d1+xRykFN4xuYjc94EV1NUgkEjkBLMvCJ7sX1ZGqPwjE0lAxVnMSlCsKZDRd13Mg7dNfB4CO98Czd0C7mId+AJeuA8kUXMZB5xJJL3XDMHIg7X5dlCVoAlYAqK7AXNNdoLQCcF0QSILP/eixbaiq6mXg9/thmiY0TUNP90eUrl4vnH3CeSeca43QtpcDyyxg1vVk0eKJGZTkbcDT5hak02m03mrE44uX0dnZiS2uhcK1gmB/GaYvXIWvYA1QWARoCsBYpi7DB+o5H4jzt12veNfDZu7MzPD0lTs8eb6BM8Y8uD8n+dhIghfcF5pucD4cT3E2leLSl2ZoGDZPqag8Wgs32gDl4CGhj4GNjXv4EqfY+zKAweSSZugiCynB+xIFm/ZVwIndhJqfLwwcZv0J0NByvI6HsLU9gG8TZNFbdG5+ZAg0FXNt7QhWVUE/fCSjUck4qGI6W8ZgH1tymRxHBM1QUKIIDlODVlcHhEtEhYPAihAQEiAUlRsJbu8B8oJZtdLLJ7riJU6hMk1PjB4/ZXE3W1W5k73Sq1ruLaTKHBlSkIrBJifBUhzSV1q3CSyKWlQK8aDezC9Hpgld90hfKdffT6fG80zOxOOLLDme++u6bpto46DE6JQ7tKuVzUrIf3FnFsj/SfK/zV/3tf8VOepePwAAAABJRU5ErkJggg==',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKsSURBVDhPjZNbSFRhEMd/3zln7x4vdLMsUxM0XUEtLOkCSSaCiJaZYFQgRvTgQ7AF3VAoioIQur1FZFimWIGRb/VisVYPgT5kgQiBQlbkqq27e/b0nV0L0ooG5gxn5pv/zPy/b0Rra6vb4/GUe73eOqfT6WBegsHg3NDQUI/P53v80/cnKwaOHPNPl28tyd9Ugmmav84IIRj2D5Jz5xGuUOT3XBlTFAXT4Xgh/O03zDX1NQQCgUUFdF3njf8VVeWVCwDkr0NjsuYgiqmqWNXsdvsitfyzI2PQ8xy6n8EDaSc+w+mLMB3CiJoo4cB0rHWHw7FILb/LLmlJcIPugapSwu1XobgUDAOBBfB2mEG/H03TYh24XC7cbjc2m43BFy8pXrFWJjtl8maCF65gKyqBRB3mjNhYSs637+Qvz6DrdgeRSIS7l69w69RZent7yTN00lZLgF0bmD3RhnPVSkhbAzYVotE4gCbZzF6dQU7eel4/7Kf5zElalmbSOPKJ7L07+ViYQ1VXhPSsNtxKM1mjRXSmFWGmyLEsgDi9UdbNaFQ01GH4zqFW18r5okQnv3C0L8yTMY3MJGjOnWN0StDYrzIell38AhAqWTtKCbZeQktNlW4Td+MBlOQkqnNVjm+M0llpcH5zGFXE38rETLy0FvvaNMKdXSRUyvtOlzNLLuTVxEJNXsuahCRn+596MExBXkqUgmXw1epAqHIKtw1bfT148yXDCZCSDMlShYxJHZ9VKOtR6Xkv8C416dsjK1shmSsmdjdNKeGQbhpxVmMyX31JxzU+fRds69P5MKWyLyvEzS2zJNrj3U0e9gWEtIVS44wsELlQ/Yf6Nf3+OzW2ZClO05QbEDt1vcyYbiiwb7cA/iqhSOReRbdaO2cNvkBaihhoyFfK/pX/X7EfxqreyJQoIhcAAAAASUVORK5CYII=',
	'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK1SURBVDhPjVNtSFNhFH7u992dU4dRqylpKkPdD11hCRFEaYwsrGxEhhIk9KsgmIF9MKHoC0Qy/BH0aViZzPrV/lgWZMwSkRzBKMg/GeiMmNq2u/fe3ruZkUp04PDee877POc5557L+Hw+xWw2VzudznpZliUsWCwWi4+Pj/d5vd5nv2Mrncyb46eCs9VbK8s2V0LX9cU7DMMgFByG4/5TmBLJv7E0x7IsdEkaYoIdXXqepw7RaHRZAYvFgpHgO9RWu5cQ0FeJx3RdE1id42BUE0VxmRvx+fAE0DcIPHkJ9NLzWwQ4exmYTYBoOlg1OpuSLknSMjfiJpGOJUMBLGagtgpqRyfgqgIIAQODYCyE4WAQPM+nFJhMJiiKAkEQMDz0Fq416ylYpuAtiF1qh1BRCWRagDhJtcU6fvxE2ep8PL7bjWQyiQfX2nH7zHn4/X6UEgvsuZSgZiPmT7dBXrcWsOcBAgdoWpqAp9Msys2Ho7QE7/sDaD7XihOrCtAQnkLRwZ2IbHLgsF+FPb8NZq4Zrq8VeFFcDt1K2zII0uPVUDjHY9ehehDvBXB799H+NGjTM2gJxPHwk4DSHNpFnorRKQYnX1EFIvVFAobDhu1ViPmugrfZaFiH0tAINjsLXW4eocYkbtUQFFvTe2LL+PNV0woEHmpPLzLcboj7D6R75JhUyihUQqs/CrO4OCJSZUBjUQKpB0MBw1EORYDg8QDOMjphSm/NBrKpMzS34HsKgZ7dGmQeaBqQ8JGug4HlNUGMTh05ZtFJeqopW1jpnO4b6P8i4MMMhwZa1WPTcCUrE2MRDhOTc8ihWENIOfX0RJYY/aECLa858/VR3lSQpZNtuZp6L8TJZkHXw0fj3+1W046VcIsxQkiPmiSTrYMk6ripqbZOjbjuaInnn0mE7kzgn+D/Tf4CQSDlbY4mEPMAAAAASUVORK5CYII='
  );
  //var url = "http://www.bardavid.com/test/icon0.png";
  var link = document.createElement("link");
  link.type = "image/png";
  link.rel = "shortcut icon";
  if(chatMessages > 0) {
    link.href = faviconChatUrls[inboxCount];
  } else {
    link.href = faviconUrls[inboxCount];
  }
  head.appendChild(link);
}
