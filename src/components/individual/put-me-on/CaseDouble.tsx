import { motion } from "motion/react";
import { children_custom, container_m } from "../../global/AnimationConsts";
import CaseList from "./CaseList";
import CasePill from "./CasePill";

interface Props {
  image1: string;
  image1Label: string;
  pillText1: string;
  columnHeading1: string;
  columnSubheading1: string;
  columnBullets1: string[];
  image2: string;
  image2Label: string;
  pillText2: string;
  columnHeading2: string;
  columnSubheading2: string;
  columnBullets2: string[];
}

export default function CaseDouble({
  image1,
  image1Label,
  pillText1,
  columnHeading1,
  columnSubheading1,
  columnBullets1,
  image2,
  image2Label,
  pillText2,
  columnHeading2,
  columnSubheading2,
  columnBullets2,
}: Props) {
  return (
    <div
      className="case-double-content"
      style={{ gap: 56 }}
    >
      <div>
        <motion.div
          variants={children_custom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="case-wire-container"
        >
          <img
            src={image1}
            alt="Lo-Fi Prototype"
            className="case-wire-image"
          />
          <div className="case-wire-caption">{image1Label}</div>
        </motion.div>
        <motion.div
          variants={children_custom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <CasePill>{pillText1}</CasePill>
        </motion.div>
        <motion.div
          variants={container_m}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h1
            variants={children_custom}
            custom={0.15}
            className="case-section-small-subheading case-light"
          >
            {columnHeading1}
          </motion.h1>
          <motion.div
            variants={children_custom}
            custom={0.3}
            className="case-section-meta case-accent"
          >
            {columnSubheading1}
          </motion.div>
        </motion.div>
        <CaseList
          bullets={columnBullets1}
          time={0.45}
        />
      </div>

      <div>
        <motion.div
          variants={children_custom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="case-wire-container"
        >
          <img
            src={image2}
            alt="Lo-Fi Prototype"
            className="case-wire-image"
          />
          <div className="case-wire-caption">{image2Label}</div>
        </motion.div>
        <motion.div
          variants={children_custom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <CasePill>{pillText2}</CasePill>
        </motion.div>
        <motion.div
          variants={container_m}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h1
            variants={children_custom}
            custom={0.15}
            className="case-section-small-subheading case-light"
          >
            {columnHeading2}
          </motion.h1>
          <motion.div
            variants={children_custom}
            custom={0.3}
            className="case-section-meta case-accent"
          >
            {columnSubheading2}
          </motion.div>
        </motion.div>
        <CaseList
          bullets={columnBullets2}
          time={0.45}
        />
      </div>
    </div>
  );
}
