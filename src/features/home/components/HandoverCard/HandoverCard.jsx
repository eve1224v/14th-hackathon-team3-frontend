import styles from "./HandoverCard.module.css";

import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";


function countryCodeToFlag(countryCode) {
  if (!countryCode) {
    return "";
  }

  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
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
  approvals,
}) {
  return (
    <article className={styles.handoverCard}>
      <div className={styles.teamRow}>
        <span>
          {countryCodeToFlag(fromCountry)}
          {" "}
          {fromTeam}
        </span>

        <img
          src={rightArrowIcon}
          alt=""
        />

        <span>
          {countryCodeToFlag(toCountry)}
          {" "}
          {toTeam}
        </span>
      </div>

      <h3>
        {project} · {cycle}
      </h3>

      <div className={styles.handoverSummary}>
        <div>
          <span>완료된 업무</span>
          <strong>{completed}</strong>
        </div>

        <div>
          <span>다음 업무</span>
          <strong>{next}</strong>
        </div>

        <div>
          <span>확인 필요 질문</span>
          <strong>{questions}</strong>
        </div>

        <div>
          <span>승인 필요</span>
          <strong>{approvals}</strong>
        </div>
      </div>

      <p className={styles.handoverNotice}>
        AI가 12분 전에 인수인계를 업데이트했습니다.
      </p>

      <button
        type="button"
        className={styles.detailButton}
      >
        <span>
          내용 확인
        </span>

        <img
          src={rightArrowIcon}
          alt=""
        />
      </button>
    </article>
  );
}


export default HandoverCard;