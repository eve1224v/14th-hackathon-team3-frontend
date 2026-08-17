import { useTranslation } from "react-i18next";

function NotificationSetting({
  notificationSettings = {},
  onChange = () => {},
  styles,
}) {
  const { t } = useTranslation();

  const notificationItems = [
    {
      key: "mention",

      title: t("notification.mention"),

      description: t("notification.mentionDescription"),
    },
    {
      key: "issue",

      title: t("notification.issue"),

      description: t("notification.issueDescription"),
    },
    {
      key: "deadline",

      title: t("notification.deadline"),

      description: t("notification.deadlineDescription"),
    },
    {
      key: "message",

      title: t("notification.message"),

      description: t("notification.messageDescription"),
    },
    {
      key: "doNotDisturb",

      title: t("notification.doNotDisturb"),

      description: t("notification.doNotDisturbDescription"),
    },
  ];

  return (
    <div className={styles.systemPage}>
      <h3>{t("notification.title")}</h3>

      <h4>{t("notification.items")}</h4>

      <div className={styles.notificationList}>
        {notificationItems.map(({ key, title, description }) => (
          <div key={key} className={styles.notificationRow}>
            <div>
              <strong>{title}</strong>

              <p>{description}</p>
            </div>

            <label className={styles.systemToggle}>
              <input
                type="checkbox"
                checked={Boolean(notificationSettings[key])}
                onChange={() => onChange(key)}
              />

              <span />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationSetting;
