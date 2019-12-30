---
title: Contribution to Mozilla Firefox
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

Today, I am going to tell you about my experience of working on Mozilla’s flagship product which is Firefox Browser 🔥🦊

## Background
Back in 2013, a linting utility for JavaScript and JSX called ESLint was created by Nicholas C. Zakas. This powerful linter became popular in the JavaScript community, and many companies started adopting it into their projects. As you can guess, Mozilla is one of them.

> In order to help people write standard-compliant code from the start and avoid wasting time during code reviews, a set of ESLint configuration files have been added to the code base so that JavaScript can be analyzed automatically. (<a href="https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/ESLint" target="_blank" rel="noopener noreferrer">Mozilla developer guide</a>)

The problem was that the codebase of Firefox is so large (it is the biggest codebase I’ve ever worked with) that Mozilla couldn’t roll out ESLint across the whole code. Thus, they put some directories with code into the _.eslintignore_ file, so the linter does not complain while building the code. You can see the whole list of directories and files that haven’t adopted ESLint yet in _<a href="https://searchfox.org/mozilla-central/source/.eslintignore" target="_blank" rel="noopener noreferrer">.eslintignore file</a>_.

As of today, there are about **350** files/directories that aren’t covered by ESLint.

## Issue
I took an <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1508825" target="_blank" rel="noopener noreferrer">issue</a> that asked to enable ESLint for dom/crypto folder.

## Set up
First of all, I had to set up a project on my local machine. It was a new experience for me because Mozilla uses **Mercurial** as their primary source control tool (you can still use <a href="https://github.com/glandium/git-cinnabar/wiki/Mozilla:-A-git-workflow-for-Gecko-development" target="_blank" rel="noopener noreferrer">Git</a>, but it’s more tricky to set up). However, I found that Mercurial workflow and commands are very much like Git.

I’m using macOS, and here are the instructions to set up Firefox on your macOS device:<br />
_1._ Install Mercurial:
```shell
brew install mercurial
```

_2._ Get Firefox source code using Mercurial:
```shell
hg clone https://hg.mozilla.org/mozilla-central
```

**It took me about an hour to download it!** <br />

_3._ Install all dependencies and build the project:
```shell
cd mozilla-central
./mach bootstrap
./mach build
```

Build command will take about an hour to complete.

**NOTE**: you might not need to build the project; it depends on your issue.

## Fix
After the local environment is set up, I could start hacking on the issue. I removed **dom/crypto** folder from **.eslintignore** file and then ran the following command to see eslint errors:
```shell
./mach eslint dom/crypto
```

Here is the output I got:
<img src="1.gif" />

**ESLint caught about 500 errors!**

Fortunately, I was able to fix some of the errors by ESLint’s autofix:
```shell
./mach eslint --fix dom/crypto
```

This command fixed some of the errors and following the instructions I was given, I had to make a commit for automatic fixes:
```shell
hg commit -m "Bug 1508825 Enable ESLint for dom/crypto (automatic changes)"
```

Looks pretty much a like `git commit` command.

**TIP**: Make sure you don’t have # in front of the bug number (i.e. commit message like “Bug #1508825 Enable ESLint…” wouldn’t work). It’s important because otherwise when you try to submit your fixes, **moz-phab** (Mozilla’s submission tool) will not recognize the bug number. In this case, you would have to edit your commit history and change the commit message.

That’s one of the mistakes I’ve done by myself, and I hope this tip would help somebody to avoid it in the future.

Next, I started fixing linting errors manually. The most common error was `no-undef (eslint)` which basically means that a variable has no definition in a file. I was able to fix that type of errors by simply adding:
```js
/* import-globals-from ./util.js */
```

`no-undef` made up most of ESLint complaints. When I fixed all of them, I had a little bit more than 100 errors left. Here are some kinds of them:
- `no-unused-vars`
**Fix**: Just remove the unused variable
- `no-shadow`
This error points that a variable has the same name as another variable from an upper scope.
**Fix**: Rename the shadowing variable. Another way to fix it, which worked for me in many cases, is to use the value of the shadowing variable and use it directly wherever you use it.
- `no-eval`
**Fix**: Either remove eval or add to disable an eslint rule for it: `// eslint-disable-next-line no-eval`.
- `no-redeclare`
**Fix**: Remove `var/let/const` from the redeclared variable.
- `constistent-return`
This error either points that the function should return something or it shouldn’t return a value.
**Fix**: Add or fix return of the function depending on an error message.

After I fixed all errors, I ran tests to make sure I didn’t break anything:
```shell
./mach mochitest dom/crypto
```

All of the tests passed ✅

Then, I committed my changes:
```shell
hg commit -m "Bug 1508825 Enable ESLint for dom/crypto (manual changes)"
```

## Submission
Next step was to submit my fixes for review. It was not the most straightforward process for me because I used to run `git push origin master`, and then create a pull request on GitHub. Here, I had to send my code for a review to Mozilla’s Phabricator instance. I followed <a href="https://moz-conduit.readthedocs.io/en/latest/phabricator-user.html" target="_blank" rel="noopener noreferrer">Mozilla Phabricator User Guide</a> to submit my patch.

In order to send my patch to the Phabricator, I had to install <a href="https://phabricator.services.mozilla.com/book/phabricator/article/arcanist_quick_start/" target="_blank" rel="noopener noreferrer">Arcanist</a> and <a href="https://github.com/mozilla-conduit/review/blob/master/README.md" target="_blank" rel="noopener noreferrer">moz-phab</a>. I found <a href="https://github.com/mozilla-conduit/review/releases/tag/1.10" target="_blank" rel="noopener noreferrer">moz-phab installation instructions</a> confusing because all the instructions are:
> Linux and MacOS
> Download moz-phab from the latest release and place it on your system path.
> You must have Python 2.7 installed, and preferably in your path.

When you go to the latest release, you see:
<img src="2.png" />

I didn’t really know what I had to download. Should I download source code or just moz-phab file? I know that some of my classmates also found it confusing.

Luckily, I was able to guess it correctly, and I downloaded the source code. Then, I unarchived it. Next, I set PATH environmental variable to it, and I was able to run `moz-phab` command (consider that I’ve already installed Arcanist).

Finally, I ran:
```shell
moz-phab submit
```

Both of my commits were sent for a review:
https://phabricator.services.mozilla.com/D13693
https://phabricator.services.mozilla.com/D13694

## Summary
I got a new experience and learned some new experience working on the large project such as Firefox. There were many new things for me behind editing and writing code in this contribution. Bugzilla, Mercurial, Arcanist, Phabricator, all these pieces of software were new for me, and I learned how to set up and use them. Even though I just worked with one folder, I was curious to see the project’s structure and organization, and it’s impressing.
