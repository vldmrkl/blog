---
title: 'Hacktoberfest #4: Java Code Cleanup'
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

My fourth contribution in Hacktoberfest was my first time I did not write any line of code in the whole Pull Request! Unexpectedly, this time I worked on a Java project instead of Swift projects. At the time I was looking for an issue, I couldn’t find any issues/projects in Swift, so I looked at other languages. I didn’t even intend to go for Java, as I would prefer JavaScript/C++ instead because I didn’t work with Java for a while.

However, I found an interesting project called <a href="https://github.com/ExpediaDotCom/adaptive-alerting" target="_blank" rel="noopener noreferrer">Adaptive Alerting</a> written in Java, and there was an <a href="https://github.com/ExpediaDotCom/adaptive-alerting/issues/235" target="_blank" rel="noopener noreferrer">issue</a> that required to remove a module from a project.


## Adaptive Alerting
AA does anomaly detection for streaming time series, featuring automated model selection.

The goals of the project:
> Reduce **mean time to detect** (MTTD) production incidents. This is the average time between the onset of some production incident and somebody’s knowing about it, where “somebody” could be a person or else an automated response system

> **Monitor as many signals of health as possible.** The signals or metrics in question can represent business-, application- or system-level concerns. Our working assumption is that in a large business there are many thousands if not millions of such concerns, and so **AA needs to scale accordingly.**

> For scalability, we must **aggressively limit the number of false positives (i.e., spurious alerts).**

> Also for scalability, we must **automate model selection and tuning.**

👆Retrieved from <a href="https://github.com/ExpediaDotCom/adaptive-alerting/wiki" target="_blank" rel="noopener noreferrer">project’s Wiki</a>.

## Architecture

<img src="https://i.imgur.com/AFSoTpm.png" />

On the architecture above, you can see three main parts of the project:
- Model selection & Autotuning (chooses an appropriate model and metric for provided data)
- Model Building (trains models)
- An Anomaly Engine, which the runtime that accepts incoming metric streams from arbitrary time series metric source systems; classifies individual metric points as normal, weak anomalies or strong anomalies; and then passes them along to consumer systems such as alert management systems (for end users) and automated response systems (project’s Wiki);

This is a more detailed version of the architecture:
<img src="https://i.imgur.com/1ui8RY6.png" />

## Issue
The maintainer asked to remove Anomaly Validation module from the project because they have decided to move AV away from Adoptive Alerting’s pipeline. As usual, I asked to work on the issue. After I was welcomed to take it, I set up a project on my local machine, and built it by running:
```shell
./mvnw clean verify
```

The build was successful, and the build time was about 3.30 minutes. I made sure that everything works, and began to search for all mentions of anomvalidate in the code. I found anomvalidate module, and I deleted it. Then I had to remove all uses of this module in the project. It was easy because when I deleted anomvalidate module, all the files that used it displayed errors as they referenced unexistent dependency. I quickly removed those Anomaly Validation related code and built the project again to make sure I haven’t broken anything.

The build was successful again. However, this time, it took about 1.30 minutes to build it!

As you noticed, I haven’t added any code. I just removed some files and lines of code, and it allowed me to contribute successfully to the project (<a href="https://github.com/ExpediaDotCom/adaptive-alerting/pull/237" target="_blank" rel="noopener noreferrer">my PR was merged</a>)!

I would like to mark that this project has a fantastic wiki page with many details (I haven’t seen such a detailed wiki page before), and its maintainer, who was kind, and also grateful for contribution.
