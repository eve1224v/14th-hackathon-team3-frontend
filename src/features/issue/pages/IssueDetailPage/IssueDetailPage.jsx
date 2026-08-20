import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import MainLayout from "../../../../components/MainLayout/MainLayout";
import BackButton from "../../components/BackButton/BackButton";

import styles from "./IssueDetailPage.module.css";

import {
  getIssue,
  deleteIssue,
  updateChecklistItem,
  updateIssueStatus,
  downloadIssueFile,
} from "../../../../api/issueApi";

import {
  getCycles,
} from "../../../../api/cycleApi";

import checkboxIcon from "../../../../assets/icons/checkboxIcon.svg";
import checkboxCheckedIcon from "../../../../assets/icons/checkboxCheckedIcon.svg";
import documentIcon2 from "../../../../assets/icons/documentIcon2.svg";
import closeIcon from "../../../../assets/icons/closeIcon.svg";
import editPencilIcon from "../../../../assets/icons/editPencilIcon.svg";


const PRIORITY_TEXT = {
  LOW: "낮음",
  NORMAL: "보통",
  HIGH: "높음",
  URGENT: "긴급",
};


/* ==================================================
   Cycle 기간 순 정렬
================================================== */

const sortCyclesByPeriod = (
  cycles
) => {
  return [...cycles].sort(
    (a, b) => {
      const startCompare =
        String(
          a.startDate || ""
        ).localeCompare(
          String(
            b.startDate || ""
          )
        );


      if (
        startCompare !== 0
      ) {
        return startCompare;
      }


      const endCompare =
        String(
          a.endDate || ""
        ).localeCompare(
          String(
            b.endDate || ""
          )
        );


      if (
        endCompare !== 0
      ) {
        return endCompare;
      }


      return (
        Number(
          a.cycleId || 0
        ) -
        Number(
          b.cycleId || 0
        )
      );
    }
  );
};


