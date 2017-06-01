function findIcons() {
  var links = document.querySelectorAll("link[rel*='icon']");

  if (!links.length) {
    var link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = '/favicon.ico';
    links = [ link ];
    document.querySelector('head').appendChild(link);
  } else {
    links = [].concat.apply([], links);
  }

  links.forEach(function (link) {
    if (link.href !== link.dataset.pixelatedLast) {
      link.dataset.pixelatedId = guid();
      link.dataset.pixelatedLast = null;
      link.dataset.pixelatedOriginal = link.href;

      chrome.runtime.sendMessage({
        id: link.dataset.pixelatedId,
        favicon: link.dataset.pixelatedOriginal
      });
    }
  });
}

function replaceIcon(response) {
  var link = document.querySelector("[data-pixelated-id='" + response.id + "']");
  link.href = link.dataset.pixelatedLast = response.favicon;
  document.querySelector('head').appendChild(link);
}

chrome.extension.onMessage.addListener(replaceIcon);

setInterval(findIcons, 1000);
findIcons();

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
