import adminPic from '../assets/adminPic.png';

import { Container, Avatar, Box } from '@mui/material';

const DefaultLandingComponent = () => {
  return (
    <Container maxWidth='sm' sx={{ mt: 15 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Avatar
          src={adminPic}
          alt='admin-profile-picture'
          sx={{ width: 250, height: 250, mb: 3 }}
        />
        <Box>
          <h3>
            Hello, I'm the very loved and respected administrator of this forum.
          </h3>
          <p>
            Starting browsing posts by clicking on the post titles on the left.
          </p>
          <p>
            Or make your own post by clicking "Add a New Post" on the sidebar!
          </p>
        </Box>
      </Box>
    </Container>
  );
};

export default DefaultLandingComponent;
