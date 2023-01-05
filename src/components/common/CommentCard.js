import { API } from '../../lib/api';
import '../../styles/CommentCard.scss';

export default function CommentCard({
  text,
  likes,
  dislikes,
  comments,
  username,
  commentId
}) {
  const handleDeleteComment = () => {
    API.DELETE(API.ENDPOINTS.singleComment(commentId), API.getHeaders())
      .then(({ data }) => {
        console.log(data);
        console.log('Deleted review');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className='CommentCard'>
      <div className='comment-header'>
        <div className='profile-picture'></div>
        <p>{username}</p>
      </div>
      <div className='comment-main'>
        <div className='comment-content'>
          <p>{text}</p>
          <p>
            Likes: {likes}, Dislikes: {dislikes}
          </p>
          <button onClick={handleDeleteComment}>Delete</button>
        </div>
        {comments?.map((comment) => {
          return (
            <CommentCard
              key={comment._id}
              text={comment.text}
              likes={comment.likes}
              dislikes={comment.dislikes}
              comments={comment.comments}
              username={comment.addedBy.username}
            ></CommentCard>
          );
        })}
      </div>
    </div>
  );
}