---
title: How 50 Lines of Code Raised a Thousand Followers On Instagram Within One Month
cover: ig_phone.jpeg
author: Volodymyr Klymenko
---

<re-img src="ig_phone.jpeg"></re-img>

I am sure that even if you are not an active Instagram user posting pictures every day, and you just check the feed every day to see what’s new happened there in the world, you are likely to notice notifications from Instagram that someone you don’t know sent a request to follow you. It’s a common thing for social medias like Instagram, Twitter, etc.

One day, I started following the official accounts of Apple, Entrepreneur magazine, Google, Instagram, Mark Zuckerberg, and I noticed that I received a lot of follow requests on my account within next couple of hours. In a day, I tried to unfollow those accounts and follow them again. I got the same effect: my account continued getting follow requests. It was not difficult to find how it works. Basically, when you start following some accounts, you appear on the top of the list of followers in those accounts, and people just follow random accounts from the top expecting reciprocity.

An idea flashed through my mind: what if I can loop the process of re-following those large accounts, so I can get followers constantly. I have never hunted for numbers in my social medias, but I was curious whether my idea would work. I began to research Instagram API relationship endpoints. It was absolutely easy, so I played with various endpoints using my personal account and development account I created specially for this experiment. The only thing was that I was in sandbox mode of Instagram API, which has restrictions such as you can use only accounts which are invited to sandbox (that’s why I was not able to test my idea directly in sandbox mode).

---

> To get out of Sandbox mode, you need to submit your app for review (<a href="https://www.instagram.com/developer/sandbox/" target="_blank" rel="noopener noreferrer">Instagram API documentation</a>).

Firstly, I was not going to create a whole app. Secondly, I was not sure that it would pass review on Instagram side. Finally, I just wanted to make it to see if it even works, so I started searching another way of getting possibilities of live mode. After quick Google search, I found a <a href="https://www.npmjs.com/package/instagram-private-api" target="_blank" rel="noopener noreferrer">node package with Instagram API wrapper</a>. Next, I learned how the wrapper works, then I created a Node.js application where I had an array of strings with usernames and three functions:

1. Call wrapper’s method to unfollow specified user
2. Call wrapper’s method to follow specified user.
3. Loop through each user of my array calling function #1 and function #2 consequently.
   In the Node.js server itself, I just called function #3 every hour. That’s it. Then, I took my old laptop which I did not use, and started running server there 24/7. Voilà! Everything worked as I assumed.

In the Node.js server itself, I just called function #3 every hour. That’s it. Then, I took my old laptop which I did not use, and started running server there 24/7. Voilà! Everything worked as I assumed.

Before I created my app, I had about 250 followers in my account. In 24 hours, I had almost 350. Almost 100 in a day! Actually, the activity was lower in next days, however, it still worked. Here is some statistics:
<re-img src="stats.png"></re-img>

After running my app a little more than a month, I have more than 1,5k. Sometimes activity was low as my server was down because of bad network or laptop had no charge 😅 In average, I used to gain 50 followers every day. At the moment, numbers are lower because I have not changed the list of accounts I follow for a while.

Originally, the list of users I used in my app was like this:

- tech_insider
- harvard_business_review
- ted
- techcrunch
- entrepreneur
- forbes
- successmagazine
- businessinsider
- thestartup.co
- foundr
- google
- apple
- zuck

From time to time, I edited this list and added other popular accounts of some entrepreneurs and celebreties (richardbranson, elonmusk, garyvee, kimkardashian).

---

>

Let’s take a look at the users who requested to follow me:

<re-img src="users.png"></re-img>

There were 3 major types of followers I was getting:

- Accounts who sell fake and “dead” users (they unfollow the accounts in a while).
- Folks who are into entrepreneurship and want their accounts to be more popular.
- Accounts with motivational quotes.

In addition to that, there are quite a few accounts that unfollow me in a while. However, since my server is running 24/7, the number of followers is going up all the time.

You can find <a href="https://github.com/klymenkoo/instagram-booster" target="_blank" rel="noopener noreferrer">the source code on my GitHub</a>.
