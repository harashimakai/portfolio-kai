import { motion } from "motion/react";
import CaseList from "./CaseList";
import { children_custom, container_m } from "../../global/AnimationConsts";

interface Props {
  list: object[];
  listTitle: string;
  elemTitle: string;
  dark?: boolean;
}

export default function CaseTriad({
  list,
  listTitle,
  elemTitle,
  dark = false,
}: Props) {
  return (
    <motion.div
      variants={container_m}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="case-triad-cards"
    >
      {list.map((card, index) => (
        <motion.div
          variants={children_custom}
          custom={index * 0.3}
          className={dark ? "case-triad-card-dark" : "case-triad-card-light"}
          key={index}
        >
          <div className="case-triad-title">
            {card[listTitle as keyof typeof card] as string}
          </div>
          <CaseList
            bullets={
              card[elemTitle as keyof typeof card] as unknown as string[]
            }
            time={index * 0.45}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
