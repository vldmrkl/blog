---
title: 'Node.js File System Method: fs.watch'
cover: node.png
author: Volodymyr Klymenko
---

<re-img src="node.png"></re-img>

I am going to look into the **watch** method of **Node fs** module. This method watches for changes in provided files or directories. Let’s take a look at function definition:

```js
fs.watch(filename[, options][, listener])
```

It takes three arguments:

- _filename_ — file/directory to watch
- _options_ — optional argument, you can specify these parameters there: persistent, recursive, encoding
- _listener_ — is a callback function with parameters eventType and filename

The watch method returns instance fsWatcher class, which invokes the “change” method of EventEmitter class 🤔

Let’s take a look at my example. I created a text file called “_node-desc.txt_” with a sample content:<br/>
`Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.`

I also wrote a small node app to watch for changes of the _“node-desc.txt_”:

```js
const fs = require('fs');
const WATCH_TARGET = './node-desc.txt';
fs.watch(WATCH_TARGET, (eventType, filename) => {
  console.log('File "' + filename + '" was changed: ' + eventType);
});
```

I call _fs.watch_ method with WATCH_TARGET (filename argument) and listener callback, where I log occurred “change” event. When I start my app and edit my text file by adding an extra character(don’t forget to save it), I am getting the following output in my console:<br/>
`File "node-desc.txt" was changed: change`<br/>
`File "node-desc.txt" was changed: change`

It’s not a misprint. I have really got two messages, however, I saved my changes one time. I was curious about why it happened, so I did a research and found <a href="https://github.com/nodejs/node-v0.x-archive/issues/2054#issuecomment-8686322" target="_blank" rel="noopener noreferrer">the answer on GitHub</a>:<br/>
`a write to a file triggers two kqueue events NOTE_EXTEND and NOTE_WRITE`

In the <a href="https://nodejs.org/api/fs.html#fs_availability" target="_blank" rel="noopener noreferrer">documentation</a>, it is mentioned that:<br/>
`On macOS, this uses kqueue(2) for files and FSEvents for directories.`

and it absolutely makes sense because I’m using macOS.

There is also _watchFile_ method in _fs_ module. It works in a similar way as _fs.watch_, but it watches only for files, not directories. According to documentation, it is recommended to use fs.watch rather than _fs.watchFile_ which is slower and less reliable.
