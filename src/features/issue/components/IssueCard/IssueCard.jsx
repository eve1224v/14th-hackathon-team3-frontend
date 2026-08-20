import {
  useNavigate,
} from "react-router-dom";

import styles from "./IssueCard.module.css";

import editIssueIcon from "../../../../assets/icons/editIssueIcon.svg";
import calendarIcon3 from "../../../../assets/icons/calendarIcon3.svg";
import commentIcon2 from "../../../../assets/icons/commentIcon2.svg";
import sparkleIcon from "../../../../assets/icons/sparkleIcon.svg";


function IssueCard({
  issue,
  onIssueClick,
}) {
  const navigate =
    useNavigate();


  /* =========================
     카드 클릭
     → 오른쪽 패널 열기
  ========================= */

  const handleCardClick =
    () => {
      onIssueClick?.(
        issue
      );
    };


  /* =========================
     수정 버튼
     → 기존 수정 페이지 이동

     카드 클릭 이벤트는 막기
  ========================= */

  const handleEditClick =
    (
      event
    ) => {
      event.stopPropagation();


      navigate(
        `/issue/${issue.id}/edit`
      );
    };


  return (
    <article
      className={`${styles.card} ${styles[issue.status]}`}
      onClick={
        handleCardClick
      }
    >
      {/* 제목 */}

      <strong
        className={
          styles.title
        }
      >
        {
          issue.title
        }
      </strong>


      {/* 수정 */}

      <button
        type="button"
        className={
          styles.editButton
        }
        onClick={
          handleEditClick
        }
        aria-label="이슈 수정"
      >
        <img
          src={
            editIssueIcon
          }
          alt=""
        />
      </button>


      {/* 설명 */}

      <p
        className={
          styles.description
        }
      >
        {
          issue.description
        }
      </p>


      {/* 우선순위 */}

      <span
        className={
          styles.priority
        }
      >
        {
          issue.priority
        }
      </span>


      {/* 담당자 */}

      <div
        className={
          styles.memberRow
        }
      >
        <div
          className={
            styles.avatar
          }
        />


        <div
          className={
            styles.memberText
          }
        >
          <strong>
            {
              issue.manager
            }
          </strong>


          <span>
            {
              issue.role
            }
          </span>
        </div>
      </div>


      {/* 날짜 */}

      <div
        className={`${styles.dateItem} ${
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
          {
            issue.date
          }
        </span>
      </div>


      {/* =========================
          댓글 개수

          이제 클릭용 버튼 아님.
          카드 전체 클릭으로 패널 열림.
      ========================= */}

      <div
        className={
          styles.commentItem
        }
      >
        <img
          src={
            commentIcon2
          }
          alt=""
        />


        <span>
          {
            issue.commentCount
          }
        </span>
      </div>


      {/* AI 감지 */}

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


        <span
          className={
            styles.aiDescription
          }
        >
          추가 자료 요청 필요
        </span>
      </div>
    </article>
  );
}


export default IssueCard;