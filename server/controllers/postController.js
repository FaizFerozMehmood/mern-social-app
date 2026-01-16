import Post from "../models/postModel.js"


export const controlPost = async(req,res)=>{
    try {
        const {postMessage,selectedFile} = req.body
        console.log(req.body)
        const createPost = await new Post({
            postMessage,
            selectedFile,
            userId : req.user.id
        })
        await createPost.save()
        return res.status(201).json({message:"post Created...!",createPost})
    
        
    } catch (error) {
        console.log("error in post controller.....",error.message)
        return res.status(500).json({message:"error in post controller...",error:error.message})
    }
}
export const getPosts = async(req,res)=>{
    try {
        const posts = await Post.find();
        if(!posts){
            return res.status(404).json({message:"eror getting posts"})
        }
        return res.status(200).json({message:"Posts fetched..!",posts})
    } catch (error) {
      return  res.status(500).json({message:"error getting post..!",error:error.message})
    }
}