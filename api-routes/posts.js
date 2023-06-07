import { supabase } from "../lib/supabaseClient"
export const postCacheKey = "/api/blogs";

export const getPosts = async () => {
  const { data, error, status } = await supabase
  .from('posts')
  .select(`*`)

  return { data, error, status }
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
    .from("posts")
    .select()
    .single()
    .eq("slug", slug)

  return { error, status, data } 
};

export const addPost = async (_, { arg: newPost}) => {

  const { data, error, status } = await supabase
  .from("posts")
  .insert(newPost)
  .select()
  .single()
  
  return { data };
};

export const removePost = async (id) => {

  const { error, status } = await supabase
  .from("post")
  .delete()
  .select()
  .single() //Tar automatiskt bort arrayen och returnerar ett object
  .eq("id", id);

  return { error, status }

  //Handle remove post here
};

export const editPost = () => {
  //Handle edit post here
};
