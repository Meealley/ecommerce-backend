const Blog = require("../Models/BlogModel");
const User = require("../Models/UserModer");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../Utils/ValidateMongoDbID");
const cloudinaryUploadImg = require("../Utils/Cloudinary");
const fs = require("fs");

//POST Create Blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    throw new Error("Couldn't create blog" + error.message);
  }
});

//PUT Update Blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(blog);
  } catch (error) {
    throw new Error("Couldn't update blog" + error.message);
  }
});

//GET Blog by ID
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numView: 1 },
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } catch (error) {
    throw new Error("Couldn't get blog" + error.message);
  }
});

//GET Getting all the blogs
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.find();
    res.json(blog);
  } catch (error) {
    throw new Error("Couldn't get all blog" + error.message);
  }
});

//DELETE Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.json({
      status: `Successfully deleted ${id}`,
    });
  } catch (error) {
    throw new Error("Couldn't delete blog" + error.message);
  }
});

//PUT LIKE Blog
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  //   console.log(blogId);
  validateMongoDbId(blogId);

  //Find the blog which you want to be like
  const blog = await Blog.findById(blogId);

  //Find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isLiked = blog?.isLiked;

  //find the user if they dislike the post blog
  const alreadyDisliked = blog?.dislikes.find(
    (userId) => userId?.userId.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

//PUT DISLIKE Blog
const disLikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  //   console.log(blogId);
  validateMongoDbId(blogId);

  //Find the blog which you want to be like
  const blog = await Blog.findById(blogId);

  //Find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isDisLiked = blog?.isDisLiked;

  //find the user if they dislike the post blog
  const alreadyLiked = blog?.likes.find(
    (userId) => userId?.userId.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

//<================== Uploading blog images =================
const uploadBlogImages = asyncHandler(async (req, res) => {
  //   console.log(req.files);

  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];

    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error("Could not upload blog images " + error.message);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadBlogImages,
};
