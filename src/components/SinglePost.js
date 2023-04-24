import { useParams } from 'react-router-dom';

import '../styles/SinglePost.scss';
import { DisplayPost } from './DisplayPost';

export const SinglePost = () => {
  const { id } = useParams();

  return <DisplayPost id={id}></DisplayPost>;
};
