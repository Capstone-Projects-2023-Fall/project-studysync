import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import './ProfileStyles.css';

// import Markdown from './Markdown';

function Main(props) {
  const { userDescription, title } = props;

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      <div className='user-about'>
        {userDescription.bio && <div className='bio'>Bio: {userDescription.bio}</div>}
        {userDescription.email && <div className='email'>Email: {userDescription.email}</div>}
        {userDescription.phone && <div className='phone'>Phone: {userDescription.phone}</div>}
      </div>
      
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;