import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import IssueColumn from "../IssueColumn/IssueColumn";
import IssueCommentPanel from "../IssueCommentPanel/IssueCommentPanel";

import styles from "./IssueBoard.module.css";


/* =========================
   우선순위
========================= */

const getPriorityText = (
  priority
) => {
  switch (
    priority
  ) {
    case "URGENT":
      return "우선순위 긴급";

    case "HIGH":
      return "우선순위 높음";

    case "MEDIUM":
      return "우선순위 보통";

    case "LOW":
      return "우선순위 낮음";

    default:
      return (
        priority ||
        "-"
      );
  }
};


/* =========================
   날짜
========================= */

const formatDate = (
  dueDate
) => {
  if (!dueDate) {
    return "-";
  }


  const [
    year,
    month,
    day,
  ] =
    dueDate.split("-");


  if (
    !year ||
    !month ||
    !day
  ) {
    return dueDate;
  }


  return `${Number(
    month
  )}월 ${Number(
    day
  )}일`;
};


/* =========================
   지연 여부
========================= */

const isDelayedIssue = (
  dueDate,
  status
) => {
  if (!dueDate) {
    return false;
  }


  if (
    status ===
    "DONE"
  ) {
    return false;
  }


  const today =
    new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );


  const deadline =
    new Date(
      `${dueDate}T00:00:00`
    );


  return (
    deadline <
    today
  );
};


/* =========================
   API Issue → 카드
========================= */

const formatIssue = (
  issue,
  cardStatus
) => {
  const delayed =
    isDelayedIssue(
      issue.dueDate,
      issue.status
    );


  return {
    id:
      issue.issueId,

    issueId:
      issue.issueId,

    title:
      issue.title,

    description:
      issue.description ||
      "",

    priority:
      getPriorityText(
        issue.priority
      ),

    manager:
      issue.assigneeName ||
      "담당자 없음",

    role:
      issue.assigneeRole ||
      "",

    date:
      `${formatDate(
        issue.dueDate
      )}${
        delayed
          ? " 지연됨"
          : ""
      }`,

    commentCount:
      issue.commentCount ??
      0,

    attachmentCount:
      issue.attachmentCount ??
      0,

    checklistDoneCount:
      issue.checklistDoneCount ??
      0,

    checklistTotalCount:
      issue.checklistTotalCount ??
      0,

    status:
      cardStatus,

    delayed,
  };
};


function IssueBoard({
  issues = [],
  onCommentCountChange,
}) {
  const navigate =
    useNavigate();


  const [
    selectedIssue,
    setSelectedIssue,
  ] = useState(null);


  /* =========================
     카드 클릭 → 패널
  ========================= */

  const handleIssueClick =
    (
      issue
    ) => {
      setSelectedIssue(
        issue
      );
    };


  /* =========================
     패널 닫기
  ========================= */

  const handleClosePanel =
    () => {
      setSelectedIssue(
        null
      );
    };


  /* =========================
     이슈 상세
  ========================= */

  const handleViewIssueDetail =
    () => {
      if (
        !selectedIssue?.id
      ) {
        return;
      }


      navigate(
        `/issue/${selectedIssue.id}`
      );
    };


  /* ==================================================
     댓글 개수 변경

     부모 IssueListPage에도 전달하고
     현재 패널의 selectedIssue도 같이 갱신
  ================================================== */

  const handleCommentCountChange =
    (
      issueId,
      count
    ) => {
      onCommentCountChange?.(
        issueId,
        count
      );


      setSelectedIssue(
        (
          prev
        ) => {
          if (
            !prev ||
            Number(
              prev.id
            ) !==
              Number(
                issueId
              )
          ) {
            return prev;
          }


          return {
            ...prev,

            commentCount:
              count,
          };
        }
      );
    };


  /* =========================
     컬럼
  ========================= */

  const todoIssues =
    issues
      .filter(
        (
          issue
        ) =>
          issue.status ===
          "TODO"
      )
      .map(
        (
          issue
        ) =>
          formatIssue(
            issue,
            "todo"
          )
      );


  const progressIssues =
    issues
      .filter(
        (
          issue
        ) =>
          issue.status ===
          "IN_PROGRESS"
      )
      .map(
        (
          issue
        ) =>
          formatIssue(
            issue,
            "progress"
          )
      );


  const reviewIssues =
    issues
      .filter(
        (
          issue
        ) =>
          issue.status ===
          "NEEDS_REVIEW"
      )
      .map(
        (
          issue
        ) =>
          formatIssue(
            issue,
            "check"
          )
      );


  const completeIssues =
    issues
      .filter(
        (
          issue
        ) =>
          issue.status ===
          "DONE"
      )
      .map(
        (
          issue
        ) =>
          formatIssue(
            issue,
            "complete"
          )
      );


  const columns = [
    {
      title:
        "진행 전",

      type:
        "todo",

      issues:
        todoIssues,
    },

    {
      title:
        "진행 중",

      type:
        "progress",

      issues:
        progressIssues,
    },

    {
      title:
        "확인 필요",

      type:
        "check",

      issues:
        reviewIssues,
    },

    {
      title:
        "완료",

      type:
        "complete",

      issues:
        completeIssues,
    },
  ];


  return (
    <>
      <div
        className={
          styles.board
        }
      >
        {columns.map(
          (
            column
          ) => (
            <IssueColumn
              key={
                column.title
              }
              title={
                column.title
              }
              type={
                column.type
              }
              count={
                column.issues
                  .length
              }
              issues={
                column.issues
              }
              onIssueClick={
                handleIssueClick
              }
            />
          )
        )}
      </div>


      {/* =========================
          오른쪽 이슈 패널
      ========================= */}

      {selectedIssue && (
        <IssueCommentPanel
          key={
            selectedIssue.id
          }
          issue={
            selectedIssue
          }
          onClose={
            handleClosePanel
          }
          onDetail={
            handleViewIssueDetail
          }
          onCommentCountChange={
            handleCommentCountChange
          }
        />
      )}
    </>
  );
}


export default IssueBoard;