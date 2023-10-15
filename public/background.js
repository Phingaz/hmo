function getRandomToken() {
  // Generate random 6 characters
  function getRandomChars() {
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomChars = "";
    for (var i = 0; i < 6; i++) {
      var randomIndex = Math.floor(Math.random() * chars.length);
      randomChars += chars.charAt(randomIndex);
    }
    return randomChars;
  }

  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  var date = String(now.getDate()).padStart(2, "0");
  var hours = String(now.getHours()).padStart(2, "0");
  var minutes = String(now.getMinutes()).padStart(2, "0");
  var seconds = String(now.getSeconds()).padStart(2, "0");

  // Generate random pool
  var randomPool = new Uint8Array(64);
  crypto.getRandomValues(randomPool);
  var hex = "";
  for (var i = 0; i < randomPool.length; ++i) {
    hex = hex + randomPool[i].toString(16);
  }

  var randomChars = getRandomChars();

  // Construct the token in the desired format
  var token = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}-${randomChars}`;
  return token;
}

chrome.storage.sync.get("userid", function (items) {
  var userid = items.userid;
  if (userid) {
    return;
  } else {
    userid = getRandomToken();
    chrome.storage.sync.set({ userid: userid });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.startsWith("chrome://")) return;
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  }
});
