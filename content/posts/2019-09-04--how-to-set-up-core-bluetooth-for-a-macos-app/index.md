---
title: How To Set Up Core Bluetooth For a macOS App
cover: cover.jpeg
author: Volodymyr Klymenko
---

<re-img src="cover.jpeg"></re-img>

If you create a Cocoa macOS app in Xcode, import Core Bluetooth and try to use this framework, you’ll run into an error:
```shell
[CoreBluetooth] XPC connection invalid
```

Here is a quick guide on how to set up your macOS project to work with Core Bluetooth:<br/>
_1._ Go to Project Settings -> Capabilities -> App Sandbox <br/>
_2._ Check in Bluetooth option under “Hardware” heading <br/>
_3._ Then, go to Info.plist <br/>
_4._ Add “Privacy — Bluetooth Peripheral Usage Description” property, and add a description of how your app is going to use Bluetooth.
