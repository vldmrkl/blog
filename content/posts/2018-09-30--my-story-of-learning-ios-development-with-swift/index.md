---
title: My story of learning iOS Development with Swift
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

I have been using iPhone since 2013, and to be honest, I like it so much that I never had a thought to switch to Android. As a CS student, I always wanted to develop something for iOS devices because I use Apple products a lot. The thing was that I owned a Windows PC, and thus I couldn’t really do any iOS development. However, I switched to macOS at the end of last year, and… I didn’t do any development because I was kind of busy with other technologies for a while, thus I always postponed my plans to learn it until last month. Finally, the time has come, and I started learning Swift last month.

First of all, I had to choose where to learn it from. I looked at several popular courses, and my final choice was “<a href="https://itunes.apple.com/us/course/developing-ios-11-apps-with-swift/id1309275316" target="_blank" rel="noopener noreferrer">Developing iOS 11 Apps with Swift</a>” by Stanford. The structure of this course is like a usual academic course structure (two lectures per week + assignments). I tried to integrate this course into my calendar as if it was another course in my school term, however, it didn’t work out because I usually sacrificed the devoted time for a Stanford lecture for my school assignments. Therefore, I usually go through 1 lecture per week instead of planned 2 lectures, and I also work on assignments there. There are 3 reading assignments (Swift documentation) + 6 programming projects in the course.

I have already completed the first reading assignment, which is quite lengthy. As there are just three readings in this course, each of them has a quite decent amount of content. In total, I would say it took me 4–5 hours of thorough work with the material(reading, playing with it in Xcode playground, and making notes), and I covered these topics:

- The Basics (variables, variable types)
- Basic Operators
- Strings and Characters
- Collection Types
- Control Flow
- Functions
- Classes and Structures
- Properties
- Methods
- Inheritance
- Initialization

As for my Programming Project #1, I am developing a Concentration game for iOS. Here are the rules of the game:

> The cards are laid face down on a surface and two cards are flipped face up over each turn. The object of the game is to turn over pairs of matching cards (<a href="https://en.wikipedia.org/wiki/Concentration_(game)" target="_blank" rel="noopener noreferrer">Wikipedia</a>).

My UI consists of 16 buttons, which represent game cards, 1 button to restart the game, and a label with count of flips made. Once user taps card, it flips up with an emoji. Then user should tap on second card, and if the cards have the same emoji, they will disappear from the screen. If selected cards have different emojis, user should proceed with finding a pair.
This is how it looks:

<re-img src="1.png"></re-img>

Let’s talk about architecture of the app. My project implements the Model-View-Controller design pattern, which is the most used design pattern in iOS apps. Here is the definition of MVC from Apple documentation:

> The Model-View-Controller (MVC) design pattern assigns objects in an application one of three roles: model, view, or controller. The pattern defines not only the roles objects play in the application, it defines the way objects communicate with each other. Each of the three types of objects is separated from the others by abstract boundaries and communicates with objects of the other types across those boundaries. The collection of objects of a certain MVC type in an application is sometimes referred to as a layer — for example, model layer. (<a href="https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html" target="_blank" rel="noopener noreferrer">Apple</a>)

Let’s take a look at my implementation of MVC in Concentration game:
<re-img src="2.png"></re-img>

**View:**
Main.storyboard basically contains 16 card buttons, “New Game” button, and a label.

**Model:**
There are two structs developed in my Model: Concentration and Card.
In a nutshell, Card holds an id and two boolean values: isFacedUp and isMatched. Also, there is idFactory implemented to generate a unique id during Card initialization.

*Concentration* has an array of type Card, and it handles the game logic here such as shuffling cards, choosing card at particular index, checking if the selected card was Matched, or if it was the only card faced up.

**Controller:**
*ViewController* basically connects my *Model* with the *View*. For example, it connects user action like *button touch* to *chooseCard* method of *Concentration* instance as well as it updates card buttons in View depending on Model cards properties (if card’s property facedUp is true, View’s card button should have emoji displayed).

It was a quick overview of the app. Although I haven’t finished this project yet (I’m going to make a “Score” feature), I can say that this assignment is definitely a good experience of practicing Swift as I became more familiar with Swift’s syntax and semantics, I made my View responsive depending on device model & device orientation, and I also got used to Xcode as it was a new IDE for me as well. I love Swift so far! Apple did a great job in terms of design and development of this language.

I’m excited to continue going forward through the course and learn this fantastic programming language!

I hope you enjoyed reading my story and you found something interesting here. I intend to post more about my experience of learning Swift and other topics as well. Stay tuned!

> **Concentration game GitHub repo: https://github.com/klymenkoo/Concentration**

