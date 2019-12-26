---
title: 'Hacktoberfest #1: Universal Ethereum Payment System iOS App'
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

October has come, and while people around the world celebrate Oktoberfest, developers have Hacktoberfest for the whole month! 🎃

What is Hacktoberfest?

> <a href="Hacktoberfest" target="_blank" rel="noopener noreferrer">Hacktoberfest</a> is a month-long celebration of open source software run by DigitalOcean in partnership with GitHub and Twilio.

- Hacktoberfest is open to everyone in our global community!
- Five quality pull requests must be submitted to public GitHub repositories.
- You can sign up anytime between October 1 and October 31. (Hacktoberfest official website)

The best thing about Hacktoberfest is that first 50,000 developers who submit 5 Pull Requests will get a t-shirt and stickers! 🤩

As you could notice, I have started making my first steps in open-source development, so Hacktoberfest is a fantastic opportunity to move on and make some more contributions during this month!

Also, I have been learning Swift since last month, thus, I thought that it would be great to practice the skills I have and learn something new.

That’s why I started to search for issues in iOS projects on GitHub. After some time, I found several projects to work on. The most interesting one was called **<a href="https://github.com/matterinc/DiveLane" target="_blank" rel="noopener noreferrer">DiveLane</a>**.

> DiveLane — Universal Ethereum Payment System

**Features:**
- Let you be free from hard-bonded solution like (Laptop + Chrome + MetaMask + Private key) binding.
- No private key sharing needed! Store it at one place, sign anywhere!
- Full support of EIP-681 (URI scheme) Even more:
- Sign transactions and call arbitrary contract’s methods via deep links (from DiveLane documentation).

As I understood, the project was created on a hackathon, and now it is in the stage of active development.

There was an <a href="https://github.com/matter-labs/FranklinPay-iOS/issues/40" target="_blank" rel="noopener noreferrer">issue</a> opened that asked to add Alamofire library to the project. I didn’t work with Alamofire before, moreover, I didn’t have any experience in adding libraries to the iOS project as I am still new to iOS development. This issue seemed challenging to me due to a lack of experience, however, I decided to challenge myself, and asked maintainers to work on the issue. I was kindly welcomed to contribute by app creators, and I started the work.

My task was to replace all *URLSession* methods with *Alamofire* methods in the project. From my initial research, I found that there were 4 URLSession uses.

I hadn’t done any networking in Swift before this PR, so I had to learn about *URLSession*, *Alamofire* as well as why should I use *Alamofire* instead of native *URLSession API*.

### URLSession

>The URLSession class and related classes provide an API for downloading content. With the URLSession API, your app creates one or more sessions, each of which coordinates a group of related data transfer tasks. For example, if you’re creating a web browser, your app might create one session per tab or window, or one session for interactive use and another for background downloads. Within each session, your app adds a series of tasks, each of which represents a request for a specific URL (following HTTP redirects, if necessary). (<a href="https://developer.apple.com/documentation/foundation/urlsession" target="_blank" rel="noopener noreferrer">Apple developer documentation</a>)


So, basically, this API enables developer to upload and download content via HTTP/HTTPS requests.

### Alamofire

*Alamofire* is an HTTP networking library that is built on top of Apple’s URLSession. It is just an elegant way of networking implementation in Swift.

> Alamofire’s elegance comes from the fact it was written from the ground up in Swift and does not inherit anything from its Objective-C counterpart, AFNetworking. (<a href="https://www.raywenderlich.com/35-alamofire-tutorial-getting-started" target="_blank" rel="noopener noreferrer">Alamofire Tutorial: Getting Started</a>)

### Why should I use Alamofire instead of native URLSession API?

Alamofire makes the code cleaner as it removes the need to write boilerplate code.

Now, let’s get into practice!

After I forked and set up my local repository, the first thing I tried was building the app in Xcode. However, the build failed, but the error message was quite obvious and it let me know that dependencies are not installed. It was the first problem I faced. Nevertheless, solution was pretty simple. The project uses CocoaPods as a dependency manager, so I installed dependencies by running:<br />
`pod install`

After the dependencies were installed, I was able to build the project.
<re-img src="1.png"></re-img>
<re-img src="2.png"></re-img>

Firstly, I had to install Alamofire to the project. I added Alamofire dependency in Podfile (file with all dependencies) by adding this line:<br />
`pod 'Alamofire', '~> 4.7'`

Then, I ran `pod install` again.

Alamofire was successfully installed to the project ✅

After that, I went through the files that had to be changed (I found four URLSession uses), therefore, I had to replace 4 methods.

Here is an example of the change I made. Here is the chunk of code using URLSession:
```swift
let task = URLSession.shared.dataTask(with: url) { (data, _, error) in
if let data = data {
do {
    let jsonSerialized = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
    if let json = jsonSerialized {
      if let conversionRate = json["USD"] as? Double {
        DispatchQueue.main.async {
           self.conversionRates[tokenName] = conversionRate
           completion(conversionRate)
        }
       } else {
          print("Can't convert to Double")
          DispatchQueue.main.async {
               completion(0)
          }
       }
    }
   } catch let error as NSError {
          print(error.localizedDescription)
          DispatchQueue.main.async {
          completion(0)
        }
   }
} else if let error = error {
       print(error.localizedDescription)
       DispatchQueue.main.async {
       completion(0)
     }
  }
}
task.resume()
```

And I replaced the URLSession API with Alamofire library:
```swift
Alamofire.request(url)
     .responseJSON { response in
           guard response.result.isSuccess else {
                print(response.result.error!.localizedDescription)
                DispatchQueue.main.async {
                     completion(0)
                }
                return
           }
           guard let value = response.result.value as? [String: Any],
           let conversionRate = value["USD"] as? Double else {
                print("Can't convert to Double")
                DispatchQueue.main.async {
                        completion(0)
                }
                return
            }
            self.conversionRates[tokenName] = conversionRate
            completion(conversionRate)
}
```

So much better, isn’t it? 🤩

I did similar job in other classes.
Next, I tested that the app works in the same way, and it was not really straightforward as there was not some kind of “CONTRIBUTING.md” in the project, so I had to figure out by myself how the app works. It took some time to understand how it works, but it was a good experience as I became more proficient in the iOS project architecture and Swift code.

Actually, I also opened an <a href="https://github.com/matterinc/DiveLane/issues/43" target="_blank" rel="noopener noreferrer">issue</a> in the project, where I asked the maintainers to add instructions for contributors.

Finally, I opened my <a href="https://github.com/matterinc/DiveLane/pull/45" target="_blank" rel="noopener noreferrer">Pull Request</a>, and it was merged to the project! 🎉

It’s been such a great experience to contribute to this project, here are my outcomes:

- learned CocoaPods
- learned Alamofire
- learned URLSession
- understood code written by other developers
- communicated with creators
- successfully contributed to the project
