import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,

      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://enwpgo.wordpress.com/wp-content/uploads/2023/08/one-page-website-header.jpg?w=1200",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    isDraft: {
      type: Boolean,
      default: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    wordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
