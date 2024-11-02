import { Button, Modal, Table, Checkbox, Select, Alert } from "flowbite-react";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import {
  HiOutlineExclamationCircle,
  HiCheck,
  HiCheckCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showmore, setShowMore] = useState(true);
  const [showModalDel, setshowModalDel] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [checkAll, setCheckAll] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [showModalAction, setShowModalAction] = useState(false);
  const [selectedComments, setSelectedComments] = useState("");
  const [notification, setNotification] = useState(false);

  //Fetch all comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);
  //Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getpost`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, []);
  //Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteComment = async (commentId) => {
    setshowModalDel(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/approveComments/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, isApproved: true }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleActionSubmit = async () => {
    if (selectedAction === "approve") {
      for (const commentId of selectedComments) {
        await handleApproveComment(commentId);
      }
    } else if (selectedAction === "delete") {
      for (const commentId of selectedComments) {
        await handleDeleteComment(commentId);
      }
    }
    setSelectedComments([]);
    setCheckAll(false);
    displayNotification();
  };

  const displayNotification = () => {
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 1500);
  };

  const handleCheckboxChange = (commentId) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleCheckAll = () => {
    if (checkAll) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment) => comment._id));
    }
    setCheckAll(!checkAll);
  };

  const postIdToDetailsMap = posts.reduce((acc, post) => {
    acc[post._id] = { title: post.title, slug: post.slug };
    return acc;
  }, {});

  const userIdToDetailsMap = users.reduce((acc, user) => {
    acc[user._id] = { name: user.username, email: user.email };
    return acc;
  }, {});

  return (
    <div className="md:mx-auto  flex-col items-center mt-3 overflow-x-scroll">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex justify-between items-center mb-4 transition duration-150 ease-in-out ${
                  selectedComments.length > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <Select
                  label="Select Action"
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="">Select Action</option>
                  <option value="approve">Approve</option>
                  <option value="delete">Delete</option>
                </Select>
                <Button onClick={() => setShowModalAction(true)}>Submit</Button>
              </div>
            </div>
            <Alert
              color=""
              icon={HiCheckCircle}
              className={`font-semibold mx-6 rounded-full text-md p-3 bg-green-400 text-green-900 z-50 transition duration-150 ease-in-out ${
                notification ? "opacity-100" : "opacity-0"
              }`}
            >
              <span>Successful!</span>
            </Alert>
          </div>
          <div className="max-h-[72vh] overflow-y-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 rounded-lg">
            <Table hoverable className=" table-auto shadow-md ">
              <Table.Head className="text-center sticky top-0 z-10">
                <Table.HeadCell>
                  <Checkbox checked={checkAll} onChange={handleCheckAll} />
                </Table.HeadCell>
                <Table.HeadCell className="">Comment</Table.HeadCell>
                <Table.HeadCell className="">Post</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
                <Table.HeadCell>User</Table.HeadCell>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>Approved</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y text-center">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="">
                      <Checkbox
                        checked={selectedComments.includes(comment._id)}
                        onChange={() => handleCheckboxChange(comment._id)}
                      />
                    </Table.Cell>
                    <Table.Cell className="font-semibold italic">
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell className="">
                      <Link
                        to={`/post/${postIdToDetailsMap[comment.postId]?.slug}`}
                        className="font-medium text-teal-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {postIdToDetailsMap[comment.postId]?.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-bold">{comment.numberOfLikes}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <span className="font-medium">Username: </span>
                          <span className="font-medium">
                            {userIdToDetailsMap[comment.userId]?.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium">Email: </span>
                          <span className="font-medium">
                            {userIdToDetailsMap[comment.userId]?.email}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <span className="font-medium self-center">
                        {comment.isApproved ? (
                          <Button
                            color="success"
                            size="xs"
                            pill
                            className="cursor-default transition-none"
                            as="span"
                          >
                            Approved
                          </Button>
                        ) : (
                          <div className="flex flex-row gap-2">
                            <Button
                              onClick={() => {
                                handleApproveComment(comment._id);
                                displayNotification();
                              }}
                              color="success"
                              size="xs"
                              outline
                              pill
                            >
                              Approve
                            </Button>
                          </div>
                        )}
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <Button
                        onClick={() => {
                          setshowModalDel(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="text-center font-medium  "
                        size="xs"
                        pill
                        outline
                        color="failure"
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </>
      ) : (
        <p>You have no posts yet</p>
      )}
      <Modal
        show={showModalDel}
        onClose={() => setshowModalDel(false)}
        popup
        size="md"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4 ">
              <Button
                color="failure"
                onClick={() => {
                  handleDeleteComment(commentIdToDelete);
                  displayNotification();
                }}
              >
                Yes, I am sure
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  setshowModalDel(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showModalAction}
        onClose={() => setShowModalAction(false)}
        popup
        size="md"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              {`Are you sure you want to ${selectedAction} ${selectedComments.length} comments?`}
            </h3>
            <div className="flex justify-center gap-4 ">
              <Button
                color="failure"
                onClick={() => {
                  handleActionSubmit();
                  setShowModalAction(false);
                }}
              >
                Yes, I am sure
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => setShowModalAction(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
