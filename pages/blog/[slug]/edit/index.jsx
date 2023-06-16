import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";

import { getPost, postsCacheKey } from "@/api-routes/posts";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { createSlug } from "../../../../utils/createSlug";
import { editPost } from "../../../../api-routes/posts";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function EditBlogPost() {
  const router = useRouter();
  
  const { slug } = router.query;
  const {
    data: { data: post = {} } = {},
    error,
    isLoading,
  } = useSWR(slug ? `${postsCacheKey}${slug}` : null, () => getPost({ slug }));
  const { trigger: editPostTrigger } = useSWRMutation(
    `${postsCacheKey}${slug}`,
    editPost
  );

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const updatedSlug = createSlug(titleInput);

    const updatedPost = {
      id: post.id,
      body: editorContent,
      title: titleInput,
      slug: updatedSlug,
      image,
    };

    const { data, error } = await editPostTrigger(updatedPost);
    console.log({ data, error });

    if(!error) {
      router.push(`/blog/${updatedSlug}`)
    }
  };

  if (isLoading) {
    return "...loading";
  }

  return (
    <BlogEditor
      heading="Edit blog post"
      title={post?.title}
      src={post?.image}
      alt={post?.title}
      content={post?.body}
      buttonText="Save changes"
      onSubmit={handleOnSubmit}
    />
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);
  const { slug } = ctx.params;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("posts")
    .select()
    .single()
    .eq("slug", slug);

  const isAuthor = data.user_id === session.user.id;

  if (!isAuthor) {
    return {
      redirect: {
        destination: `/blog/${slug}`,
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};