---
title: 'My First Contributions to Open-Source World'
cover: cover.jpeg
author: Volodymyr Klymenko
---

<re-img src="cover.jpeg"></re-img>

If you aspire to work on an open-source project, but you have no experience at all, this article is going to be extremely helpful for you. After reading this story, you will be familiar with the primary steps of contributing to open-source projects.

The first project I contributed to was <a href="https://github.com/filerjs/filer" target="_blank" rel="noopener noreferrer">filer</a>.

> Filer is a POSIX-like file system interface for node.js and browser-based JavaScript (from <a href="https://filer.js.org/" target="_blank" rel="noopener noreferrer">documentation</a>).

In simple words, it enables you to have a file system when you work with node.js or browsers by using one of the data storage options:

- IndexedDB
- WebSQL
- RAM (for temp. storage)

Here are the browsers(with Storage providers) that _filer_ is compatible with:

- node.js: v0.10.\*+
- IE: 10+ (IndexedDB)
- Firefox: 26+ (IndexedDB)
- Chrome: 31+ (IndexedDB, WebSQL)
- Safari: 7.0+ (WebSQL)
- Opera: 19+ (IndexedDB, WebSQL)
- iOS: 3.2+ (WebSQL)
- Android Browser: 2.1–4.4 (WebSQL), 4.4+ (IndexedDB)

As you can see, _filer_ can work with will all modern browsers.

_Filer_ was implemented in the way it is very similar to _node.js fs module_.

---

<br />

_Filer_ has started to support the _Promise_ based API recently, so there were added _promise_ versions of most methods. However, almost all newly added methods miss unit tests.

So my goal was to add some tests for promise based API. From my research, I found that fs.promises.mkdir didn’t have any tests, so I created an issue in filer’s GitHub repository. <a href="https://github.com/filerjs/filer/issues/407" target="_blank" rel="noopener noreferrer">**I described the problem, suggested what tests can be implemented, and asked to be assigned**</a>. After some time, I officially was assigned to that issue, and I started work.

Now let’s go through the process of setting up the repository on the local machine:

*1.* Fork the repository you want to work with by clicking “Fork” button in the upper-right corner.
<img src="https://i.imgur.com/FhkeIsD.png" />

*2.* Now, if you go to your profile’s repositories, you will see the repository you’ve forked, and there will be label “forked from …”.
<img src="https://i.imgur.com/lLlCA7E.png" />

*3.* Copy the link from “Clone or download” button
<img src="https://i.imgur.com/wBaWra0.png" />

and execute git clone command with your link, in my case it was:<br />
`git clone https://github.com/klymenkoo/filer.git`

*4.* Go to the directory you’ve just cloned, and add a remote of the original repository (it’s a good practice to call it upstream). Make sure you use URL of original repo:<br />
`git remote add upstream https://github.com/filerjs/filer.git`

Adding a remote will enable you to sync changes you make in a fork with the original repository.

*5.* Create a new branch with the name related to the issue you are fixing. In my case, I created branch called issue-407 because the issue I created had number 407:<br />
`git checkout -b issue-407`

---

That’s all you need to set up the local environment, and now it’s time for development!

I opened project in VSCode, and ran:<br />
`npm test`

to make sure that everything works, and nothing is crushed. And… Success! I got:<br />
`SUMMARY:`<br />
`✔ 337 tests completed`

It means that I am safe to start coding. So I opened test file of *mkdir* method called *fs.mkdir.spec.js*, and it has already had these tests:
- *should be a function*
- *should return an error if part of the parent path does not exist*
- *should return an error if the path already exists*
- *should make a new directory*

So I wanted to have the same tests for *promise* version of *mkdir*, and I also wanted to add another test to ensure that function returns promise:

- *should return Promise*

And here are the new tests for *fs.promise.mkdir*:
<img src="https://i.imgur.com/7ZYcPcs.png" />

After I finished my tests, I ran <br />
`npm test`

again, and the output was:<br />
`SUMMARY:`<br />
`✔ 342 tests completed`

That means, all my tests worked, so I was ready to push my code to the repo.

Let’s upload the new code to the repository and create Pull Request to original repository:

*1.* Add modified files to the staging area by running:<br />
`git add fs.mkdir.spec.js`

*2.* Commit your changes by running:<br />
`git commit -m "Add tests for fs.promise.mkdir"`

Where -m “…” specifies commit’s message.

*3.* Push your changes to the forked repo:<br/>
`git push origin`

*4.* Go to the original repository on GitHub, and create Pull Request by clicking “New pull request” button in “Pull requests” tab.
<img src="https://i.imgur.com/sq2NmKC.png" />

*5.* Select the branch you want to merge your code with(probably, master in original repo), and select the branch you want to pull code from (branch from your forked repo):
<img src="https://i.imgur.com/cPZS3wE.png" />

*6.* Click “Create pull request”.

*7.* Modify title and description of the pull request to reflect the changes made in the code.

---

<br />

Someone, who was reviewing my <a href="https://github.com/filerjs/filer/pull/415" target="_blank" rel="noopener noreferrer">PR</a>, noticed that I also included some whitespaces changes to the commit, and suggested that it would be better to move those whitespaces to another commit. It was a good catch, I agreed with that. I didn’t put those whitespaces manually; it was auto-formatting function of VSCode, and, unfortunately, it was committed, however, it is just a small problem.

I also did some code review for another PR, and I think that it is a great thing about open-source because any developer can review the code in Pull Request, and maybe find some mistakes. The more developers, the more code review, and, consequently, the better code will be produced in the end of the day (hopefully). By the way, when I did the code review, I was able to suggest a minor change, and the developer changed the code according to my advice (another contribution 😀👍).

To sum up, it was a great experience of making my first steps in the open-source development. I’m excited to continue working in this direction, and I will contribute to more projects soon!
