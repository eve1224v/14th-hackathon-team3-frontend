import styles from "./HandoverCard.module.css";

import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";


function countryCodeToFlag(
  countryCode,
) {
  if (!countryCode) {
    return "";
  }

  return countryCode
    .toUpperCase()
    .replace(
      /./g,
      (char) =>
        String.fromCodePoint(
          127397 +
            char.charCodeAt(),
        ),
    );
}


function HandoverCard({
  fromCountry,
  fromTeam,

  toCountry,
  toTeam,

  project,
  cycle,

  completed,
  next,
  questions,
  needsReview,

  notice,

  onView,
}) {
  const hasTeamInfo =
    Boolean(
      fromTeam ||
      toTeam,
    );


  return (
    <article
      className={
        styles.handoverCard
      }
    >
      {/* =========================
          팀 정보

          API에 있을 때만 표시
      ========================= */}

      {hasTeamInfo && (
        <div
          className={
            styles.teamRow
          }
        >
          <span>
            {countryCodeToFlag(
              fromCountry,
            )}

            {fromCountry
              ? " "
              : ""}

            {fromTeam ||
              "-"}
          </span>


          <img
            src={
              rightArrowIcon
            }
            alt=""
          />


          <span>
            {countryCodeToFlag(
              toCountry,
            )}

            {toCountry
              ? " "
              : ""}

            {toTeam ||
              "-"}
          </span>
        </div>
      )}


      {/* =========================
          프로젝트 / Cycle
      ========================= */}

      <h3>
        {project} · {cycle}
      </h3>


      {/* =========================
          인수인계 요약
      ========================= */}

      <div
        className={
          styles.handoverSummary
        }
      >
        <div>
          <span>
            완료된 업무
          </span>

          <strong>
            {completed ?? 0}
          </strong>
        </div>


        <div>
          <span>
            다음 업무
          </span>

          <strong>
            {next ?? 0}
          </strong>
        </div>


        <div>
          <span>
            확인 필요 질문
          </span>

          <strong>
            {questions ?? 0}
          </strong>
        </div>


        <div>
          <span>
            확인 필요
          </span>

          <strong>
            {needsReview ?? 0}
          </strong>
        </div>
      </div>


      <p
        className={
          styles.handoverNotice
        }
      >
        {notice}
      </p>


      {/* =========================
          내용 확인만 이동
      ========================= */}

      <button
        type="button"
        className={
          styles.detailButton
        }
        onClick={
          onView
        }
      >
        <span>
          내용 확인
        </span>


        <img
          src={
            rightArrowIcon
          }
          alt=""
        />
      </button>
    </article>
  );
}


export default HandoverCard;