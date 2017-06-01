var service = analytics.getService('pixelate');

var tracker = service.getTracker('UA-100385646-1');

chrome.runtime.onMessage.addListener(function(request, sender) {
  var img = new Image();

  img.src = request.favicon;

  document.body.appendChild(img);

  function processImage() {
    var pixelate = img.closePixelate([
     {
       resolution: 8,
       shape: 'circle',
       size: 6,
       contrast: 60,
       brightness: -40
     }
    ]);

    request.favicon = pixelate.canvas.toDataURL('image/png');
    chrome.tabs.sendMessage(sender.tab.id, request);
  }

  if (img.complete) {
    processImage();
  } else {
    img.onload = processImage;
  }

  tracker.sendEvent('Pixelate', 'process', request.favicon);
});