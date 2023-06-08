import { useRouter } from "next/router";
import styles from "./blog-post.module.css";
import Comments from "./partials/comments";
import AddComment from "./partials/add-comment";
import Button from "@components/button";
import Heading from "@components/heading";
import BlogImageBanner from "@components/blog-image-banner";
import useSWR from "swr";
import { getPost, postCacheKey, removePost } from "../../../api-routes/posts";
import useSWRMutation from "swr/mutation";


export default function BlogPost() {
  const router = useRouter();
  const {trigger: deleteTrigger, isMutating} = useSWRMutation(postCacheKey, removePost, {
    onError: (error) => {
      console.log(error)
    }
  })
  /* Use this slug to fetch the post from the database */
  const { slug } = router.query;
  const { data: { data: post = {} } = {}, error } = useSWR(slug ? `${postCacheKey}${slug}` : null, () => getPost({ slug }));

  const handleDeletePost = async (id) => {
    // console.log({ id: data.id });

    const { status, error } = await deleteTrigger(id);
    
    if (!error) {
        router.push("/blog") 
       }
  }

  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };

  console.log(post)

  return (
    <>
      <section className={styles.container}>
        <Heading>{post.title}</Heading>
        {post?.image && <BlogImageBanner src={post.image} alt={post.title} />}
        <div className={styles.dateContainer}>
          <time className={styles.date}>{post.created_at}</time>
          <div className={styles.border} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
        <span className={styles.author}>Author: {post.author}</span>

        {/* The Delete & Edit part should only be showed if you are authenticated and you are the author */}
        <div className={styles.buttonContainer}>
          <Button onClick={handleDeletePost}>Delete</Button>
          <Button onClick={handleEditPost}>Edit</Button>
        </div>
      </section>

      <Comments postId={post.id} />

      {/* This component should only be displayed if a user is authenticated */}
      <AddComment postId={post.id} />
    </>
  );
}