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