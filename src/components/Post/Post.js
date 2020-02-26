import React from 'react';
import PropTypes from 'prop-types';
import 'prismjs/themes/prism-okaidia.css';
import Headline from '../Article/Headline';
import Bodytext from '../Article/Bodytext';
import Meta from './Meta';
import Author from './Author';
import NextPrev from './NextPrev';

const Post = props => {
  const {
    post,
    post: {
      html,
      htmlAst,
      fields: { prefix, slug },
      frontmatter: { title, author },
      parent: { modifiedTime },
    },
    authornote,
    next: nextPost,
    prev: prevPost,
    theme,
  } = props;

  return (
    <React.Fragment>
      <a href="https://blog.vldmrkl.com/">
        <h1>blog.vldmrkl.com</h1>
      </a>
      <header>
        <Headline title={title} theme={theme} />
        <Meta
          prefix={prefix}
          lastEdit={modifiedTime}
          author={author}
          theme={theme}
        />
      </header>
      <Bodytext content={post} theme={theme} />
      <footer>
        {/*<Author note={authornote} theme={theme} /> */}
        <NextPrev next={nextPost} prev={prevPost} theme={theme} />
      </footer>
      <style jsx>{`
        h1 {
          cursor: pointer;
          margin-bottom: 1em;
        }

        h1:hover {
          color: ${theme.color.brand.primaryDark};
        }
      `}</style>
    </React.Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  authornote: PropTypes.string.isRequired,
  next: PropTypes.object,
  prev: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default Post;
