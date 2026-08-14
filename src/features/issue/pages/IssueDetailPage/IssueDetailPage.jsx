import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../components/MainLayout/MainLayout";
import styles from "./IssueDetailPage.module.css";

import checkboxIcon from "../../../../assets/icons/checkboxIcon.svg";
import checkboxCheckedIcon from "../../../../assets/icons/checkboxCheckedIcon.svg";
import documentIcon2 from "../../../../assets/icons/documentIcon2.svg";
import closeIcon from "../../../../assets/icons/closeIcon.svg";
import editPencilIcon from "../../../../assets/icons/editPencilIcon.svg";


const CONDITIONS = [
  {
    id: 1,
    text: "결제 API 요구사항 확정",
    checked: true,
  },
  {
    id: 2,
    text: "결제 API 요구사항 확정",
    checked: true,
  },
  {
    id: 3,
    text: "결제 API 요구사항 확정",
    checked: false,
  },
  {
    id: 4,
    text: "결제 API 요구사항 확정",
    checked: false,
  },
];


const FILES = [
  {
    id: 1,
    name: "Global_Launch_Copy_x4.xlsx",
    size: "23.4 KB",
  },
  {
    id: 2,
    name: "Global_Launch_Copy_x4.xlsx",
    size: "23.4 KB",
  },
  {
    id: 3,
    name: "Global_Launch_Copy_x4.xlsx",
    size: "23.4 KB",
  },
  {
    id: 4,
    name: "Global_Launch_Copy_x4.xlsx",
    size: "23.4 KB",
  },
];


function IssueDetailPage() {
  const navigate = useNavigate();
  const { issueId } = useParams();


  const handleEdit = () => {
    navigate(`/issue/${issueId}/edit`);
  };


  const handleDelete = () => {
    navigate("/issue");
  };


  return (
    <MainLayout>
      <main className={styles.page}>
        {/* =========================
            상단
        ========================= */}

        <section className={styles.header}>
          <span className={styles.issueLabel}>
            이슈
          </span>

          <h1 className={styles.title}>
            앱 출시 전 프로모션 랜딩페이지 최종 연동 및 콘텐츠 검수
          </h1>

          <div className={styles.metaRow}>
            <span className={styles.cycleBadge}>
              Cycle 3
            </span>

            <span className={styles.priority}>
              우선순위 ·{" "}
              <span className={styles.urgent}>
                긴급
              </span>
            </span>
          </div>
        </section>


        {/* =========================
            담당자 / 처리 일자
        ========================= */}

        <section className={styles.infoRow}>
          <div className={styles.managerArea}>
            <span className={styles.infoLabel}>
              담당자
            </span>

            <div className={styles.managerContent}>
              <div className={styles.avatar} />

              <div className={styles.managerText}>
                <strong>
                  김서연
                </strong>

                <span>
                  기업 A · Design · Product Designer
                </span>
              </div>
            </div>
          </div>


          <div className={styles.dateArea}>
            <span className={styles.infoLabel}>
              처리 일자
            </span>

            <span className={styles.dateText}>
              06 / 08 / 2026
            </span>
          </div>
        </section>


        {/* =========================
            내용
        ========================= */}

        <section className={styles.contentSection}>
          <span className={styles.sectionLabel}>
            내용
          </span>

          <div className={styles.contentBox}>
            <p>
              글로벌 커머스 앱 리뉴얼 출시와 함께 공개될 프로모션
              랜딩페이지의 최종 연동 및 콘텐츠 검수가 필요합니다.
            </p>

            <p>
              현재 디자인팀에서 랜딩페이지 최종 시안을 전달했으며,
              프론트엔드 구현도 대부분 완료된 상태입니다.
              <br />
              다만 마케팅팀에서 전달한 국가별 캠페인 카피와 실제
              구현된 문구 일부가 일치하지 않고,
              <br />
              CTA 버튼 클릭 시 앱 설치 페이지로 연결되는 딥링크도
              일부 환경에서 정상적으로 동작하지 않는 문제가
              확인되었습니다.
            </p>

            <p>
              출시 일정에 맞추기 위해 한국·영국 버전의 캠페인
              문구를 최종 확정하고, 랜딩페이지에 반영된 텍스트 및
              이미지 에셋을 검수해야 합니다. 또한 모바일 환경에서
              CTA 버튼과 앱스토어 연결이 정상적으로 작동하는지
              개발팀과 함께 확인해주세요.
            </p>

            <p>
              수정 사항이 모두 반영되면 마케팅팀의 최종 승인을
              받은 뒤 프로덕션 환경에 배포합니다.
            </p>
          </div>
        </section>


        {/* =========================
            완료 조건
        ========================= */}

        <section className={styles.conditionSection}>
          <div className={styles.sectionTitleRow}>
            <span className={styles.sectionLabel}>
              완료 조건
            </span>

            <span className={styles.countBadge}>
              2/4
            </span>
          </div>

          <div className={styles.conditionList}>
            {CONDITIONS.map((condition) => (
              <div
                key={condition.id}
                className={styles.conditionItem}
              >
                <img
                  src={
                    condition.checked
                      ? checkboxCheckedIcon
                      : checkboxIcon
                  }
                  alt=""
                  className={styles.checkbox}
                />

                <span>
                  {condition.text}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* =========================
            첨부된 파일
        ========================= */}

        <section className={styles.fileSection}>
          <div className={styles.sectionTitleRow}>
            <span className={styles.sectionLabel}>
              첨부된 파일
            </span>

            <span className={styles.countBadge}>
              4개
            </span>
          </div>

          <div className={styles.fileList}>
            {FILES.map((file) => (
              <div
                key={file.id}
                className={styles.fileItem}
              >
                <div className={styles.fileNameArea}>
                  <img
                    src={documentIcon2}
                    alt=""
                    className={styles.documentIcon}
                  />

                  <span className={styles.fileName}>
                    {file.name}
                  </span>
                </div>

                <div className={styles.fileRight}>
                  <span className={styles.fileSize}>
                    {file.size}
                  </span>

                  <button
                    type="button"
                    className={styles.fileRemoveButton}
                    aria-label="첨부 파일 삭제"
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
        </section>


        {/* =========================
            하단 버튼
        ========================= */}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            삭제
          </button>

          <button
            type="button"
            className={styles.editButton}
            onClick={handleEdit}
          >
            <img
              src={editPencilIcon}
              alt=""
            />

            <span>
              수정
            </span>
          </button>
        </div>
      </main>
    </MainLayout>
  );
}


export default IssueDetailPage;