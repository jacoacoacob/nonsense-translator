function loadSettings() {
  return JSON.parse(localStorage.getItem("arpSettings")) || {};
}

function saveSettings(options) {
  localStorage.setItem("arpSettings", JSON.stringify({
    ...loadSettings(),
    ...(options || {})
  }));
}

export { loadSettings, saveSettings };