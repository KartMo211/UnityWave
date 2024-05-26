import db from "../dbConnect.js";

//Creating a post
export const createPost = async (req,res) =>{
    try{
        const {userId, description, picturePath} = req.body;

        await db.query("INSERT INTO post(userid,description,picturepath) VALUES($1,$2,$3)", [userId,description,picturePath]);

        const result = await db.query("SELECT * FROM post");
        const post = result.rows;

        res.status(201).json(post);
    }
    catch(err){
        res.status(409).json({message: err.message});
    }
}

//Read all the posts
export const getFeedPosts  = async(req,res) =>{
    try{
        const result = await db.query("SELECT * FROM post");
        const post = result.rows;

        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({message: err.message});
    }
}

export const getUserPosts = async (req,res) =>{
    try{
        const {userId} = req.params;
        const result = await db.query("SELECT * FROM post WHERE userid = $1",[userId]);
        const post = result.rows;

        res.status(201).json(post);
    }
    catch(err){
        res.status(409).json({message: err.message});
    }
}

//UPDATE
export const likePost = async (req,res) =>{
    try{

        const {id} = req.params;
        const {userId} = req.body;

        //check if it is liked and then return the likes
        const result = await db.query("SELECT * from likes WHERE post_id = $1 AND userid = $2",[id,userId]);

        if(result.rows.length==1){
            await db.query("DELETE FROM likes WHERE post_id = $1 and userid = $2",[id,userId]);
        }
        else{
            await db.query("INSERT INTO likes VALUES($1,$2)",[id,userId]);
        }

        const likes = await db.query("SELECT * FROM likes WHERE userid = $1",[userId]);

        res.status(201).json(likes.rows);
    }
    catch(err){
        res.status(409).json({message: err.message});
    }
}