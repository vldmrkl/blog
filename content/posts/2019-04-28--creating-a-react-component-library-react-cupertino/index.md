---
title: 'Creating a React Component Library: React Cupertino'
cover: cover.jpg
author: Volodymyr Klymenko
---

<re-img src="cover.jpg"></re-img>

When I had one of my internships, I developed with React a lot. One time, I needed a complicated component for a project, and I looked for a ready-to-use component in favor of time. I came across an <a href="https://blog.bitsrc.io/11-react-component-libraries-you-should-know-178eb1dd6aa4" target="_blank" rel="noopener noreferrer">article</a> on Medium about top React component libraries.

> **React component** library is a set of reusable components that save developer’s time for implementing components from scratch.

When I looked at the libraries presented in that list, I found that most of them look so similar between each other, and it’s difficult to select one at first sight. Most of the libraries there implement Google Material Design, and if you take a look at them, you’ll see that the components look pretty similar to each other:
🔗 <a href="https://material-ui.com/" target="_blank" rel="noopener noreferrer">Material UI</a>
🔗 <a href="http://react-toolbox.io/#/" target="_blank" rel="noopener noreferrer">React Toolbox</a>
🔗 <a href="https://onsen.io/react/" target="_blank" rel="noopener noreferrer">Onsen UI</a>

Eventually, I selected Material-UI because it had the most stars on GitHub, a big community, so it looked reliable to me. It was a good choice because I had a good experience using it 👍

That article made me think about creating a library by myself that would look different from the libraries presented there. Plus, I wanted to make my contribution to React and its community because I work with it, and I like this library a lot.

Design ideation process was next. As I am a big fan of Apple and, especially, their design philosophy, an idea came to my mind to create UI components that would look like Apple’s design.

Then, I came up with a name for the project quickly. I combined React and the name of the city, where Apple’s headquarters are based in, called Cupertino. That’s how I’d got React Cupertino 😄

Also, I told my friend Abhi, who was another intern in my team and worked with React, about this project idea and offered him to join me. He agreed, and we started the development.

## Development
We didn’t know how to develop a component library from scratch, and what tools should we use, so the first step was to do a research. I read several articles and tutorials, however, none of them worked 100% for different reasons at that time. So we decided to start developing components and think about bootstrapping and deployment things later.

I haven’t heard about Storybook at that time, so I simply made an app using create-react-app, and we developed the majority of the components there.

Coding components wasn’t that difficult for me. The real two challenges were **the components’ design and the library’s set up**. Let’s talk about each of these challenges in details.

## Design
Neither of us is a designer, and we had to design the components ourselves. It was difficult but fun at the same time. I didn’t even use any of graphics editors. I either used Keynote to prototype components, or I coded components designing them off the top of my head.

### Inspiration
I would like to mention some design works that influenced me when I designed my components:
<img src="https://i.imgur.com/odxp9ok.png" />
<img src="https://i.imgur.com/VSmM3Wm.png" />

## Set up
When I started working on the set up of this project, I hoped that there is something like create-react-app but for creating React libraries. I found several tools: <a href="https://github.com/transitive-bullshit/create-react-library#readme" target="_blank" rel="noopener noreferrer">create-react-library</a> and <a href="https://github.com/insin/nwb" target="_blank" rel="noopener noreferrer">nwb</a>. I tried to use them, but none of them worked for me because my CSS files weren’t exported properly there. My component file structure looked like this:<br />
<img src="https://i.imgur.com/h4O1jbP.jpg" />

It was clear to me that I had to use <a href="https://webpack.js.org/" target="_blank" rel="noopener noreferrer">webpack</a> to bundle my components into a module because this tool would let me configure my project as I want it to work. The only problem was that I hadn’t had any experience with webpack before. I had to learn how to use it and how to configure the project properly.

I watched some tutorials, read some articles about webpack, and I was able to write a config file, which would work almost fine. As you can see from the image above, I keep my CSS styles in a separate file, and for some reason, they weren’t included in the bundle. I tried to find a solution to this problem, but nothing worked.

One of the videos I watched was about developing React component libraries by <a href="https://twitter.com/DavidWells"  target="_blank" rel="noopener noreferrer">David Wells</a>. I decided to reach out to him on Twitter, and he responded to me! He shared a gist file with a webpack configuration for a similar project, and I could figure out how to fix my problem.

Web dev community is amazing 🤩👏 Big thanks to David 🙌

My final version of the webpack config file looked like this:
```javascript
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const packageInfo = require('./package.json');
const outputPath = path.join(__dirname, 'lib');
const srcPath = path.join(__dirname, 'src');
const componentsPath = path.join(srcPath, 'components');
const keepCSSFileReference = true;
const componentExternals = [];
const entryPoints = {
    index: './src/components/index.js'
};
// Assign entry points and externals
fs.readdirSync(componentsPath)
  .filter(x => x !== '.DS_Store' && x !== 'index.js' && !x.match(/\.md/))
  .forEach(component => {
    entryPoints[component] = [`./src/components/${component}`];
    componentExternals.push(`../${component}`);
});
const externals = []
  .concat(Object.keys(packageInfo.dependencies))
  .concat(componentExternals);
module.exports = {
    entry: entryPoints,
    output: {
        path: outputPath,
        filename: '[name]/index.js',
        publicPath: '/dist/',
        library: packageInfo.name,
        libraryTarget: 'commonjs2'
    },
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'lib/index')],
         extensions: ['.js', '.jsx']
    },
    externals,
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new ExtractTextPlugin(
        '[name]/[name].css?[hash]-[chunkhash]-[contenthash]-[name]',  
        {
            disable: false,
            allChunks: true,
            keepCSSFileReference
        }
        ),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ],
module: {
     rules: [
     {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env', '@babel/react']
        },
        include: srcPath
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
      ]
    }
};
```

Also, I used <a href="https://babeljs.io/" target="_blank" rel="noopener noreferrer">Babel</a> to transpile my JS code, <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">Prettier</a> and <a href="https://eslint.org/" target="_blank" rel="noopener noreferrer">ESLint</a> to produce a better code. Later, I came across <a href="https://storybook.js.org/" target="_blank" rel="noopener noreferrer">Storybook</a>, which is a nice tool that helps to develop components in isolation, and I integrated it into the project. I also used Travis CI as my Continuous integration service.

## Components
Here is what React Cupertino components look like as of today:
<img src="https://i.imgur.com/LYjAgxb.png" />

## React Cupertino Documentation
You can learn more about each component and how to install React Cupertino to your project on the documentation website:
🔗 <a href="https://react-cupertino.github.io/" target="_blank" rel="noopener noreferrer">Docs</a>

## React Cupertino Source Code
Did you find a bug? Do you want to contribute? Here is a link to the GitHub repository:
🔗 <a href="https://github.com/react-cupertino/react-cupertino" target="_blank" rel="noopener noreferrer">Docs</a>
