import express from "express"
import dotenv from "dotenv"
import { blog } from "../Schema.js";
import { validate } from '../../../Day12/MiniProject/Validation.js'
import { blogSchema } from '../../../Day12/MiniProject/blogSchema.js'
import authMiddelware from "../Middelware/auth.js";
import logger from "../../../Day17/MinorProject/logger.js";
dotenv.config({ path: '../.env' });

const blogRoute = express.Router();

blogRoute.post("/", authMiddelware, validate(blogSchema), async (req, res) => {   // /blog with post request to create a blog
  try {
    const { title, content, author } = req.body;
    // if (!title || !content || !author) return res.status(400).json({ success: false, message: "title , content , author is required" });

    const userId = req.user.id;
    const createBlog = await blog.create({
      userId,
      title,
      content,
      author,
      createdAt: new Date()
    })
    logger.info('Created new blog post', {
      // postId: createBlog.id,
      title: createBlog.title,
      author: createBlog.author
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: createBlog
    });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    logger.error('Error creating blog post', {
      requestBody: req.body,
      error: error.message
    });
    res.status(400).json({ error: error.message });
  }
})

blogRoute.get("/", async (req, res) => {
  try {
    const allBlog = await blog.find();                 //.select("-userId -_id");
    logger.debug('Retrieved all blog posts', { postCount: allBlog.length });
    res.json({ Success: true, Blog: allBlog });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    logger.error('Error retrieving blog posts', { error: error.message });
    res.status(403).json({ error: error.message });
  }
})

blogRoute.patch("/:id", authMiddelware, async (req, res) => {
  try {
    const updateBlog = await blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateBlog) {
      logger.warn('Blog post not found for update', { postId: req.params.id });
      return res.status(404).json({ error: 'Post not found' });
    }
    logger.info('Updated blog post', {
      postId: updateBlog.id,
      title: updateBlog.title
    });
    res.json({ Success: true, updatedBlog: updateBlog });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    logger.error('Error updating blog post', {
      postId: req.params.id,
      requestBody: req.body,
      error: error.message
    });
    res.status(403).json({ error: error.message });
  }
})

blogRoute.delete("/:id", authMiddelware, async (req, res) => {
  try {
    await blog.findByIdAndDelete(req.params.id);
    logger.info('Deleted blog post', { postId: req.params.id });
    res.json({ Success: true, message: "Deleted successfully" });
  } catch (error) {
    console.log("Error occured in Blog due to : ", error.message);
    logger.error('Error deleting blog post', {
      postId: req.params.id,
      error: error.message
    });
    res.status(403).json({ error: error.message });
  }
})

export default blogRoute;