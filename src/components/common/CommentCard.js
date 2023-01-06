import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../lib/api';
import ProfilePicture from './ProfilePicture';
import '../../styles/CommentCard.scss';
import blankPic from '../../assets/placeholder-profile-picture.png';

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
  userId,
  parentCommentId
}) {
  const formInput = useRef(null);
  const [newReplyFormFields, setNewReplyFormFields] = useState({
    text: ''
  });
  const [cloudinaryImageId, setCloudinaryImageId] = useState(null);

  useEffect(() => {
    if (userId && !isDeleted) {
      API.GET(API.ENDPOINTS.singleUser(userId))
        .then(({ data }) => {
          setCloudinaryImageId(data.cloudinaryImageId);
        })
        .catch(({ message, response }) => {
          console.error(message, response);
        });
    }
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
        console.log(data);
        console.log('Posted comment');
        setIsContentUpdated(true);
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
        console.log(data);
        console.log('Deleted comment');
        setIsContentUpdated(true);
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
              />
            ) : (
              <img src={blankPic} alt='blank profile picture' />
            )}
          </div>
          {username && <p>{username}</p>}
        </div>
        <div
          className={`${isDeleted ? 'comment-main deleted' : 'comment-main'}`}
        >
          <div className='comment-content'>
            {!isDeleted ? (
              <p className='comment-text'>{text}</p>
            ) : (
              <p>
                <em>(comment deleted)</em>
              </p>
            )}
            {username && (
              <p>
                Likes: {likes}, Dislikes: {dislikes}
              </p>
            )}
            {username && (
              <div className='comment-actions'>
                <button onClick={handleDeleteComment}>Delete</button>
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
                setIsContentUpdated={setIsContentUpdated}
              ></CommentCard>
            );
          })}
        </div>
      </div>
    );
  }
}
