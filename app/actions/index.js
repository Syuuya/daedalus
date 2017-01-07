import PropTypes from 'prop-types';
import defineActions from './lib/actions';

export default defineActions({
  login: {
    email: PropTypes.string.isRequired,
    passwordHash: PropTypes.string.isRequired,
  },
}, PropTypes.validateWithErrors);