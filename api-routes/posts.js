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

export const removePost = async (_, {arg: id}) => {

  const { data, error, status } = await supabase
  .from("posts")
  .delete()
  .eq("id", id);
  
  return { error, status, data }
};

export const editPost = async (_, { arg: updatedPost }) => {
  const { data, error, status } = await supabase
  .from("posts")
  .update(updatedPost)
  .select()
  .single()
  .eq("id", updatedPost.id);
  console.log(error)

  return { error, status, data };
};
