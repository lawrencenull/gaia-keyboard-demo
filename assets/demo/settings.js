'use strict';

(function(exports) {

var SettingsHandler = function(app) {
  this.app = app;

  this.settings = new Map();
  this.settings.set('keyboard.wordsuggestion', true);
  this.settings.set('keyboard.autocorrect', true);
  this.settings.set('keyboard.vibration', true);
  this.settings.set('audio.volume.notification', 10);
};

SettingsHandler.prototype.start = function() {
  // Turn off sound feedback if this platform does not support audio.
  var canPlayOgg = (new Audio()).canPlayType('audio/ogg');
  this.settings.set('keyboard.clicksound', !!canPlayOgg);
};

SettingsHandler.prototype.handleMessage = function(data) {
  switch (data.method) {
    case 'get':
      var result = {};
      result[data.args[0]] = this.settings.get(data.args[0]);
      this.app.postMessage({
        api: data.api,
        lockId: data.lockId,
        id: data.id,
        result: result
      });

      break;

    case 'set':
      var key;
      for (key in data.args[0]) {
        this.settings.set(key, data.args[0][key]);
      }
      this.app.postMessage({
        api: data.api,
        lockId: data.lockId,
        id: data.id,
        result: data.args[0]
      });

      break;

    case 'clear':
      this.settings.delete(data.args[0]);
      this.app.postMessage({
        api: data.api,
        lockId: data.lockId,
        id: data.id,
        result: data.args[0]
      });

      break;
  }
};

exports.SettingsHandler = SettingsHandler;

}(window));
