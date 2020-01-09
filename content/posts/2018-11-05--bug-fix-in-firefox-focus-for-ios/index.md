---
title: Bug Fix In Firefox Focus For iOS
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

I continue my journey in the world of Open Source Software, and I would like to share my recent experience of fixing a bug in a large iOS application. This application is **Firefox Focus for iOS**.

This contribution is notable to me because it was my first contribution where **I fixed a real bug** in such a large project. My previous contributions mainly were focused on code/project enhancements.

Let me tell you about the project and bugfix.

## Firefox Focus

> Firefox Focus for iOS devices is a privacy browser with tracking protection and content blocking. (Retrieved from <a href="https://support.mozilla.org/en-US/kb/focus" target="_blank" rel="noopener noreferrer">Mozilla</a>)

You can download Firefox Focus on <a href="https://itunes.apple.com/app/id1055677337" target="_blank" rel="noopener noreferrer">App Store</a>.

Also, if you are into iOS development, or you are into open source development, you can contribute to this project on <a href="https://github.com/mozilla-mobile/focus-ios" target="_blank" rel="noopener noreferrer">GitHub</a>.
> Browse like no one’s watching. The new Firefox Focus automatically blocks a wide range of online trackers — from the moment you launch it to the second you leave it. Easily erase your history, passwords and cookies, so you won’t get followed by things like unwanted ads. (Retrieved from app’s description on App Store)

Here are a few screenshots of this app:
<img src="https://i.imgur.com/A99DX6N.png" />

> “Private browsing” on most browsers isn’t comprehensive or easy to use. Focus is next-level privacy that’s free, always on and always on your side — because it’s backed by Mozilla, the non-profit that fights for your rights on the Web. (Retrieved from app’s description on App Store)

One of its feature is that if you don’t want to switch from Safari, you can still use Firefox Focus functionality in Safari (follow these steps to do that).

## Bug

The <a href="https://github.com/mozilla-mobile/focus-ios/issues/1523" target="_blank" rel="noopener noreferrer">issue</a> was that the search text in URL Bar mismatched the actual search after using back and forward navigation. Let’s go through an example:<br />
_1._ Search “the guardian”<br />
_2._ Search “mozilla”<br />
_3._ Press back<br />
_4._ Search “firefox”<br />
_5._ Press back<br />
_6._ **Search page shows** results for “**the guardian**” request, but URL Bar contains “**mozilla**” instead of “the guardian”.<br />

<img src="https://i.imgur.com/hei8nyL.gif" />

## Fix

The author of the issue left a note there that the problem might be in `SearchHistoryUtils` stack. It helped me to start my investigation of the problem.

I found class `SearchHistoryUtils`, which contains two boolean properties.

_1._ `isFromURLBar`<br />
_2._ `isNavigating`<br />

and four functions: <br />
_1._ `pushSearchToStack(with searchedText: String)` — when user makes a new search request, this function pushes that search to the stack.<br />
_2._ `pullSearchFromStack() -> String?` — this function doesn’t pop search from stack, instead, it returns the value of current search text if present.<br />
_3._ `goForward()` — updates isCurrentSearch value for the stack’s objects.<br />
_4._ `goBack()` — same as #3<br />

When I was analyzing the code, I dismissed `pullSearchFromStack`, `goForward`, and `goBack` functions because they didn’t really deal with stack changes. Therefore, I started debugging `pushSearchToStack` function. I debugged several test cases, and let’s take a look at my findings.
<img src="https://i.imgur.com/IBhY9rf.png" />

So I pretty much reproduced the bug described in the issue, and I found the problem:
> When the last search is not the current search (like in the Stack after first “Go back” user action), and user makes a new search, the last search is not overridden with the new one (look at red line in the table above).

> That is why when user goes back, URL Bar takes the old search text, which shouldn’t even be in the stack at that moment.

Let’s take a look at a chunk of the pseudo code of `pushSearchToStack` function:
<img src="https://i.imgur.com/SB7jYfK.png" />

Let’s take apart the code above:<br />
_1._ It declares an empty stack currentStack. It sets the value of currentStack to the value of global state searchedHistory value.<br />
_2._ Then, it goes through each search in the stack, and sets value of isCurrentSearch property to false.<br />
_3._ It adds the new search to the stack and sets its isCurrentSearch property to true.<br />

So I played with the code a bit, and added a check whether the last search is the current search:
<img src="https://i.imgur.com/KOTzvwV.png" />

If the last search is not the current search, it means that user clicked “back” button, and the currentStack removes its last element.

I tried to simulate the test case described above, and it worked as it supposed to work! The search text in URL Bar matched the search page.

**However, it was not the final fix.** This approach doesn’t work in case user goes back more than one time because the code above removes only last search from the stack.

**Even though it wasn’t right, it let me understand that I am on the right way.**

So I evolved my code:
<img src="https://i.imgur.com/PJYXDvj.png" />

Now, it checks whether the last search is the current search. If it is not the current search, it looks for the currentSearch in the stack and removes all the following searches from the stack.

Then, it adds a new search with the value of `isCurrentSearch` property to `true` to the stack.

The whole contribution you can find in my <a href="https://github.com/mozilla-mobile/focus-ios/pull/1533" target="_blank" rel="noopener noreferrer">Pull Request</a>.

Finally, let’s take a look at the fixed version of the browser.
<img src="https://i.imgur.com/pj9Po8Z.gif" />

As you can see, the text in URL Bar matches the search page even if you go back and forward as many times as you want.

## Summary
My pull request was successfully merged ✅

Overall, I liked the experience of contributing to this project, and I am likely to work on other issues there again 👨🏻‍💻🔜🔥🦊
