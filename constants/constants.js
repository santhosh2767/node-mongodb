const STATUS_MESSAGE = {
    MSG_REGISTER_SUCCESS: "User registered successfully",
    MSG_ALREADY_REGISTER: "User already registered",
    MSG_LOGIN_SUCCESS: "Login successfully",
    MSG_INVALID_CREDENTIALS: "Invalid username or password",
    MSG_PROFILE_UPLOAD_SUCCESS: "Profile picture uploaded successfully",
    MSG_PROFILE_UPLOAD_FAIL: "Failed to upload profile picture",
    MSG_CONTENT_SAVED: "Post saved successfully",
    MSG_POST_DELETED: "Post deleted successfully",
    MSG_POST_RESTORE: "Post Restore successfully",
    MSG_POST_NOT_FOUND: "Post not found",
    MSG_POST_FOUND: "Post found",
    MSG_POST_UPDATED: "Post Updated",
    MSG_USER_NOT_REGISTERED: "User yet to register",
    MSG_USER_NOT_FOUND : "  User not found",
    MSG_USER_FOUND : "User found",
    MSG_USERS_FOUND : "Users found",
    MSG_USER_DELETED : "User deleted successfully",
    MSG_USER_RESTORE : "User restore successfully",
    MSG_USER_NOT_AUTH: "You are not authorized",
    MSG_COMMENT_UNDELETE: "comment undeleted successfully",
    MSG_COMMENT_DELETE: "comment deleted successfully",
    MSG_COMMENT_UPDATE: "comment updated successfully",
    MSG_COMMENT_ADD: "Comment added successfully",
    MSG_COMMENT_NOT_FOUND : "Comment not found",
    MSG_COMMENT_CONTENT_REQ : "Comment content required",
    MSG_POST_LIKED: "Post liked successfully",
    MSG_POST_DISLIKED:"Post disliked successfully",
    MSG_LIKED_POST:" liked post found successfully",
    MSG_NO_LIKED_POST:"Users Yet to like post"
}

const COLLECTIONS = {
    USER :"User",
    POST :"Post",
    LIKE:"Like",
    COMMENT:"Comment"
}



module.exports = {STATUS_MESSAGE,COLLECTIONS};