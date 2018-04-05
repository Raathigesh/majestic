// Monkey patch the stdin with setRawMode so jest would think it's running from a terminal
process.stdin.setRawMode = () => {};
