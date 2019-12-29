---
title: 'Hacktoberfest #3: iOS 11 Deprecation Warnings'
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

This week, I found an <a href="https://github.com/brave/brave-ios/issues/342" target="_blank" rel="noopener noreferrer">issue</a> in an iOS-browser called <a href="https://itunes.apple.com/app/brave-web-browser/id1052879175?mt=8" target="_blank" rel="noopener noreferrer">Brave</a>. The issue contained 4 warnings that had to be fixed, and I asked to work on it. Here is the list of warnings:
- ‘automaticallyAdjustsScrollViewInsets’ was deprecated in iOS 11.0: Use UIScrollView’s contentInsetAdjustmentBehavior instead.
- ‘touchIDNotAvailable’ was deprecated in iOS 11.0: use LAErrorBiometryNotAvailable.
- ‘touchIDNotEnrolled’ was deprecated in iOS 11.0: use LAErrorBiometryNotEnrolled.
- ‘touchIDLockout’ was deprecated in iOS 11.0: use LAErrorBiometryLockout.

After I was approved to work on it, I set up the project on my local machine, installed dependencies using Carthage and built the app to make sure everything works.

Next, I found the warnings I needed to fix in the code, analyzed the code, and started my research on how to fix them.

## ‘automaticallyAdjustsScrollViewInsets’ was deprecated in iOS 11.0: Use UIScrollView’s contentInsetAdjustmentBehavior instead.

Here is a definition of automaticallyAdjustsScrollViewInsets:
> A Boolean value that indicates whether the view controller should automatically adjust its scroll view insets. (Apple documentation)

However, it's been deprecated since iOS 11, so `UIScrollView.ContentInsetAdjustmentBehavior` should be used instead.

> This property specifies how the safe area insets are used to modify the content area of the scroll view. The default value of this property is UIScrollView.ContentInsetAdjustmentBehavior.automatic. (Apple documentation)

There were two ViewControllers that used automaticallyAdjustsScrollViewInsets, and here is how it was used:
```swift
automaticallyAdjustsScrollViewInsets = false
```

and I changed it into:
```swift
if #available(iOS 11.0, *) {
    scrollView?.contentInsetAdjustmentBehavior = .never        
} else {            
    automaticallyAdjustsScrollViewInsets = false       
}
```

Fixed ✅

## touchID deprecation warnings

If you are using _LocalAuthentication_ framework, iOS developers shouldn’t use any _touchID_ error codes since iOS 11 was released because there are 2 ways of authentication in iOS now: TouchID and FaceID, and it is not efficient to have different errors for TouchID/FaceID failures.

The first thing that concerned me about these warnings was that there wasn’t any line of code or file specified in these warnings. I tried to search for any mentions of `touchIDNotAvailable`, `touchIDNotEnrolled` and `touchIDLockout` in the repository, however, **I didn’t find any usage of these properties anywhere in the code!**

The only related thing I found in the code was:
```swift
DispatchQueue.main.async {
  switch code {
    case .userFallback, .biometryNotEnrolled, .biometryNotAvailable,      .biometryLockout:
        fallback?()
    case .userCancel:
        cancel?()
    default:
        cancel?()
  }
}
```

where code is instance of `LAError.Code`

And it confused me because it uses `LAErrorBiometryNotAvailable`, `LAErrorBiometryNotEnrolled`, and `LAErrorBiometryLockout` as it was required in the warning.

I did a research about these warnings, and I found out that, actually, it is a **<a href="https://bugs.swift.org/browse/SR-6637" target="_blank" rel="noopener noreferrer">Swift compiler bug</a>**. That’s why I informed project contributors about that, and I created a <a href="https://github.com/brave/brave-ios/pull/349" target="_blank" rel="noopener noreferrer">Pull Request</a> with my fix for the first warning.

Here are some outcomes of this week:

- Fixed iOS 11 deprecation warning: `‘automaticallyAdjustsScrollViewInsets’ was deprecated in iOS 11.0: Use UIScrollView’s contentInsetAdjustmentBehavior instead.`
- Researched touchID iOS 11 deprecation warnings, and learned that there is a bug in Swift compiler
- Communicated with project maintainers and contributors
