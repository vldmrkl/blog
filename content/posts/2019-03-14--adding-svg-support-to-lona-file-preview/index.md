---
title: Adding SVG Support To Lona’s File Preview
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

Last week, I made my first contribution to Lona. If you haven’t read my previous post, check it out.

I really liked the experience of contributing to this project, and I decided to work on it until the end of the semester. Earlier this week, I had an opportunity to fix the following bug:
> Currently Lona Studio displays some image files, e.g. PNG files, when selected in the file navigator. However, it doesn’t display SVG files, which it really should, since it handles them elsewhere correctly. (retrieved from the issue description)

Here is how the .png files are displayed:
<img src="https://i.imgur.com/P6VCIsk.png" />

The .svg files are not displayed at all:
<img src="https://i.imgur.com/WKPAe8s.png" />

## Fix
First, I had to add SVG to the list of supported formats in `Info.plist`.

Then, I added the following lines to the implementation of the `read` function, which is called on file selection event:
```swift
let data = try Data(contentsOf: url, options: NSData.ReadingOptions())
if url.pathExtension == "svg" {
    let size = CGSize(width: 450, height: 450)
    content = SVG.render(contentsOf: url, size: size, resizingMode: .scaleAspectFit)
} else {
    content = NSImage(data: data)
}
```

Let’s walk through this chunk of code. <br />

_1._ It checks the extension of the selected file.<br />
_2._ If the file has an `svg` extension, it sets the `content` (which has type of `NSImage`) to the result of `render` function, which was implemented in the SVG enum.<br />
_3._ If the file has any other image extensions, it just sets `content` variable to `NSImage` with `data`.

And here is the result:
<img src="https://i.imgur.com/zLSI2nS.png" />

As you can see, the SVG image is rendered when a user selects the image in the file navigator 👍
