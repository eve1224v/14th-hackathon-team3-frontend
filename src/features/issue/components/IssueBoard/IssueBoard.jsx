import IssueColumn from "../IssueColumn/IssueColumn";

import styles from "./IssueBoard.module.css";


const columns = [
  {
    title: "진행 전",
    type: "todo",
    issues: [
      {
        id: 1,
        title: "파트너사 자료 확인",
        description:
          "파트너사가 전달한 API 명세서의 일부 항목을 확인해야 합니다.",
        priority: "우선순위 높음",
        manager: "Emily c",
        role: "Product manager",
        date: "8월 17일",
        commentCount: 1,
        status: "todo",
      },
    ],
  },

  {
    title: "진행 중",
    type: "progress",
    issues: [
      {
        id: 2,
        title: "파트너사 자료 확인",
        description:
          "파트너사가 전달한 API 명세서의 일부 항목을 확인해야 합니다.",
        priority: "우선순위 높음",
        manager: "Emily c",
        role: "Product manager",
        date: "8월 17일 지연됨",
        commentCount: 1,
        status: "progress",
        delayed: true,
      },

      {
        id: 3,
        title: "파트너사 자료 확인",
        description:
          "파트너사가 전달한 API 명세서의 일부 항목을 확인해야 합니다.",
        priority: "우선순위 높음",
        manager: "Emily c",
        role: "Product manager",
        date: "8월 17일",
        commentCount: 1,
        status: "progress",
      },
    ],
  },

  {
    title: "확인 필요",
    type: "check",
    issues: [
      {
        id: 4,
        title: "파트너사 자료 확인",
        description:
          "파트너사가 전달한 API 명세서의 일부 항목을 확인해야 합니다.",
        priority: "우선순위 높음",
        manager: "Emily c",
        role: "Product manager",
        date: "8월 17일",
        commentCount: 1,
        status: "check",
      },
    ],
  },

  {
    title: "완료",
    type: "complete",
    issues: [
      {
        id: 5,
        title: "파트너사 자료 확인",
        description:
          "파트너사가 전달한 API 명세서의 일부 항목을 확인해야 합니다.",
        priority: "우선순위 높음",
        manager: "Emily c",
        role: "Product manager",
        date: "8월 17일",
        commentCount: 1,
        status: "complete",
      },
    ],
  },
];


function IssueBoard() {
  return (
    <div className={styles.board}>
      {columns.map((column) => (
        <IssueColumn
          key={column.title}
          title={column.title}
          type={column.type}
          count={column.issues.length}
          issues={column.issues}
        />
      ))}
    </div>
  );
}


export default IssueBoard;