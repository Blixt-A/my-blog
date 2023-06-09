import styles from "./comments.module.css";
import Comment from "../comment";
import useSWR from "swr";
import { getComments, commentsCacheKey } from "../../../../../api-routes/comments";

const mockData = [
  {
    id: "1",
    comment: "Love this post!",
    createdAt: "2022-02-15",
    author: "John Doe",
  },
  {
    id: "2",
    comment: "This is indeed a good community fit!",
    createdAt: "2022-02-12",
    author: "Jane Doe",
  },
];

export default function Comments({ postId }) {
  console.log(postId)
  
  const { 
    data: { data = [] } = {}, 
  } = useSWR(
    postId ? commentsCacheKey : null, 
    () => getComments(postId)
  );

  return (
    <div className={styles.container}>
      <h2>Comments</h2>
      {data.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
