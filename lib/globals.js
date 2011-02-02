Shadowbox.init({
  skipSetup: true
});

var socket = new io.Socket(config["server"].host, {port: config["server"].port});