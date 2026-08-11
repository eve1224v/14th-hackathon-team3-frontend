import { useState } from "react";

import styles from "./OnboardingModal.module.css";

import logo2 from "../../../../assets/icons/logo2.svg";
import rectangle1 from "../../../../assets/icons/rectangle1.svg";
import rectangle2 from "../../../../assets/icons/rectangle2.svg";

function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);

  const userName = "김예티";

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.overlay}>
      <section className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h1>
              환영합니다, <strong>{userName}님!</strong>
            </h1>

            {step === 1 && (
              <>
                <h2>업무 시작 전, 기본 정보를 입력해주세요.</h2>
                <p>
                  함께 일할 팀이 나를 쉽게 이해할 수 있어요.
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2>나의 업무 시간을 설정해주세요.</h2>
                <p>
                  서로의 근무 시간을 알고, 필요한 순간에 업무를 이어갈 수 있어요.
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <h2>함께할 공간을 선택해주세요.</h2>
                <p>
                  새 워크스페이스를 만들거나, 초대받은 팀에 참여할 수 있어요.
                </p>
              </>
            )}
          </div>

          <img
            className={styles.logo}
            src={logo2}
            alt="RelAi"
          />
        </div>

        <div className={styles.progress}>
          <img
            src={step >= 1 ? rectangle1 : rectangle2}
            alt=""
          />

          <img
            src={step >= 2 ? rectangle1 : rectangle2}
            alt=""
          />

          <img
            src={step >= 3 ? rectangle1 : rectangle2}
            alt=""
          />
        </div>

        {step === 1 && (
          <StepOne />
        )}

        {step === 2 && (
          <StepTwo />
        )}

        {step === 3 && (
          <StepThree />
        )}

        {step < 3 ? (
          <button
            type="button"
            className={styles.nextButton}
            onClick={handleNext}
          >
            다음
          </button>
        ) : (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            닫기
          </button>
        )}
      </section>
    </div>
  );
}


/* =========================
   1단계
========================= */

function StepOne() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="company">
              소속 기업
            </label>

            <input
              id="company"
              type="text"
              placeholder="기업 이름을 입력하세요."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="department">
              부서/팀
            </label>

            <input
              id="department"
              type="text"
              placeholder="부서 이름을 입력하세요."
            />

            <input
              type="text"
              placeholder="팀 이름을 입력하세요."
            />
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="position">
              직책
            </label>

            <input
              id="position"
              type="text"
              placeholder="직책 이름을 입력하세요."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="language">
              기본 언어 설정
            </label>

            <select id="language" defaultValue="">
              <option value="" disabled>
                선택
              </option>

              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================
   2단계
========================= */

function StepTwo() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="country">
              국가/시간대
            </label>

            <select id="country" defaultValue="">
              <option value="" disabled>
                국가 및 지역을 선택하세요.
              </option>

              <option value="kr">
                대한민국 / Asia-Seoul
              </option>

              <option value="uk">
                United Kingdom / Europe-London
              </option>
            </select>
          </div>

          <label className={styles.checkboxRow}>
            <input type="checkbox" />

            <span>국가 공휴일 자동 추가</span>
          </label>
        </div>

        <div className={styles.column}>
          <div className={styles.field}>
            <label>
              근무 요일
            </label>

            <div className={styles.weekDays}>
              <button type="button">일</button>
              <button type="button">월</button>
              <button type="button">화</button>
              <button type="button">수</button>
              <button type="button">목</button>
              <button type="button">금</button>
              <button type="button">토</button>
            </div>
          </div>

          <div className={styles.field}>
            <label>
              근무 시작 시간/종료 시간
            </label>

            <input
              type="time"
              aria-label="근무 시작 시간"
            />

            <input
              type="time"
              aria-label="근무 종료 시간"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================
   3단계
========================= */

function StepThree() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.workspaceChoices}>
        <button
          type="button"
          className={styles.workspaceChoice}
        >
          새 워크스페이스 만들기
        </button>

        <button
          type="button"
          className={styles.workspaceChoice}
        >
          초대받은 링크로 팀에 참여하기
        </button>
      </div>
    </div>
  );
}

export default OnboardingModal;