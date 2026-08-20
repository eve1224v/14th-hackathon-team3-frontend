import styles from "./HandoverItem.module.css";

import editPencilIcon from "../../../../assets/icons/editPencilIcon.svg";


function HandoverItem({
  itemId,
  title,
  description,
  manager,
  onEdit,
}) {
  return (
    <div
      className={
        styles.itemRow
      }
    >
      <article
        className={
          styles.item
        }
      >
        <strong
          className={
            styles.title
          }
        >
          {title}
        </strong>


        <p
          className={
            styles.description
          }
        >
          {description}
        </p>


        <span
          className={
            styles.manager
          }
        >
          담당자 · {manager}
        </span>
      </article>


      <button
        type="button"
        className={
          styles.editButton
        }
        onClick={() =>
          onEdit(itemId)
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
  );
}


export default HandoverItem;