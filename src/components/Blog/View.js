import React from 'react';
import { FaCog } from 'react-icons/fa/';
import Hero from '../Hero';
import Blog from './Blog.js';
import Pagination from './Pagination';
import { InfiniteScroll } from './InfiniteScroll';
import config from '../../../content/meta/config';
import avatar from '../../images/jpg/avatar.jpg';

/** Template for "home" page with infinite scroll and fallback to pagination. */
class View extends React.Component {
  constructor(props) {
    super(props);
    if (
      props.globalState.isInitializing() ||
      !props.globalState.useInfiniteScroll
    ) {
      props.globalState.updateState({
        items: props.pageContext.initialPosts,
        cursor: props.pageContext.currentPage + 1,
      });
    }
  }

  render() {
    const g = this.props.globalState;
    const pageContext = this.props.pageContext;
    const theme = this.props.theme;
    const items = !g.isInitializing() ? g.items : pageContext.initialPosts;

    return (
      <React.Fragment>
        {/* Blog posts with infinite scroll. */}
        <div className="blog-header">
          <img
            className="logo"
            src={config.gravatarImgMd5 == '' ? avatar : config.gravatarImgMd5}
            alt={config.siteTitle}
          />

          <div className="blog-info">
            <h1>vldmrkl.com</h1>
            <p className="desc">
              A blog about JavaScript, React and Swift by Volodymyr Klymenko, a
              software developer based in Toronto, Ontario.
            </p>
          </div>
        </div>
        <InfiniteScroll
          throttle={300}
          threshold={600}
          isLoading={g.isLoading}
          hasMore={g.hasMore(pageContext)}
          onLoadMore={g.loadMore}
        >
          <Blog posts={items} theme={theme} />
        </InfiniteScroll>

        {/* Loading spinner. */}
        {g.isLoading && (
          <div className="spinner">
            <FaCog />
          </div>
        )}

        {/* Fallback to Pagination for non JS users. */}
        <noscript>
          <style>{`.spinner { display: none !important; }`}</style>
          <Pagination pageContext={pageContext} theme={theme} />
        </noscript>

        {/* Fallback to Pagination on error. */}
        {!g.useInfiniteScroll && (
          <Pagination pageContext={pageContext} theme={theme} />
        )}

        <style jsx>{`
          @keyframes spinner {
            to {
              transform: rotate(360deg);
            }
          }

          .blog-header {
            display: flex;
            margin: 0 auto;
            margin-top: 5%;
            max-width: 700px;
            padding: 0 ${theme.space.inset.default};
          }

          .desc {
            margin-top: 1%;
          }

          .blog-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 5%;

            h1 {
              cursor: pointer;
            }

            h1:hover {
              color: ${theme.color.brand.primaryDark};
            }
          }

          .logo {
            border-radius: 50%;
            object-fit: cover;
            margin: ${theme.space.inline.default};
            height: 5em;
            width: 5em !important;
          }

          .spinner {
            margin-top: 40px;
            font-size: 60px;
            text-align: center;
            display: ${g.useInfiniteScroll ? 'block' : 'none'};

            :global(svg) {
              fill: ${theme.color.brand.primaryLight};
              animation: spinner 3s linear infinite;
            }
          }
        `}</style>
      </React.Fragment>
    );
  }
}

export default View;
