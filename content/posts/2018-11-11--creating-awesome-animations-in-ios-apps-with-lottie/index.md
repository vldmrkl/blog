---
title: Creating Awesome Animations In iOS Apps With Lottie
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

Nowadays, high-quality software consists of many factors like:
- Maintainability
- Efficiency
- Scalability
- Security
- Usability

In this story, I would like to focus on the last factor which is **usability**. Let’s start with a definition, what is usability?

> Usability is the degree of ease with which products such as software and Web applications can be used to achieve required goals effectively and efficiently. Usability assesses the level of difficulty involved in using a user interface. (Retrieved from <a href="https://www.techopedia.com/definition/4919/usability" target="_blank" rel="noopener noreferrer">Techopedia</a>)

I strongly believe that a good UI/UX is a must-have in the modern software. No matter what kind of software you are developing, good design helps to attract users, to keep users using your app, to distinguish it from its competitors. It does not really matter what platform you are developing for. Whether it is a web application, a mobile app or a desktop app, there are so many frameworks/libraries that help you to create a great design.

I have come across one of such libraries called Lottie recently. This library was developed by Airbnb, and here is its description:
> Lottie is an iOS, Android, and React Native library that renders After Effects animations in real time, allowing apps to use animations as easily as they use static images. (retrieved from <a href="https://airbnb.design/lottie/" target="_blank" rel="noopener noreferrer">Airbnb design</a>)

Animations can take your software’s design to the next level. Here are good lines about the importance of animations in UX:
> When it comes to great UX design, animation can be multipurpose. First, it can showcase or infer functionality. In a way, it acts as mini-onboarding. In addition, it can add a layer of delight and fun. It can also provide reassurance and meaning to interactions. (retrieved from <a href="https://www.invisionapp.com/inside-design/importance-good-animation-ux/" target="_blank" rel="noopener noreferrer">InVision</a>)

Adobe After Effects (AE) is a fantastic piece of software that helps you to build incredible animations. In order to use AE animations in Lottie, you should install BodyMovin plugin for AE, which converts your beautiful animations into JSON format.

You can also find ready-to-use animations on <a href="https://lottiefiles.com/" target="_blank" rel="noopener noreferrer">LottieFiles</a>. For this tutorial, I am going to use a <a href="https://www.lottiefiles.com/2523-loading/" target="_blank" rel="noopener noreferrer">nice animation</a> I found there:
<img src="https://i.imgur.com/Yklddmi.gif" />

Now, let’s use Lottie and integrate the animation above into the iOS app. It should take you less than 3 minutes!<br />
_1._ Create a single-view iOS application in Xcode.<br />
_2._ Install Lottie into your project.<br />

### Cocoapods
Add Lottie dependency to the podfile: `pod 'lottie-ios'`. Then, run `pod install`.

### Carthage
Add Lottie dependency to the cartfile: `github "airbnb/lottie-ios" "master"`. Then, run `carthage update`.

Next, in the General settings of the project add `lottie-ios.framework` file to the “Linked Frameworks and Libraries” settings.

_3._ Add your animation JSON file to the folder with your project files (the folder that contains `ViewController`, `Main.storyboard`, etc) by drag and drop. Choose the following options:
<img src="https://i.imgur.com/NDsIQ0t.png" />

_4._ To the main View, add a View that will contain your animation (I made it 300x300), and add class `LOTAnimationView` in the identity inspector:
<img src="https://i.imgur.com/crY3pYE.png" />

_5._ Connect your Animation View to the `ViewController` (Press control + drag and drop the newly created Animation View to the `ViewController`).
<img src="https://i.imgur.com/3Z4wwoI.gif" />

_6._ Add the following line to the top of the `ViewController`:
```swift
import Lottie
```

_7._ Create a function to play the animation:
```swift
func playAnimation(){
   animationView.setAnimation(named: "loading")
   animationView.loopAnimation = true
   animationView.play()
}
```

Let’s go through each line of code:
```swift
animationView.setAnimation(named: "loading")
```

where “loading” is the name of your animation JSON file.
This line connects your animation with the view.

```swift
animationView.loopAnimation = true
```

Obviously, this line loops the animation so it always animates.
```swift
animationView.play()
```

This function basically plays the connected animation.

_8._ Call your `playAnimation()` in the `viewDidLoad()`:
```swift
override func viewDidLoad() {
   super.viewDidLoad()
   playAnimation()
}
```

_9._ Build and run the app. <br />
<img src="https://imgur.com/3RO26FT.gif" />

## Conclusion
As you can see, it was pretty easy to integrate an After Effects animation to the iOS app thanks to Lottie. Just three lines of code that call Lottie’s `setAnimation`, `loopAnimation` and `play` do the magic, and you get a nice animation playing in your application.

If you liked this tutorial and want to learn more about Lottie, check out <a href="https://github.com/airbnb/lottie-ios" target="_blank" rel="noopener noreferrer">Lottie’s documentation</a>.

<a href="https://github.com/klymenkoo/lottie-ios-app" target="_blank" rel="noopener noreferrer">GitHub repository</a> with the app I created in this tutorial.
