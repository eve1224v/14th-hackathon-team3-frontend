import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./IssueForm.module.css";

import addIcon from "../../../../assets/icons/addIcon.svg";
import closeIcon from "../../../../assets/icons/closeIcon.svg";
import calendarIcon from "../../../../assets/icons/calendarIcon.svg";
import uploadIcon from "../../../../assets/icons/uploadIcon.svg";
import documentIcon2 from "../../../../assets/icons/documentIcon2.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";


const DEFAULT_CONDITIONS = [
  "결제 API 요구사항 확정",
  "결제 API 요구사항 확정",
  "결제 API 요구사항 확정",
  "결제 API 요구사항 확정",
];


const DEFAULT_FILES = [
  "Global_Launch_Copy_x4.xlsx",
  "Global_Launch_Copy_x4.xlsx",
  "Global_Launch_Copy_x4.xlsx",
  "Global_Launch_Copy_x4.xlsx",
];


const CYCLES = [
  "Cycle 1",
  "Cycle 2",
  "Cycle 3",
  "Cycle 4",
];


function IssueForm({ mode = "create" }) {
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const [priority, setPriority] = useState(
    isEdit ? "normal" : ""
  );

  const [conditions, setConditions] =
    useState(DEFAULT_CONDITIONS);

  const [cycle, setCycle] = useState("");
  const [cycleOpen, setCycleOpen] = useState(false);


  const handleAddCondition = () => {
    setConditions((prev) => [
      ...prev,
      "새 완료 조건",
    ]);
  };


  const handleRemoveCondition = (removeIndex) => {
    setConditions((prev) =>
      prev.filter((_, index) => index !== removeIndex)
    );
  };


  const handleCycleSelect = (value) => {
    setCycle(value);
    setCycleOpen(false);
  };


  const getCycleOptions = () => {
    if (!cycle) {
      return CYCLES;
    }

    const remainingCycles = CYCLES.filter(
      (item) => item !== cycle
    );

    if (cycle === "Cycle 1") {
      return [
        "선택",
        ...remainingCycles,
      ];
    }

    return [
      ...remainingCycles,
      "선택",
    ];
  };


  const handleSubmit = () => {
    navigate("/issue/1");
  };


  return (
    <main
      className={`${styles.form} ${
        isEdit ? styles.editForm : ""
      }`}
    >
      {/* =========================
          상단
      ========================= */}

      <header
        className={`${styles.pageHeader} ${
          isEdit ? styles.editPageHeader : ""
        }`}
      >
        {isEdit ? (
          <>
            <span className={styles.pageLabel}>
              이슈
            </span>

            <h1
              className={`${styles.pageTitle} ${styles.editPageTitle}`}
            >
              앱 출시 전 프로모션 랜딩페이지 최종 연동 및 콘텐츠 검수
            </h1>

            <span className={styles.editCycleBadge}>
              Cycle 3
            </span>
          </>
        ) : (
          <>
            <h1 className={styles.pageTitle}>
              새 이슈 생성
            </h1>

            <p className={styles.pageDescription}>
              새로운 이슈를 생성하고 팀과 함께 해결하세요.
            </p>
          </>
        )}
      </header>


      {/* =========================
          이슈 기본 정보
      ========================= */}

      <section
        className={`${styles.section} ${styles.basicSection}`}
      >
        <h2>
          이슈 기본 정보
        </h2>


        <label className={styles.fieldLabel}>
          이슈 제목
          <span className={styles.requiredDot} />
        </label>


        <input
          type="text"
          className={styles.titleInput}
          defaultValue="앱 출시 전 프로모션 랜딩페이지 최종 연동 및 콘텐츠 검수"
        />


        <span className={styles.priorityTitle}>
          우선순위
        </span>


        <div className={styles.priorityBox}>
          {/* 낮음 */}

          <label className={styles.priorityOption}>
            <input
              type="radio"
              name="priority"
              value="low"
              checked={priority === "low"}
              onChange={() => setPriority("low")}
            />

            <span className={styles.customRadio} />

            <span>
              낮음
            </span>
          </label>


          {/* 보통 */}

          <label className={styles.priorityOption}>
            <input
              type="radio"
              name="priority"
              value="normal"
              checked={priority === "normal"}
              onChange={() => setPriority("normal")}
            />

            <span className={styles.customRadio} />

            <span>
              보통
            </span>
          </label>


          {/* 높음 */}

          <label className={styles.priorityOption}>
            <input
              type="radio"
              name="priority"
              value="high"
              checked={priority === "high"}
              onChange={() => setPriority("high")}
            />

            <span className={styles.customRadio} />

            <span>
              높음
            </span>
          </label>


          {/* 긴급 */}

          <label
            className={`${styles.priorityOption} ${styles.urgentOption}`}
          >
            <input
              type="radio"
              name="priority"
              value="urgent"
              checked={priority === "urgent"}
              onChange={() => setPriority("urgent")}
            />

            <span className={styles.customRadio} />

            <span>
              긴급
            </span>
          </label>
        </div>
      </section>


      {/* =========================
          상세 내용
      ========================= */}

      <section
        className={`${styles.section} ${styles.detailSection}`}
      >
        <h2>
          상세 내용
        </h2>


        <label className={styles.fieldLabel}>
          설명
          <span className={styles.requiredDot} />
        </label>


        <textarea
          className={styles.descriptionInput}
          defaultValue={`글로벌 커머스 앱 리뉴얼 출시와 함께 공개될 프로모션 랜딩페이지의 최종 연동 및 콘텐츠 검수가 필요합니다.

현재 디자인팀에서 랜딩페이지 최종 시안을 전달했으며, 프론트엔드 구현도 대부분 완료된 상태입니다.
다만 마케팅팀에서 전달한 국가별 캠페인 카피와 실제 구현된 문구 일부가 일치하지 않고,
CTA 버튼 클릭 시 앱 설치 페이지로 연결되는 딥링크도 일부 환경에서 정상적으로 동작하지 않는 문제가 확인되었습니다.

출시 일정에 맞추기 위해 한국·영국 버전의 캠페인 문구를 최종 확정하고, 랜딩페이지에 반영된 텍스트 및 이미지 에셋을 검수해야 합니다. 또한 모바일 환경에서 CTA 버튼과 앱스토어 연결이 정상적으로 작동하는지 개발팀과 함께 확인해주세요.

수정 사항이 모두 반영되면 마케팅팀의 최종 승인을 받은 뒤 프로덕션 환경에 배포합니다.`}
        />


        <div className={styles.conditionHeader}>
          <div className={styles.conditionTitleWrap}>
            <span className={styles.conditionTitle}>
              완료 조건
            </span>

            <span className={styles.conditionCount}>
              {conditions.length}개
            </span>
          </div>


          <button
            type="button"
            className={styles.addConditionButton}
            onClick={handleAddCondition}
          >
            <img
              src={addIcon}
              alt=""
              className={styles.addConditionIcon}
            />

            <span>
              항목 추가
            </span>
          </button>
        </div>


        <div className={styles.conditionList}>
          {conditions.map((condition, index) => (
            <div
              key={`${condition}-${index}`}
              className={styles.conditionItem}
            >
              <span className={styles.conditionText}>
                {condition}
              </span>

              <button
                type="button"
                className={styles.removeConditionButton}
                aria-label="완료 조건 삭제"
                onClick={() => handleRemoveCondition(index)}
              >
                <img
                  src={closeIcon}
                  alt=""
                />
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* =========================
          담당 및 일정
      ========================= */}

      <section
        className={`${styles.section} ${styles.scheduleSection}`}
      >
        <h2>
          담당 및 일정
        </h2>


        <div className={styles.scheduleTop}>
          <div className={styles.managerField}>
            <label className={styles.fieldLabel}>
              담당자
              <span className={styles.requiredDot} />
            </label>

            <input
              type="text"
              defaultValue={isEdit ? "홍길동" : ""}
            />
          </div>


          <div className={styles.dateColumn}>
            <label className={styles.fieldLabel}>
              처리 일자
              <span className={styles.requiredDot} />
            </label>

            <div className={styles.dateField}>
              <span>
                ~ 06 / 08 / 2026
              </span>

              <img
                src={calendarIcon}
                alt=""
              />
            </div>
          </div>
        </div>


        {/* Cycle */}

        <div className={styles.cycleField}>
          <label className={styles.fieldLabel}>
            Cycle
            <span className={styles.requiredDot} />
          </label>


          <div className={styles.cycleDropdown}>
            <button
              type="button"
              className={styles.cycleSelect}
              onClick={() =>
                setCycleOpen((prev) => !prev)
              }
            >
              <span
                className={
                  cycle
                    ? styles.cycleSelectedText
                    : styles.cyclePlaceholder
                }
              >
                {cycle || "선택"}
              </span>

              <img
                src={dropdownIcon}
                alt=""
                className={`${styles.cycleDropdownIcon} ${
                  cycleOpen
                    ? styles.cycleDropdownIconOpen
                    : ""
                }`}
              />
            </button>


            {cycleOpen && (
              <div className={styles.cycleMenu}>
                {getCycleOptions().map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={styles.cycleOption}
                    onClick={() =>
                      handleCycleSelect(
                        item === "선택"
                          ? ""
                          : item
                      )
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* =========================
          파일 및 참고 자료
      ========================= */}

      <section
        className={`${styles.section} ${styles.fileSection}`}
      >
        <h2>
          파일 및 참고 자료
        </h2>


        <div className={styles.fileSearch}>
          <img
            src={searchIcon}
            alt=""
          />

          <input
            type="text"
            placeholder="데스크톱 내 파일명 검색"
          />
        </div>


        <span className={styles.fileUploadLabel}>
          파일 첨부
        </span>


        <div className={styles.fileArea}>
          <button
            type="button"
            className={styles.uploadBox}
          >
            <img
              src={uploadIcon}
              alt=""
              className={styles.uploadIcon}
            />

            <span>
              파일을 드래그하거나 클릭해서 업로드
            </span>
          </button>


          <div className={styles.fileList}>
            {DEFAULT_FILES.map((file, index) => (
              <div
                key={`${file}-${index}`}
                className={styles.fileItem}
              >
                <div className={styles.fileNameWrap}>
                  <img
                    src={documentIcon2}
                    alt=""
                  />

                  <span>
                    {file}
                  </span>
                </div>


                <div className={styles.fileRight}>
                  <span className={styles.fileSize}>
                    23.4 KB
                  </span>

                  <button
                    type="button"
                    className={styles.fileRemoveButton}
                    aria-label="파일 삭제"
                  >
                    <img
                      src={closeIcon}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* =========================
          하단
      ========================= */}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => navigate(-1)}
        >
          취소
        </button>

        <button
          type="button"
          className={`${styles.submitButton} ${
            isEdit ? styles.saveButton : ""
          }`}
          onClick={handleSubmit}
        >
          {isEdit ? "저장" : "이슈 생성"}
        </button>
      </div>
    </main>
  );
}


export default IssueForm;