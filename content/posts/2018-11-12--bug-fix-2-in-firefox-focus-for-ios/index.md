---
title: 'Bug Fix #2 In Firefox Focus For iOS'
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

One week ago, I wrote a story about my first bug fix in a privacy browser for iOS from Mozilla called <a href="https://itunes.apple.com/app/id1055677337" target="_blank" rel="noopener noreferrer">Firefox Focus</a>. In that article, you can also find out my introduction of Firefox Focus.

If you missed my previous story, I highly recommend you to read it.

Firefox Focus iOS version 8.0 is going to be released soon. This new release will mainly have enhancements for search suggestions feature of the browser. I worked on one of the bugs in search suggestions.

## Bug
URL Bar does not display the search text if a user selects search suggestion instead of pressing the “Go” button on the keyboard. Here is an example:
If you search for mozilla and press the “Go” button, the URL Bar will contain `mozilla`. However, if you search for mozilla and you select one of search suggestions, the URL Bar will contain `www.google.com`.<br />
<img src="https://i.imgur.com/QSkNk70.gif" />

## Fix
My strategy to fix this bug was:<br />
_1._ Find a function that is called on a search suggestion click.<br />
_2._ Debug this function and understand how it works.<br />
_3._ Find the code that sets the text to URL bar.<br />
_4._ Make changes to fix the bug.<br />

Firefox Focus has a helpful document called <a href="https://github.com/mozilla-mobile/focus-ios/blob/master/Documentation/UI%20and%20Code%20Map.md" target="_blank" rel="noopener noreferrer">UI and Code Map</a> in their documentation. This document basically maps UI to the code, and it is very useful for new contributors who are not very familiar with the codebase of the project.

In that document, I found that the view that contains suggestions is called `OverlayView`.
<img src="https://i.imgur.com/D5MP9WW.png" />

It let me start my investigation. I went through the `OverlayView` class in the app. In `OverlayView.swift`, I found the `OverlayViewDelegate` protocol declaration. This protocol contains a bunch of functions that are supposed to respond to different user actions.
<img src="https://i.imgur.com/yO7Zgzk.png" />

Two of the functions above were under my suspicion: `didSearchForQuery` and `didSubmitText`. I found their implementation in the `BrowserViewController`.

I created two breakpoints on each of them, and went through the scenario to reproduce the bug. As I found, `didSearchForQuery` is called when the user selects a suggestion. Now, I had to debug this function and find the piece of code that sets the text of URL Bar. If you take a look at the implementation of `didSearchForQuery`, you will see that it is not so big.
<img src="https://i.imgur.com/U6BNTFX.png" />

However, when you debug this function, it goes deeper and deeper, and it goes into so many other functions. I also compared `didSearchForQuery` to its analogue function that is called when the user presses “Go” button. I found that they are similar between each other, and eventually they call a function called `setTextToUrl`, and I thought it is exactly what I am looking for.

I spent some time playing with the code and making different changes. I thought I found the reason why `didSearchForQuery` didn’t change the text in URL Bar because I noticed that it didn’t push the search to `SearchHistory` stack, so consequently, the `setTextToUrl` function couldn’t get value. I added a method to `didSearchForQuery` that pushed search to `SearchHistory` stack, and it seemed like `setTextToUrl` function was getting the value of the current search, however, URL Bar still contained `www.google.com`! I was confused and tried to find the solution, but my tries weren’t successful, so I decided to ask project maintainers.

I wrote about my investigation of the problem, and the steps I made to resolve it in the <a href="https://github.com/mozilla-mobile/focus-ios/issues/1541" target="_blank" rel="noopener noreferrer">issue on GitHub</a>. I heard back very soon from the maintainer <a href="https://github.com/sblatz" target="_blank" rel="noopener noreferrer">Sawyer Blatz</a>.
<img src="https://i.imgur.com/G5EVj7I.png" />

He gave me an advice how to fix this issue. It turned out that the fix is easier than I thought, I just had to change the line in `didSearchForQuery`:
```swift
submit(url: url)
```
into
```swift
urlBar(urlBar, didSubmitText: query)
```

This change basically calls the function that is used when the user presses the keyboard’s “Go” button. **It worked**!<br />
<img src="https://i.imgur.com/IBI2zOB.gif" />

As you can see, if the user selects a search suggestion, the search text is displayed in URL Bar.

## Summary
My <a href="https://github.com/mozilla-mobile/focus-ios/pull/1549" target="_blank" rel="noopener noreferrer">pull request</a> was successfully merged ✅

It was fun experience fixing this bug. I am becoming more and more familiar with Focus codebase, and it makes me feel confident because I plan to work on other issues there in the future.

Also, I would like to point out that is was so nice of <a href="https://github.com/sblatz" target="_blank" rel="noopener noreferrer">Sawyer</a> to explain why my code didn’t work. It’s my third contribution to Mozilla’s projects (I also contributed to Mozilla add-ons), and I noticed that Mozilla’s community is very kind to every contributor. I believe that it is one of the major factors that attracts developers to make contributions to their projects.
