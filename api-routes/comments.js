import { supabase } from "../lib/supabaseClient"

export const commentsCacheKey = "api/comments";

export const getComments =  async (postId) => {
  const { data, error, status } = await supabase
  .from('comments')
  .select() 
  .eq("post_id", postId ) //Jämför värdet i kolumnen i supabase till det du vill matcha med. 

  return { data, error, status }
  //Handle get all comments
};

export const addComment = async (_, {arg: newComment}) => {
  const { data, error, status } = await supabase
  .from("comments")
  .insert(newComment)
  .select()
  .single()
  .eq("post_id", newComment.postId)
 
  return { data, error, status }
};

export const removeComment = async (_, { arg: id }) => {
  const { data, error, status } = await supabase
  .from("comments")
  .delete(id)
  .single()
  .eq("id", id)

  return {data, error, status}
};



