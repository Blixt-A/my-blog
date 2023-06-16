import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import { addPost, postCacheKey } from "../../api-routes/posts";
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";
import { useUser } from "@supabase/auth-helpers-react"; 

export default function CreatePost() {
  const router = useRouter();
  const {trigger: addTrigger, isMutating} = useSWRMutation(postCacheKey, addPost, {
    onError: (error) => {
      console.log(error)
    }
  })

  const user = useUser();

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);
    const newPost = {
      body: editorContent,
      title: titleInput,
      slug,
      user_id: user.id,
      image,
    };

    const { status, error } = await addTrigger(newPost);
    if (!error) {
     router.push(`/blog/${slug}`) 
    }
  };
  
  return (
    <>
      <BlogEditor
        heading="Create post"
        onSubmit={handleOnSubmit}
        buttonText="Upload post"
      />
    </>
  );
}
