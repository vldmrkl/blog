import React from 'react';
import PropTypes from 'prop-types';
import { graphql, useStaticQuery } from 'gatsby';

const Footer = props => {
  const { theme } = props;
  const buildTime = useStaticQuery(query).site.buildTime;

  return (
    <React.Fragment>
      <footer className="footer">
        <a
          href="https://www.github.com/klymenkoo/blog/"
          target="_blank"
          rel="noopener noreferrer"
        >
          This blog is open source. Last updated: {buildTime}.
        </a>
      </footer>

      {/* --- STYLES --- */}
      <style jsx>{`
        .footer {
          background: ${theme.color.neutral.white};
          padding: ${theme.space.inset.default};
          text-align: center;
          color: ${theme.color.neutral.gray.g};
          font-size: ${theme.font.size.xxs};
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 60px;

          a:hover {
            color: ${theme.color.brand.primary};
            font-weight: bold;
            text-decoration: underline;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default Footer;

const query = graphql`
  query Info {
    site {
      buildTime(formatString: "DD.MM.YYYY HH:mm")
    }
  }
`;