function IssueDetailPage() {
  const navigate =
    useNavigate();


  const {
    issueId,
  } = useParams();


  const [
    issue,
    setIssue,
  ] = useState(null);


  const [
    conditions,
    setConditions,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);


  const [
    cycleLabel,
    setCycleLabel,
  ] = useState("Cycle");


  /* ==================================================
     이슈 상세 조회
  ================================================== */

  useEffect(() => {
    const fetchIssue =
      async () => {
        try {
          setLoading(
            true
          );


          const response =
            await getIssue(
              issueId
            );


          console.log(
            "이슈 상세 조회 성공:",
            response
          );


          const issueData =
            response.data;


          setIssue(
            issueData
          );


          setConditions(
            (
              issueData.checklist ||
              []
            ).map(
              (
                condition
              ) => ({
                id:
                  condition.itemId,

                text:
                  condition.content,

                checked:
                  condition.isDone,
              })
            )
          );


          /* ==================================================
             Cycle N 계산
          ================================================== */

          const projectId =
            issueData.projectId ||
            localStorage.getItem(
              "projectId"
            );


          const currentCycleId =
            issueData.cycleId ||
            localStorage.getItem(
              "cycleId"
            );


          if (
            !projectId ||
            !currentCycleId
          ) {
            console.warn(
              "Cycle N 계산에 필요한 projectId 또는 cycleId가 없습니다.",
              {
                projectId,
                currentCycleId,
              }
            );


            setCycleLabel(
              "Cycle"
            );


            return;
          }


          try {
            const cycleResponse =
              await getCycles(
                projectId
              );


            console.log(
              "이슈 상세 Cycle 목록 조회 성공:",
              cycleResponse
            );


            const cycleList =
              Array.isArray(
                cycleResponse?.data
              )
                ? cycleResponse.data
                : [];


            const sortedCycles =
              sortCyclesByPeriod(
                cycleList
              );


            const cycleIndex =
              sortedCycles.findIndex(
                (
                  cycle
                ) =>
                  Number(
                    cycle.cycleId
                  ) ===
                  Number(
                    currentCycleId
                  )
              );


            const nextCycleLabel =
              cycleIndex >= 0
                ? `Cycle ${
                    cycleIndex + 1
                  }`
                : "Cycle";


            setCycleLabel(
              nextCycleLabel
            );


            console.log(
              "이슈 상세 Cycle 표시:",
              {
                issueId:
                  Number(
                    issueId
                  ),

                cycleId:
                  Number(
                    currentCycleId
                  ),

                originalCycleName:
                  issueData.cycleName,

                cycleLabel:
                  nextCycleLabel,
              }
            );
          } catch (
            cycleError
          ) {
            console.error(
              "이슈 상세 Cycle 목록 조회 실패:",
              cycleError
            );


            console.error(
              "서버 응답:",
              cycleError.response?.data
            );


            setCycleLabel(
              "Cycle"
            );
          }
        } catch (error) {
          console.error(
            "이슈 상세 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          setIssue(
            null
          );
        } finally {
          setLoading(
            false
          );
        }
      };


    if (issueId) {
      fetchIssue();
    }
  }, [
    issueId,
  ]);


  /* ==================================================
     수정
  ================================================== */

  const handleEdit =
    () => {
      navigate(
        `/issue/${issueId}/edit`
      );
    };


  /* ==================================================
     삭제
  ================================================== */

  const handleDelete =
    async () => {
      if (
        isDeleting
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "이 이슈를 삭제하시겠습니까?"
        );


      if (!confirmed) {
        return;
      }


      try {
        setIsDeleting(
          true
        );


        const response =
          await deleteIssue(
            issueId
          );


        console.log(
          "이슈 삭제 성공:",
          response
        );


        navigate(
          "/issue"
        );
      } catch (error) {
        console.error(
          "이슈 삭제 실패:",
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
          alert(
            "존재하지 않는 이슈입니다."
          );


          navigate(
            "/issue"
          );


          return;
        }


        alert(
          responseData?.message ||
            "이슈 삭제에 실패했습니다."
        );
      } finally {
        setIsDeleting(
          false
        );
      }
    };


  /* ==================================================
     완료 조건 체크 변경

     체크리스트
     false → true

     현재 이슈 상태가 TODO라면
     TODO → IN_PROGRESS
  ================================================== */

  const handleToggleCondition =
    async (
      conditionId
    ) => {
      const targetCondition =
        conditions.find(
          (
            condition
          ) =>
            condition.id ===
            conditionId
        );


      if (
        !targetCondition
      ) {
        return;
      }


      const nextChecked =
        !targetCondition.checked;


      try {
        /* =========================
           완료 조건 체크 저장
        ========================= */

        console.log(
          "완료 조건 체크 변경 Payload:",
          {
            issueId:
              Number(
                issueId
              ),

            itemId:
              conditionId,

            isDone:
              nextChecked,
          }
        );


        const response =
          await updateChecklistItem(
            issueId,
            conditionId,
            {
              isDone:
                nextChecked,
            }
          );


        console.log(
          "완료 조건 체크 변경 성공:",
          response
        );


        setConditions(
          (
            prev
          ) =>
            prev.map(
              (
                condition
              ) =>
                condition.id ===
                conditionId
                  ? {
                      ...condition,

                      checked:
                        nextChecked,
                    }

                  : condition
            )
        );


        /* ==================================================
           진행 전 상태에서
           완료 조건을 체크하면 진행 중으로 변경

           체크 해제 시에는 상태를 되돌리지 않음
        ================================================== */

        if (
          nextChecked &&
          issue?.status ===
            "TODO"
        ) {
          console.log(
            "이슈 상태 자동 변경 Payload:",
            {
              issueId:
                Number(
                  issueId
                ),

              status:
                "IN_PROGRESS",
            }
          );


          const statusResponse =
            await updateIssueStatus(
              issueId,
              {
                status:
                  "IN_PROGRESS",
              }
            );


          console.log(
            "이슈 상태 자동 변경 성공:",
            statusResponse
          );


          setIssue(
            (
              prev
            ) =>
              prev
                ? {
                    ...prev,

                    status:
                      "IN_PROGRESS",
                  }

                : prev
          );
        }
      } catch (error) {
        console.error(
          "완료 조건 또는 이슈 상태 변경 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );
      }
    };


  /* ==================================================
     첨부파일 다운로드
  ================================================== */

  const handleDownloadFile =
    async (
      file
    ) => {
      if (
        !file.fileUrl
      ) {
        console.warn(
          "다운로드할 파일 URL이 없습니다."
        );


        return;
      }


      try {
        const url =
          new URL(
            file.fileUrl
          );


        const storedKey =
          decodeURIComponent(
            url.pathname
              .split("/")
              .pop()
          );


        const response =
          await downloadIssueFile(
            storedKey
          );


        const blobUrl =
          window.URL.createObjectURL(
            response.data
          );


        const link =
          document.createElement(
            "a"
          );


        link.href =
          blobUrl;


        link.download =
          file.fileName;


        document.body.appendChild(
          link
        );


        link.click();


        link.remove();


        window.URL.revokeObjectURL(
          blobUrl
        );


        console.log(
          "첨부파일 다운로드 성공:",
          file.fileName
        );
      } catch (error) {
        console.error(
          "첨부파일 다운로드 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );
      }
    };


  /* ==================================================
     완료 조건 개수
  ================================================== */

  const checkedCount =
    conditions.filter(
      (
        condition
      ) =>
        condition.checked
    ).length;


  /* ==================================================
     날짜 표시
  ================================================== */

  const formatDate =
    (
      date
    ) => {
      if (!date) {
        return "-";
      }


      const [
        year,
        month,
        day,
      ] =
        date.split("-");


      return `${day} / ${month} / ${year}`;
    };


  /* ==================================================
     파일 크기
  ================================================== */

  const formatFileSize =
    (
      size
    ) => {
      if (
        size === null ||
        size === undefined
      ) {
        return "-";
      }


      if (
        size < 1024
      ) {
        return `${size} B`;
      }


      if (
        size <
        1024 * 1024
      ) {
        return `${(
          size / 1024
        ).toFixed(
          1
        )} KB`;
      }


      return `${(
        size /
        (
          1024 *
          1024
        )
      ).toFixed(
        1
      )} MB`;
    };


  /* ==================================================
     로딩
  ================================================== */

  if (loading) {
    return (
      <MainLayout>
        <main
          className={
            styles.page
          }
        >
          <p>
            이슈 정보를
            불러오는 중입니다.
          </p>
        </main>
      </MainLayout>
    );
  }


  /* ==================================================
     조회 실패
  ================================================== */

  if (!issue) {
    return (
      <MainLayout>
        <main
          className={
            styles.page
          }
        >
          <p>
            이슈 정보를
            불러오지 못했습니다.
          </p>
        </main>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <main
        className={
          styles.page
        }
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          className={
            styles.header
          }
        >
          <div
            className={
              styles.backButtonWrap
            }
          >
            <BackButton />
          </div>


          <span
            className={
              styles.issueLabel
            }
          >
            이슈
          </span>


          <h1
            className={
              styles.title
            }
          >
            {
              issue.title
            }
          </h1>


          <div
            className={
              styles.metaRow
            }
          >
            <span
              className={
                styles.cycleBadge
              }
            >
              {
                cycleLabel
              }
            </span>


            <span
              className={
                styles.priority
              }
            >
              우선순위 ·{" "}

              <span
                className={
                  issue.priority ===
                  "URGENT"
                    ? styles.urgent
                    : ""
                }
              >
                {PRIORITY_TEXT[
                  issue.priority
                ] ||
                  issue.priority}
              </span>
            </span>
          </div>
        </section>


        {/* ==================================================
            담당자 / 처리 일자
        ================================================== */}

        <section
          className={
            styles.infoRow
          }
        >
          <div
            className={
              styles.managerArea
            }
          >
            <span
              className={
                styles.infoLabel
              }
            >
              담당자
            </span>


            <div
              className={
                styles.managerContent
              }
            >
              <div
                className={
                  styles.avatar
                }
              />


              <div
                className={
                  styles.managerText
                }
              >
                <strong>
                  {issue.assignee
                    ?.name ||
                    "-"}
                </strong>


                <span>
                  {issue.assignee
                    ?.company ||
                    "-"}

                  {" · "}

                  {issue.assignee
                    ?.team ||
                    "-"}

                  {" · "}

                  {issue.assignee
                    ?.position ||
                    "-"}
                </span>
              </div>
            </div>
          </div>


          <div
            className={
              styles.dateArea
            }
          >
            <span
              className={
                styles.infoLabel
              }
            >
              처리 일자
            </span>


            <span
              className={
                styles.dateText
              }
            >
              {formatDate(
                issue.dueDate
              )}
            </span>
          </div>
        </section>


        {/* ==================================================
            내용
        ================================================== */}

        <section
          className={
            styles.contentSection
          }
        >
          <span
            className={
              styles.sectionLabel
            }
          >
            내용
          </span>


          <div
            className={
              styles.contentBox
            }
          >
            <p>
              {
                issue.description
              }
            </p>
          </div>
        </section>


        {/* ==================================================
            완료 조건
        ================================================== */}

        <section
          className={
            styles.conditionSection
          }
        >
          <div
            className={
              styles.sectionTitleRow
            }
          >
            <span
              className={
                styles.sectionLabel
              }
            >
              완료 조건
            </span>


            <span
              className={
                styles.countBadge
              }
            >
              {checkedCount}/
              {
                conditions.length
              }
            </span>
          </div>


          <div
            className={
              styles.conditionList
            }
          >
            {conditions.map(
              (
                condition
              ) => (
                <div
                  key={
                    condition.id
                  }
                  className={
                    styles.conditionItem
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.checkboxButton
                    }
                    aria-label={
                      condition.checked
                        ? "완료 조건 체크 해제"
                        : "완료 조건 체크"
                    }
                    onClick={() =>
                      handleToggleCondition(
                        condition.id
                      )
                    }
                  >
                    <img
                      src={
                        condition.checked
                          ? checkboxCheckedIcon
                          : checkboxIcon
                      }
                      alt=""
                      className={
                        styles.checkbox
                      }
                    />
                  </button>


                  <span>
                    {
                      condition.text
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </section>


        {/* ==================================================
            첨부 파일
        ================================================== */}

        <section
          className={
            styles.fileSection
          }
        >
          <div
            className={
              styles.sectionTitleRow
            }
          >
            <span
              className={
                styles.sectionLabel
              }
            >
              첨부된 파일
            </span>


            <span
              className={
                styles.countBadge
              }
            >
              {issue.attachments
                ?.length ||
                0}
              개
            </span>
          </div>


          <div
            className={
              styles.fileList
            }
          >
            {(
              issue.attachments ||
              []
            ).map(
              (
                file
              ) => (
                <div
                  key={
                    file.attachmentId
                  }
                  className={
                    styles.fileItem
                  }
                >
                  <div
                    className={
                      styles.fileNameArea
                    }
                  >
                    <img
                      src={
                        documentIcon2
                      }
                      alt=""
                      className={
                        styles.documentIcon
                      }
                    />


                    <button
                      type="button"
                      className={
                        styles.fileNameButton
                      }
                      onClick={() =>
                        handleDownloadFile(
                          file
                        )
                      }
                    >
                      {
                        file.fileName
                      }
                    </button>
                  </div>


                  <div
                    className={
                      styles.fileRight
                    }
                  >
                    <span
                      className={
                        styles.fileSize
                      }
                    >
                      {formatFileSize(
                        file.fileSize
                      )}
                    </span>


                    <button
                      type="button"
                      className={
                        styles.fileRemoveButton
                      }
                      aria-label="첨부 파일 삭제"
                    >
                      <img
                        src={
                          closeIcon
                        }
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>


        {/* ==================================================
            하단 버튼
        ================================================== */}

        <div
          className={
            styles.actions
          }
        >
          <button
            type="button"
            className={
              styles.deleteButton
            }
            onClick={
              handleDelete
            }
            disabled={
              isDeleting
            }
          >
            {isDeleting
              ? "삭제 중..."
              : "삭제"}
          </button>


          <button
            type="button"
            className={
              styles.editButton
            }
            onClick={
              handleEdit
            }
          >
            <img
              src={
                editPencilIcon
              }
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