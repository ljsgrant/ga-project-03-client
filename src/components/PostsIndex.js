import { useEffect, useState } from 'react';
import { NOTIFY } from '../lib/notifications';
import { API } from '../lib/api';
import { DisplayPost } from './DisplayPost';
import { AUTH } from '../lib/auth';

import { DisplayAllPosts } from './DisplayAllPosts';
import DefaultLandingComponent from './DefaultLandingComponent';

import { Box, Button } from '@mui/material';

import '../styles/PostsIndex.scss';

export default function PostsIndex() {
  const [posts, setPosts] = useState(null);
  const [id, setId] = useState(null);
  const [postsUpdated, setPostsUpdated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    API.GET(API.ENDPOINTS.allPosts)
      .then(({ data }) => {
        setPosts(data);
      })
      .catch(({ message, response }) => {
        NOTIFY.ERROR(message);
        console.error(message, response);
      });

    if (AUTH.getPayload().userId) {
      API.GET(API.ENDPOINTS.singleUser(AUTH.getPayload().userId))
        .then(({ data }) => {
          setUserData(data);
        })
        .catch(({ message, response }) => {
          NOTIFY.ERROR(message);
          console.error(message, response);
        });
    }
    setPostsUpdated(false);
  }, [postsUpdated]);

  const sortNewestFirst = () => {};

  const sortOldestFirst = () => {};

  const selectedId = (postId) => {
    setId(postId);
  };

  return (
    <div
      className='PostsIndex'
    >
      <div className='grid-left'>
        <>
          <Box>
            <Button onClick={sortNewestFirst}>Sort by newest first</Button>
            <Button onClick={sortOldestFirst}>Sort by oldest first</Button>
          </Box>
          {posts?.map((post) => (
            <DisplayAllPosts
              key={post._id}
              post={post}
              selectedId={selectedId}
              postingTime={post.createdAt}
              setPostsUpdated={setPostsUpdated}
              userData={userData}
            />
          ))}
        </>
      </div>
      <div
        className='grid-right'
        // container
        // spacing={4}
        // columns={1}
        // sx={{ marginLeft: '12px', marginTop: '20px', width: '50%' }}
      >
        {id ? (
          <DisplayPost
            id={id}
            setPostsUpdated={setPostsUpdated}
            userData={userData}
          />
        ) : (
          <DefaultLandingComponent />
        )}
      </div>
    </div>
  );
}
