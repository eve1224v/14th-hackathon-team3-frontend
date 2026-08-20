import {
  useEffect,
  useState,
} from "react";

import styles from "./IssueCommentPanel.module.css";

import calendarIcon3 from "../../../../assets/icons/calendarIcon3.svg";
import commentIcon2 from "../../../../assets/icons/commentIcon2.svg";
import sparkleIcon from "../../../../assets/icons/sparkleIcon.svg";

import {
  createIssueComment,
  deleteIssueComment,
  getIssueComments,
  updateIssueComment,
} from "../../../../api/issueApi";


/* ==================================================
   댓글 시간
================================================== */

const formatCommentTime = (
  dateString
) => {
  if (!dateString) {
    return "";
  }


  const date =
    new Date(
      dateString
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return date.toLocaleTimeString(
    "ko-KR",
    {
      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    }
  );
};


/* ==================================================
   댓글 날짜
================================================== */

const formatCommentDate = (
  dateString
) => {
  if (!dateString) {
    return "";
  }


  const date =
    new Date(
      dateString
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return `${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;
};


function IssueCommentPanel({
  issue,
  onClose,
  onDetail,
  onCommentCountChange,
}) {
  const [
    commentText,
    setCommentText,
  ] = useState("");


  const [
    comments,
    setComments,
  ] = useState([]);


  const [
    isCommentLoading,
    setIsCommentLoading,
  ] = useState(true);


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const [
    commentError,
    setCommentError,
  ] = useState("");


  const [
    openMenuId,
    setOpenMenuId,
  ] = useState(null);


  const [
    editingCommentId,
    setEditingCommentId,
  ] = useState(null);


  const [
    editingContent,
    setEditingContent,
  ] = useState("");


  const [
    isEditing,
    setIsEditing,
  ] = useState(false);


  const [
    deletingCommentId,
    setDeletingCommentId,
  ] = useState(null);


  const issueId =
    issue?.issueId ??
    issue?.id;


  /* ==================================================
     최초 댓글 목록 조회
  ================================================== */

  useEffect(() => {
    if (!issueId) {
      return undefined;
    }


    let cancelled =
      false;


    getIssueComments(
      issueId
    )
      .then(
        (
          response
        ) => {
          if (cancelled) {
            return;
          }


          console.log(
            "댓글 목록 조회 성공:",
            response
          );


          const commentList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          setComments(
            commentList
          );


          setCommentError(
            ""
          );


          setIsCommentLoading(
            false
          );


          /* =========================
             카드 댓글 개수 동기화
          ========================= */

          onCommentCountChange?.(
            issueId,
            commentList.length
          );
        }
      )
      .catch(
        (
          error
        ) => {
          if (cancelled) {
            return;
          }


          console.error(
            "댓글 목록 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          if (
            responseData?.code ===
            "404ISSUE"
          ) {
            setCommentError(
              "존재하지 않는 이슈입니다."
            );
          } else {
            setCommentError(
              responseData?.message ||
                "댓글을 불러오지 못했습니다."
            );
          }


          setComments(
            []
          );


          setIsCommentLoading(
            false
          );
        }
      );


    return () => {
      cancelled =
        true;
    };
  }, [
    issueId,
    onCommentCountChange,
  ]);


  /* ==================================================
     댓글 목록 재조회

     작성 / 삭제 후 사용
  ================================================== */

  const reloadComments =
    async () => {
      if (!issueId) {
        return;
      }


      const response =
        await getIssueComments(
          issueId
        );


      console.log(
        "댓글 목록 재조회 성공:",
        response
      );


      const commentList =
        Array.isArray(
          response?.data
        )
          ? response.data
          : [];


      setComments(
        commentList
      );


      setCommentError(
        ""
      );


      /* =========================
         카드의 commentCount도
         서버 댓글 개수와 즉시 동기화
      ========================= */

      onCommentCountChange?.(
        issueId,
        commentList.length
      );
    };


  /* ==================================================
     댓글 작성
  ================================================== */

  const handleSubmit =
    async () => {
      if (
        isSubmitting
      ) {
        return;
      }


      const content =
        commentText.trim();


      if (!content) {
        alert(
          "댓글 내용을 입력해주세요."
        );


        return;
      }


      if (
        content.length >
        2000
      ) {
        alert(
          "댓글은 2000자를 넘을 수 없습니다."
        );


        return;
      }


      if (!issueId) {
        return;
      }


      try {
        setIsSubmitting(
          true
        );


        const response =
          await createIssueComment(
            issueId,
            content
          );


        console.log(
          "댓글 작성 성공:",
          response
        );


        setCommentText(
          ""
        );


        /*
          서버 댓글 목록 재조회
          ↓
          패널 댓글 수 갱신
          ↓
          카드 commentCount도 갱신
        */

        await reloadComments();
      } catch (error) {
        console.error(
          "댓글 작성 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );


        const responseData =
          error.response?.data;


        if (
          responseData?.code ===
          "400COMMENT"
        ) {
          alert(
            responseData.message ||
              "댓글 내용을 확인해주세요."
          );


          return;
        }


        if (
          responseData?.code ===
          "403COMMENT"
        ) {
          alert(
            responseData.message ||
              "프로젝트 멤버만 댓글을 남길 수 있습니다."
          );


          return;
        }


        if (
          responseData?.code ===
          "404ISSUE"
        ) {
          alert(
            responseData.message ||
              "존재하지 않는 이슈입니다."
          );


          return;
        }


        alert(
          responseData?.message ||
            "댓글 작성에 실패했습니다."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };


  /* =========================
     Enter 전송
  ========================= */

  const handleKeyDown =
    (
      event
    ) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();


        handleSubmit();
      }
    };


  /* =========================
     ... 메뉴
  ========================= */

  const handleMenuClick =
    (
      commentId
    ) => {
      setOpenMenuId(
        (
          prev
        ) =>
          prev ===
          commentId
            ? null
            : commentId
      );
    };


  /* =========================
     수정 시작
  ========================= */

  const handleStartEdit =
    (
      comment
    ) => {
      setEditingCommentId(
        comment.commentId
      );


      setEditingContent(
        comment.content
      );


      setOpenMenuId(
        null
      );
    };


  /* =========================
     수정 취소
  ========================= */

  const handleCancelEdit =
    () => {
      if (isEditing) {
        return;
      }


      setEditingCommentId(
        null
      );


      setEditingContent(
        ""
      );
    };


  /* ==================================================
     댓글 수정
  ================================================== */

  const handleSaveEdit =
    async (
      commentId
    ) => {
      if (isEditing) {
        return;
      }


      const content =
        editingContent.trim();


      if (!content) {
        alert(
          "댓글 내용을 입력해주세요."
        );


        return;
      }


      if (
        content.length >
        2000
      ) {
        alert(
          "댓글은 2000자를 넘을 수 없습니다."
        );


        return;
      }


      try {
        setIsEditing(
          true
        );


        const response =
          await updateIssueComment(
            commentId,
            content
          );


        console.log(
          "댓글 수정 성공:",
          response
        );


        const updatedComment =
          response?.data;


        if (
          updatedComment
            ?.commentId
        ) {
          setComments(
            (
              prev
            ) =>
              prev.map(
                (
                  comment
                ) =>
                  Number(
                    comment.commentId
                  ) ===
                  Number(
                    updatedComment.commentId
                  )
                    ? updatedComment
                    : comment
              )
          );
        } else {
          await reloadComments();
        }


        setEditingCommentId(
          null
        );


        setEditingContent(
          ""
        );
      } catch (error) {
        console.error(
          "댓글 수정 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );


        alert(
          error.response?.data
            ?.message ||
            "댓글 수정에 실패했습니다."
        );
      } finally {
        setIsEditing(
          false
        );
      }
    };


  /* ==================================================
     댓글 삭제
  ================================================== */

  const handleDeleteComment =
    async (
      commentId
    ) => {
      if (
        deletingCommentId
      ) {
        return;
      }


      setOpenMenuId(
        null
      );


      const confirmed =
        window.confirm(
          "댓글을 삭제하시겠습니까?"
        );


      if (!confirmed) {
        return;
      }


      try {
        setDeletingCommentId(
          commentId
        );


        const response =
          await deleteIssueComment(
            commentId
          );


        console.log(
          "댓글 삭제 성공:",
          response
        );


        /*
          삭제 후 목록 재조회

          여기서 comments.length 감소
          + 카드 commentCount도 바로 감소
        */

        await reloadComments();


        if (
          editingCommentId ===
          commentId
        ) {
          setEditingCommentId(
            null
          );


          setEditingContent(
            ""
          );
        }
      } catch (error) {
        console.error(
          "댓글 삭제 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );


        const responseData =
          error.response?.data;


        if (
          responseData?.code ===
          "403COMMENT"
        ) {
          alert(
            responseData.message ||
              "본인이 작성한 댓글만 삭제할 수 있습니다."
          );


          return;
        }


        if (
          responseData?.code ===
          "404COMMENT"
        ) {
          alert(
            responseData.message ||
              "존재하지 않는 댓글입니다."
          );


          await reloadComments();


          return;
        }


        alert(
          responseData?.message ||
            "댓글 삭제에 실패했습니다."
        );
      } finally {
        setDeletingCommentId(
          null
        );
      }
    };


  if (!issue) {
    return null;
  }


  const commentDate =
    comments.length > 0
      ? formatCommentDate(
          comments[0]
            .createdAt
        )
      : "";


  return (
    <aside
      className={
        styles.panel
      }
    >
      {/* 닫기 */}

      {onClose && (
        <button
          type="button"
          className={
            styles.closeButton
          }
          onClick={
            onClose
          }
          aria-label="닫기"
        >
          ×
        </button>
      )}


      {/* ==================================================
          이슈 정보
      ================================================== */}

      <div
        className={
          styles.issueInfo
        }
      >
        <h2
          className={
            styles.title
          }
        >
          {issue.title ||
            "제목 없음"}
        </h2>


        <p
          className={
            styles.description
          }
        >
          {issue.description ||
            "등록된 이슈 설명이 없습니다."}
        </p>


        <span
          className={
            styles.priority
          }
        >
          {issue.priority ||
            "-"}
        </span>


        <div
          className={
            styles.assignee
          }
        >
          <div
            className={
              styles.assigneeAvatar
            }
          />


          <div
            className={
              styles.assigneeText
            }
          >
            <strong>
              {issue.manager ||
                "담당자 없음"}
            </strong>


            {issue.role && (
              <span>
                {
                  issue.role
                }
              </span>
            )}
          </div>
        </div>


        <div
          className={`${styles.dueDate} ${
            issue.delayed
              ? styles.delayed
              : ""
          }`}
        >
          <img
            src={
              calendarIcon3
            }
            alt=""
          />


          <span>
            {issue.date ||
              "-"}
          </span>
        </div>


        <div
          className={
            styles.aiBox
          }
        >
          <div
            className={
              styles.aiTitle
            }
          >
            <img
              src={
                sparkleIcon
              }
              alt=""
            />


            <strong>
              AI 감지
            </strong>
          </div>


          <span>
            추가 자료 요청 필요
          </span>
        </div>
      </div>


      {/* ==================================================
          댓글
      ================================================== */}

      <div
        className={
          styles.commentSection
        }
      >
        <div
          className={
            styles.commentTitle
          }
        >
          <img
            src={
              commentIcon2
            }
            alt=""
          />


          <span>
            댓글{" "}
            {
              comments.length
            }
          </span>
        </div>


        {commentDate && (
          <span
            className={
              styles.commentDate
            }
          >
            {
              commentDate
            }
          </span>
        )}


        <div
          className={
            styles.commentList
          }
        >
          {isCommentLoading && (
            <p
              className={
                styles.commentText
              }
            >
              댓글을 불러오는 중입니다.
            </p>
          )}


          {!isCommentLoading &&
            commentError && (
            <p
              className={
                styles.commentText
              }
            >
              {
                commentError
              }
            </p>
          )}


          {!isCommentLoading &&
            !commentError &&
            comments.length ===
              0 && (
              <p
                className={
                  styles.commentText
                }
              >
                아직 댓글이 없습니다.
              </p>
            )}


          {!isCommentLoading &&
            !commentError &&
            comments.map(
              (
                comment
              ) => {
                const isCurrentEditing =
                  editingCommentId ===
                  comment.commentId;


                const isMenuOpen =
                  openMenuId ===
                  comment.commentId;


                const isCurrentDeleting =
                  deletingCommentId ===
                  comment.commentId;


                return (
                  <div
                    key={
                      comment.commentId
                    }
                    className={
                      styles.comment
                    }
                  >
                    <div
                      className={
                        styles.commentAvatar
                      }
                    />


                    <div
                      className={
                        styles.commentContent
                      }
                    >
                      <div
                        className={
                          styles.commentMeta
                        }
                      >
                        <strong>
                          {comment.authorName ||
                            "이름 없음"}
                        </strong>


                        <span
                          className={
                            styles.commentTime
                          }
                        >
                          {formatCommentTime(
                            comment.createdAt
                          )}
                        </span>


                        {comment.editable &&
                          !isCurrentEditing && (
                            <div
                              className={
                                styles.menuWrapper
                              }
                            >
                              <button
                                type="button"
                                className={
                                  styles.moreButton
                                }
                                onClick={() =>
                                  handleMenuClick(
                                    comment.commentId
                                  )
                                }
                                disabled={
                                  isCurrentDeleting
                                }
                              >
                                •••
                              </button>


                              {isMenuOpen && (
                                <div
                                  className={
                                    styles.commentMenu
                                  }
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStartEdit(
                                        comment
                                      )
                                    }
                                  >
                                    수정
                                  </button>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteComment(
                                        comment.commentId
                                      )
                                    }
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                      </div>


                      {isCurrentEditing ? (
                        <div
                          className={
                            styles.editArea
                          }
                        >
                          <textarea
                            value={
                              editingContent
                            }
                            onChange={(
                              event
                            ) =>
                              setEditingContent(
                                event.target
                                  .value
                              )
                            }
                            maxLength={
                              2000
                            }
                            className={
                              styles.editTextarea
                            }
                            disabled={
                              isEditing
                            }
                          />


                          <div
                            className={
                              styles.editActions
                            }
                          >
                            <button
                              type="button"
                              className={
                                styles.cancelEditButton
                              }
                              onClick={
                                handleCancelEdit
                              }
                              disabled={
                                isEditing
                              }
                            >
                              취소
                            </button>


                            <button
                              type="button"
                              className={
                                styles.saveEditButton
                              }
                              onClick={() =>
                                handleSaveEdit(
                                  comment.commentId
                                )
                              }
                              disabled={
                                !editingContent.trim() ||
                                isEditing
                              }
                            >
                              {isEditing
                                ? "저장 중"
                                : "완료"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p
                            className={
                              styles.commentText
                            }
                          >
                            {
                              comment.content
                            }
                          </p>


                          {comment.edited && (
                            <span
                              className={
                                styles.commentRole
                              }
                            >
                              수정됨
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>


      {/* ==================================================
          댓글 작성
      ================================================== */}

      <div
        className={
          styles.writeSection
        }
      >
        <span
          className={
            styles.writeLabel
          }
        >
          댓글 작성
        </span>


        <div
          className={
            styles.writeBox
          }
        >
          <textarea
            value={
              commentText
            }
            onChange={(
              event
            ) =>
              setCommentText(
                event.target
                  .value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            maxLength={
              2000
            }
            aria-label="댓글 작성"
            disabled={
              isSubmitting
            }
          />


          <button
            type="button"
            className={
              styles.sendButton
            }
            onClick={
              handleSubmit
            }
            disabled={
              !commentText.trim() ||
              isSubmitting
            }
          >
            {isSubmitting
              ? "전송 중"
              : "전송"}
          </button>
        </div>
      </div>


      {/* 이슈 상세 */}

      <div
        className={
          styles.detailArea
        }
      >
        <button
          type="button"
          className={
            styles.detailButton
          }
          onClick={
            onDetail
          }
        >
          이슈 상세 정보 →
        </button>
      </div>
    </aside>
  );
}


export default IssueCommentPanel;