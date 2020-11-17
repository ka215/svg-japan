<h1 align="center">
  <br>
  SVG Japan
  <br>
</h1>

<h4 align="center">A native JavaScript-built plugin that generates an interactive SVG-formatted map of Japan.</h4>

<p align="center">
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/ka215/svg-japan?style=flat-square">
  <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/ka215/svg-japan/total">
  <img alt="GitHub" src="https://img.shields.io/github/license/ka215/svg-japan">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#supported-devices">Supported Devices</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#demonstration">Demonstration</a> •
  <a href="#creators">Creators</a> •
  <a href="#copyright-and-license">License</a>
</p>

![screenshot](https://raw.githubusercontent.com/ka215/svg-japan/main/assets/svg-japan.png)

## Features

* Multiple types of Japanese maps can be generated.
* The presence or absence of a map border can be switch.
* Regions can be defined by freely grouping prefectures.
* All prefectures can be unified in one color.
* Normal and active colors can be set for each prefecture and region.
* The tip helper can be pop up when on mouse over.
* You can get the event fired on JavaScript when the prefecture is clicked.

## Quick Start

Several quick start options are available:

* Clone this repository
```bash
git clone https://github.com/ka215/svg-japan.git
```
* Install from npm
```bash
npm install svg-japan
```
* Download an archive file of latest release
[Letest Release](https://github.com/ka215/svg-japan/releases/latest/)
* Retrieve via CDN into your HTML
```HTML
<script src="https://cdn.jsdelivr.net/gh/ka215/svg-japan@main/dist/svg-japan.min.js"></script>
```

## Usage

1. Include this plugin script into your HTML.
```HTML
<script src="/path/to/svg-japan.min.js"></script>
```
2. Then mark up the element where you want to insert the map.
```HTML
<div id="my-map-container"></div>
```
3. Finally, instantiate the plugin class in your script.
```js
svgJapan({ element: "#my-map-container" })
```

Alternatively, you can create the container element in JavaScript.
```js
var map = svgJapan()

document.body.appendChild( map.map_container )
```

It is desirable to execute the dispatcher function after the files of this plugin are completely loaded.
To do this, a structure that waits for the DOM content to finish loading, such as:
```js
document.addEventListener( 'DOMContentLoaded', function() {

  svgJapan()

}, false)
```

## Supported Devices

Please refer to the target device definition of JS transpiling (excerpt from "babel.config.js" below):
```
targets: {
  chrome: "67",
  edge: "17",
  firefox: "60",
  ie: "11",
  safari: "11.1",
},
```

## Documentation

Refer to the following page for the options that can be set and the method description.

[Interactive Japan Map Generation Plugin](https://ka2.org/manual-about-svg-japan/)

## Demonstration

The shortcut is to use it for the time being.

[DEMO](https://ka2.org/svg-japan/)

## Creators

**ka2 (Katsuhiko Maeno)**
- <https://ka2.org/>

If you liked using this app or it has helped you in any way, I'd like you send me an email at ka2@ka2.org about anything you'd want to say about this software. I'd really appreciate it!

## Copyright and license

Code and documentation copyright 2020 the [ka2](https://ka2.org/). Code released under the [MIT License](https://raw.githubusercontent.com/ka215/svg-japan/main/LICENSE).
