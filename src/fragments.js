/* eslint-disable */

// Intent behind this file is to prevent hidden dependencies.
// Put fragments here in cases you have to use the same query fragment
// in several different queries. This way you can't accidentally
// modify queries in a way that they become inconsistent.

const blogPostTeaserFields = `
    edges {
        node {
            id
            excerpt
            fields {
                slug
                prefix
                source
            }
            frontmatter {
                title
                cover {
                    children {
                        ... on ImageSharp {
                            fluid(maxWidth: 800, maxHeight: 360, cropFocus: CENTER, quality: 90) {
                                aspectRatio
                                src
                                srcSet
                                srcWebp
                                srcSetWebp
                                sizes
                            }
                        }
                    }
                }
            }
        }
    }
`;

const blogPostSort = `
    sort: { fields: [fields___prefix, fields___slug] order: DESC }
`;

module.exports = {
  blogPostTeaserFields: blogPostTeaserFields,
  blogPostSort: blogPostSort,
};
