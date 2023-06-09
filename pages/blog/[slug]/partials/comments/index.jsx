import styles from "./comments.module.css";
import Comment from "../comment";
import useSWR from "swr";
import { getComments, commentsCacheKey } from "../../../../../api-routes/comments";

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