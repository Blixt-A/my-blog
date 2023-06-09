import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { postCacheKey, editPost, getPost } from "../../../../api-routes/posts"; 
import { createSlug } from "@/utils/createSlug"

const mockData = {
  title: "Community-Messaging Fit",
  body: "<p>This is a good community fit!</p>",
  image:
    "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/16:9/w_2123,h_1194,c_limit/phonepicutres-TA.jpg",
};
export default function EditBlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: { data: post = {} } = {}, error, isLoading } = useSWR(slug ? `${postCacheKey}${slug}` : null, () => getPost({ slug }));
  const { trigger: editTrigger, isMutating } = useSWRMutation(postCacheKey, editPost, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {    
    const slug = createSlug(titleInput);
    const id = post.id;

    const updatedPost = {
      body: editorContent,
      title: titleInput,
      slug,
      id
    }

    const { error, status } = await editTrigger(updatedPost);

    if (!error) {
      router.push(`/blog/${slug}`) 
     }
  };

  if(isLoading) {
    return "..loading"
  }

  return (
    <BlogEditor
      heading="Edit blog post"
      title={post.title}
      src={post.image}
      alt={post.title}
      content={post.body}
      buttonText="Save changes"
      onSubmit={handleOnSubmit}
    />
  );
}
