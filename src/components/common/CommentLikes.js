import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Button, Box } from '@mui/material';
import { API } from '../../lib/api';

import '../../styles/CommentLikes.scss';

export const CommentLikes = ({
  storedLikes,
  storedDislikes,
  isButtonDisabled,
  setIsContentUpdated,
  setPostsUpdated,
  userData,
  id,
  iconSize,
  padding
}) => {
  const handleLike = async () => {
    API.PUT(
      API.ENDPOINTS.singleComment(id),
      { likeOrDislike: 'like' },
      API.getHeaders()
    )
      .then(({ data }) => {
        setIsContentUpdated(true);
        setPostsUpdated(true);
      })
      .catch((err) => console.error(err));
  };

  const handleDislike = async () => {
    API.PUT(
      API.ENDPOINTS.singleComment(id),
      { likeOrDislike: 'dislike' },
      API.getHeaders()
    )
      .then(({ data }) => {
        setIsContentUpdated(true);
        setPostsUpdated(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box className='CommentLikes'>
      {isButtonDisabled ? (
        <>
          {userData?.likedComments?.includes(id) ? (
            <ThumbUpIcon color='success' sx={{ height: iconSize }} />
          ) : (
            <ThumbUpOutlinedIcon sx={{ height: iconSize }} />
          )}
          {`${storedLikes}`}
          {userData?.dislikedComments?.includes(id) ? (
            <ThumbDownIcon color='error' sx={{ height: iconSize }} />
          ) : (
            <ThumbDownOutlinedIcon sx={{ height: iconSize }} />
          )}
          {`${storedDislikes}`}
        </>
      ) : (
        <>
          <Button
            onClick={handleLike}
            sx={{ pt: padding, pb: padding, pl: padding }}
          >
            {userData?.likedComments?.includes(id) ? (
              <ThumbUpIcon color='success' sx={{ height: iconSize }} />
            ) : (
              <ThumbUpOutlinedIcon sx={{ height: iconSize }} />
            )}
            {`${storedLikes}`}
          </Button>
          <Button
            onClick={handleDislike}
            sx={{ pt: padding, pb: padding, pl: padding }}
          >
            {userData?.dislikedComments?.includes(id) ? (
              <ThumbDownIcon
                className='thumb-down-icon'
                color='error'
                sx={{ height: iconSize }}
              />
            ) : (
              <ThumbDownOutlinedIcon
                className='thumb-down-icon'
                sx={{ height: iconSize }}
              />
            )}
            {`${storedDislikes}`}
          </Button>
        </>
      )}
    </Box>
  );
};
