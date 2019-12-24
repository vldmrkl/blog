import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { currDate } from '../../utils/helpers';
import { FaUser, FaCalendar } from 'react-icons/fa/';

const Meta = props => {
  const { theme, prefix } = props;

  const dateFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = new Date(prefix || currDate()).toLocaleDateString(
    'en-US',
    dateFormatOptions,
  );

  return (
    <p className="meta">
      {formattedDate}

      {/* --- STYLES --- */}
      <style jsx>{`
        .meta {
          display: flex;
          flex-flow: row wrap;
          font-size: 0.8em;
          margin: ${theme.space.m} 0;
          background: transparent;
          color: ${theme.color.neutral.gray.j};
        }
      `}</style>
    </p>
  );
};

Meta.propTypes = {
  theme: PropTypes.object.isRequired,
  prefix: PropTypes.Date,
};

export default Meta;
