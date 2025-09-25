import express from "express"
import dotenv from "dotenv"
import { blog } from "../Schema.js";
import authMiddelware from "../Middelware/auth.js";
dotenv.config({ path: '../.env' });

const blogRoute = express.Router();

blogRoute.post("/", authMiddelware, async (req, res) => {   // /blog with post request to create a blog
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) return res.status(400).json({ success: false, message: "title , content , author is required" });

    const userId = req.user.id;
    const createBlog = await blog.create({
      userId,
      title,
      content,
      author,
      createdAt: new Date()
    })

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: createBlog
    });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    res.status(400).json({ error: error.message });
  }
})

blogRoute.get("/", async (req, res) => {
  try {
    const allBlog = await blog.find();                 //.select("-userId -_id");
    res.json({ Success: true, Blog: allBlog });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    res.status(403).json({ error: error.message });
  }
})

blogRoute.patch("/:id", authMiddelware, async (req, res) => {
  try {
    const updateBlog = await blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateBlog) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ Success: true, updatedBlog: updateBlog });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    res.status(403).json({ error: error.message });
  }
})

blogRoute.delete("/:id", authMiddelware, async (req, res) => {
  try {
    const delBlog = await blog.findById(req.params.id);
    if (!delBlog) return res.status(404).json({ Success: false, message: "Not found" });
    await blog.findByIdAndDelete(req.params.id);
    res.json({ Success: true, message: "Deleted successfully" });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);

    res.status(403).json({ error: error.message });
  }
})

export default blogRoute;