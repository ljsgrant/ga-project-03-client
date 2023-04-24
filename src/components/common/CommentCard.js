import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthenticated } from '../../hooks/useAuthenticated';

import { API } from '../../lib/api';
import { AUTH } from '../../lib/auth';
import { NOTIFY } from '../../lib/notifications';

import ProfilePicture from './ProfilePicture';
import '../../styles/CommentCard.scss';
import blankPic from '../../assets/placeholder-profile-picture.png';

import { CommentLikes } from './CommentLikes';

export default function CommentCard({
  text,
  likes,
  dislikes,
  comments,
  username,
  commentId,
  isDeleted,
  deletedComments,
  setIsContentUpdated,
  setPostsUpdated,
  userId,
  timePosted,
  userData,
  parentCommentId
}) {
  const [isLoggedIn] = useAuthenticated();
  const formInput = useRef(null);
  const [newReplyFormFields, setNewReplyFormFields] = useState({
    text: ''
  });
  const [cloudinaryImageId, setCloudinaryImageId] = useState(null);
  const timestamp = new Date(timePosted).toLocaleString();

  useEffect(() => {
    if (userId && !isDeleted) {
      API.GET(API.ENDPOINTS.singleUser(userId))
        .then(({ data }) => {
          setCloudinaryImageId(data.cloudinaryImageId);
        })
        .catch(({ message, response }) => {
          console.error(message, response);
        });
    } /* eslint-disable-next-line */
  }, [userId]);

  const handleNewReplyChange = (event) => {
    setNewReplyFormFields({ [event.target.name]: event.target.value });
  };

  const handleReplySubmit = (event) => {
    event.preventDefault();
    API.POST(
      API.ENDPOINTS.singleComment(commentId),
      newReplyFormFields,
      API.getHeaders()
    )
      .then(({ data }) => {
        console.log('Posted comment');
        setIsContentUpdated(true);
        NOTIFY.SUCCESS('Posted your reply!');
      })
      .catch((err) => console.error(err));

    setNewReplyFormFields({
      text: ''
    });

    handleFocus();
  };

  function handleFocus() {
    formInput.current.blur();
  }

  const handleDeleteComment = () => {
    API.DELETE(API.ENDPOINTS.singleComment(commentId), API.getHeaders())
      .then(({ data }) => {
        console.log('Deleted comment');
        setIsContentUpdated(true);
        NOTIFY.SUCCESS('Comment was deleted.');
      })
      .catch((err) => console.error(err));
  };

  if (isDeleted && comments?.length === deletedComments?.length) {
    return;
  } else {
    return (
      <div className='CommentCard'>
        <div className='comment-header'>
          <div className='profile-picture-container'>
            {cloudinaryImageId ? (
              <ProfilePicture
                className='profile-picture'
                cloudinaryImageId={cloudinaryImageId}
                imageWidth={30}
                imageHeight={30}
              />
            ) : ( 
              <img src={blankPic} alt='blank profile avatar' />
            )}
          </div>
          {username && (
            <>
              <Link to={`/profile/${userId}`}>
                <p className='username'>{username}</p>
              </Link>
              <p>posted on:</p>
              <p className='timestamp'>{`${timestamp}`}</p>
            </>
          )}{' '}
          {isDeleted && (
            <p className='comment-deleted-text'>(comment deleted)</p>
          )}
        </div>
        <div className='comment-main'>
          {!isDeleted && (
            <div className='comment-content'>
              <p className='comment-text'>{text}</p>
              {username && (
                <p>
                  {/* Likes: {likes}, Dislikes: {dislikes} */}
                  <CommentLikes
                    storedLikes={likes}
                    storedDislikes={dislikes}
                    id={commentId}
                    setIsContentUpdated={setIsContentUpdated}
                    setPostsUpdated={setPostsUpdated}
                    userData={userData}
                    isButtonDisabled={false}
                  />
                </p>
              )}
              {username && isLoggedIn && (
                <div className='comment-actions'>
                  {(AUTH.isOwner(userId) || AUTH.getPayload().isAdmin) && (
                    <button onClick={handleDeleteComment}>Delete</button>
                  )}
                  <form onSubmit={handleReplySubmit}>
                    <label htmlFor='comment-text'> Reply: </label>
                    <input
                      ref={formInput}
                      type='text'
                      id='comment-text'
                      name='text'
                      value={newReplyFormFields.text}
                      onChange={handleNewReplyChange}
                    ></input>
                    <button type='submit'>Post reply</button>
                  </form>
                </div>
              )}
            </div>
          )}
          {comments?.map((comment) => {
            return (
              <CommentCard
                key={comment._id}
                text={comment.text}
                likes={comment.likes}
                dislikes={comment.dislikes}
                comments={comment.comments}
                username={comment.addedBy?.username}
                userId={comment.addedBy?._id}
                isDeleted={comment.isDeleted}
                deletedComments={comment.deletedComments}
                commentId={comment._id}
                timePosted={comment.createdAt}
                setIsContentUpdated={setIsContentUpdated}
              ></CommentCard>
            );
          })}
        </div>
      </div>
    );
  }
}
