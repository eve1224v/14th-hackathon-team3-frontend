import styles from "./CycleSummary.module.css";


const PROGRESS_SIZE =
  153;

const PROGRESS_STROKE =
  14.5;


/* =========================
   상태 표시
========================= */

const getStatusText = (
  status
) => {
  switch (status) {
    case "IN_PROGRESS":
      return "진행 중";

    case "COMPLETED":
      return "완료";

    case "PLANNED":
      return "예정";

    default:
      return status || "";
  }
};


/* =========================
   날짜 표시
========================= */

const formatNextDate = (
  date
) => {
  if (!date) {
    return "-";
  }

  return date;
};


function CycleSummary({
  cycleData,
}) {
  const progress =
    cycleData.progress ??
    0;

  const radius =
    (
      PROGRESS_SIZE -
      PROGRESS_STROKE
    ) / 2;

  const center =
    PROGRESS_SIZE / 2;

  const circumference =
    2 *
    Math.PI *
    radius;

  const offset =
    circumference -
    (
      progress /
      100
    ) *
      circumference;


  /* =========================
     기간
  ========================= */

  const period =
    cycleData.startDate &&
    cycleData.endDate
      ? `${cycleData.startDate} ~ ${cycleData.endDate}${
          cycleData.status ===
          "IN_PROGRESS"
            ? " 예정"
            : ""
        }`
      : cycleData.period ||
        "-";


  /* =========================
     D-Day
  ========================= */

  const dDayText =
    cycleData.dDay ===
      null ||
    cycleData.dDay ===
      undefined
      ? null
      : typeof cycleData.dDay ===
          "number"
        ? cycleData.dDay >= 0
          ? `D-${cycleData.dDay}`
          : `D+${Math.abs(
              cycleData.dDay
            )}`
        : cycleData.dDay;


  return (
    <section
      className={
        styles.summary
      }
    >
      {/* =========================
          진행률
      ========================= */}

      <div
        className={
          styles.progressArea
        }
      >
        <div
          className={
            styles.progressCircle
          }
        >
          <svg
            width={
              PROGRESS_SIZE
            }
            height={
              PROGRESS_SIZE
            }
            viewBox={`0 0 ${PROGRESS_SIZE} ${PROGRESS_SIZE}`}
            className={
              styles.progressSvg
            }
          >
            <defs>
              <linearGradient
                id="cycleProgressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#6D7CFF"
                />

                <stop
                  offset="100%"
                  stopColor="#4D67FF"
                />
              </linearGradient>
            </defs>


            <circle
              cx={
                center
              }
              cy={
                center
              }
              r={
                radius
              }
              stroke="#343a5a"
              strokeWidth={
                PROGRESS_STROKE
              }
              fill="none"
              strokeLinecap="round"
            />


            <circle
              cx={
                center
              }
              cy={
                center
              }
              r={
                radius
              }
              stroke="url(#cycleProgressGradient)"
              strokeWidth={
                PROGRESS_STROKE
              }
              fill="none"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                offset
              }
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </svg>


          <div
            className={
              styles.progressInner
            }
          >
            <strong>
              {progress}%
            </strong>

            <span>
              진행률
            </span>
          </div>
        </div>
      </div>


      {/* =========================
          현재 사이클
      ========================= */}

      <div
        className={
          styles.currentCycle
        }
      >
        <div
          className={
            styles.cycleTitle
          }
        >
          <span
            className={
              styles.blueDot
            }
          />

          <strong>
            {
              cycleData.name
            }{" "}
            {
              getStatusText(
                cycleData.status
              )
            }
          </strong>
        </div>


        <div
          className={
            styles.periodRow
          }
        >
          <span>
            {period}
          </span>


          {dDayText && (
            <span
              className={
                styles.dayBadge
              }
            >
              {dDayText}
            </span>
          )}
        </div>


        <div
          className={
            styles.statistics
          }
        >
          {(
            cycleData.statistics ||
            []
          ).map(
            (
              item
            ) => (
              <div
                key={
                  item.label
                }
                className={
                  styles.statItem
                }
              >
                <span>
                  {
                    item.label
                  }
                </span>

                <strong>
                  {
                    item.value
                  }
                </strong>
              </div>
            )
          )}
        </div>
      </div>


      {/* =========================
          다음 사이클
      ========================= */}

      <div
        className={
          styles.nextCycle
        }
      >
        <div
          className={
            styles.nextTitleRow
          }
        >
          <span>
            다음 사이클
          </span>


          {cycleData.nextCycle ? (
            <span
              className={
                styles.nextBadge
              }
            >
              {
                cycleData
                  .nextCycle
                  .name
              }
            </span>
          ) : (
            <span
              className={
                styles.nextBadge
              }
            >
              없음
            </span>
          )}
        </div>


        <span
          className={
            styles.expected
          }
        >
          예정 시작일
        </span>


        <strong
          className={
            styles.nextDate
          }
        >
          {cycleData.nextCycle
            ? formatNextDate(
                cycleData
                  .nextCycle
                  .startDate
              )
            : "-"}
        </strong>
      </div>
    </section>
  );
}


export default CycleSummary;