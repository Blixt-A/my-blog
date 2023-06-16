import Button from "@components/button";
import styles from "./comment.module.css";
import { commentsCacheKey, removeComment } from "../../../../../api-routes/comments";
import useSWRMutation from "swr/mutation"

export default function Comment({ comment, createdAt, author, id }) {
  
  const { trigger: removeTrigger, isMutating } = useSWRMutation(commentsCacheKey, removeComment, {
    onError: (error) => {
      console.log(error)
    }
  })
  
  const handleDelete = async (removeComment) => {
    console.log({ id });

    const {data, error} = await removeTrigger(id)
  };

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>

      {/* The Delete part should only be showed if you are authenticated and you are the author */}
      <div className={styles.buttonContainer}>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}
